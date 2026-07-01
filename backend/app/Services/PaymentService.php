<?php

namespace App\Services;

use App\Events\PaymentProcessed;
use App\Models\Booking;
use App\Models\Payment;
use App\Models\Wallet;
use App\Models\WalletTransaction;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Str;

class PaymentService
{
    const COMMISSION_RATE = 10.0;

    public function __construct(
        private ZenoPayService   $zenoPay,
        private SnippePayService $snippe,
    ) {}

    /**
     * Initiate payment.
     * Mobile money → Snippe STK push.
     * Card → ZenoPay (if configured).
     */
    public function initiate(Booking $booking, array $data): array
    {
        if ($booking->payment && $booking->payment->isCompleted()) {
            return ['success' => false, 'message' => 'Booking already paid', 'payment' => $booking->payment];
        }

        $payment = $booking->payment ?? $this->createPaymentRecord($booking, $data);

        // Always update method/phone on re-initiate and force gateway to snippe
        $payment->update([
            'payment_method' => $data['payment_method'],
            'phone_number'   => $data['phone_number'] ?? null,
            'status'         => 'pending',
            'gateway'        => 'snippe',
        ]);

        $isMobileMoney = in_array($data['payment_method'], ['mpesa', 'airtel', 'tigopesa', 'halopesa']);

        if ($isMobileMoney) {
            $result = $this->snippe->initiatePayment(
                userId:         (string) $booking->customer_id,
                recipientId:    (string) $booking->technician_id,
                amount:         $payment->amount,
                paymentMethod:  $data['payment_method'],
                paymentAccount: $data['phone_number'],
            );

            if (!$result['success']) {
                return ['success' => false, 'message' => $result['message'], 'payment' => $payment];
            }

            $payment->update([
                'gateway_reference' => $result['order_id'],
                'meta'              => array_merge($payment->meta ?? [], [
                    'snippe_order_id' => $result['order_id'],
                ]),
            ]);

            $booking->update(['status' => 'awaiting_payment']);

            return [
                'success'  => true,
                'message'  => 'Payment request sent to your phone. Enter your PIN to complete.',
                'payment'  => $payment->fresh(),
                'order_id' => $result['order_id'],
            ];
        }

        // Card — use ZenoPay if credentials exist, otherwise mark manual
        $zenoKey = config('services.zenopay.api_key');

        if ($zenoKey) {
            $result = $this->zenoPay->initiatePayment(
                phone:       $data['phone_number'] ?? '',
                amount:      $payment->amount,
                reference:   $payment->reference,
                callbackUrl: url('/api/payments/webhook'),
            );

            if (!$result['success']) {
                return ['success' => false, 'message' => $result['message'], 'payment' => $payment];
            }

            $payment->update([
                'gateway'           => 'zenopay',
                'gateway_reference' => $result['order_id'],
                'meta'              => array_merge($payment->meta ?? [], [
                    'zenopay_order_id' => $result['order_id'],
                ]),
            ]);
        } else {
            $payment->update(['gateway' => 'manual']);
        }

        $booking->update(['status' => 'awaiting_payment']);

        return ['success' => true, 'message' => 'Payment initiated', 'payment' => $payment->fresh()];
    }

    /**
     * Poll payment status — checks correct gateway based on payment record.
     */
    public function verify(Payment $payment): array
    {
        $gateway = $payment->gateway ?? 'snippe';
        $orderId = $payment->meta['snippe_order_id']
            ?? $payment->meta['zenopay_order_id']
            ?? $payment->gateway_reference;

        if (!$orderId) {
            return ['success' => false, 'status' => 'PENDING', 'message' => 'No order ID found'];
        }

        $result = $gateway === 'zenopay'
            ? $this->zenoPay->checkStatus($orderId)
            : $this->snippe->checkStatus($orderId);

        if ($result['status'] === 'COMPLETED') {
            $txId = $result['transaction_id'] ?? $orderId;
            $this->complete($payment, $orderId, $txId);
            return ['success' => true, 'status' => 'COMPLETED', 'message' => 'Payment confirmed'];
        }

        if (in_array($result['status'], ['FAILED', 'CANCELLED'])) {
            $this->fail($payment, $result['message']);
            return ['success' => false, 'status' => $result['status'], 'message' => $result['message']];
        }

        return ['success' => false, 'status' => 'PENDING', 'message' => 'Payment still pending'];
    }

    /**
     * Handle webhook from Snippe or ZenoPay.
     */
    public function handleWebhook(array $payload, string $gateway = 'snippe'): bool
    {
        Log::info("{$gateway} webhook received", $payload);

        $orderId       = $payload['order_id'] ?? null;
        $rawStatus     = strtoupper($payload['status'] ?? $payload['payment_status'] ?? '');
        $transactionId = $payload['transaction_id'] ?? $orderId;

        $status = match (true) {
            str_contains($rawStatus, 'COMPLET') => 'COMPLETED',
            str_contains($rawStatus, 'FAIL')    => 'FAILED',
            str_contains($rawStatus, 'CANCEL')  => 'CANCELLED',
            default                             => 'PENDING',
        };

        if (!$orderId) {
            Log::warning("{$gateway} webhook missing order_id", $payload);
            return false;
        }

        $payment = Payment::where('gateway_reference', $orderId)
            ->orWhereJsonContains('meta->snippe_order_id', $orderId)
            ->orWhereJsonContains('meta->zenopay_order_id', $orderId)
            ->first();

        if (!$payment) {
            Log::warning("{$gateway} webhook: payment not found", ['order_id' => $orderId]);
            return false;
        }

        if ($payment->isCompleted()) {
            return true;
        }

        if ($status === 'COMPLETED') {
            $this->complete($payment, $orderId, $transactionId);
            return true;
        }

        if (in_array($status, ['FAILED', 'CANCELLED'])) {
            $this->fail($payment, $payload['message'] ?? $status);
            return true;
        }

        return false;
    }

    public function complete(Payment $payment, string $gatewayReference, string $transactionId): Payment
    {
        return DB::transaction(function () use ($payment, $gatewayReference, $transactionId) {
            $payment->update([
                'status'            => 'completed',
                'gateway_reference' => $gatewayReference,
                'transaction_id'    => $transactionId,
                'paid_at'           => now(),
            ]);

            $payment->booking->update(['status' => 'paid', 'paid_at' => now()]);

            $this->creditWallet($payment);

            PaymentProcessed::dispatch($payment->fresh());

            return $payment->fresh();
        });
    }

    public function fail(Payment $payment, string $reason): Payment
    {
        $payment->update(['status' => 'failed', 'failure_reason' => $reason]);

        if ($payment->booking->status === 'awaiting_payment') {
            $payment->booking->update(['status' => 'accepted']);
        }

        return $payment->fresh();
    }

    private function createPaymentRecord(Booking $booking, array $data): Payment
    {
        $amount           = (float) $data['amount'];
        $commissionRate   = self::COMMISSION_RATE;
        $platformFee      = round($amount * $commissionRate / 100, 2);
        $technicianPayout = round($amount - $platformFee, 2);

        return Payment::create([
            'booking_id'        => $booking->id,
            'customer_id'       => $booking->customer_id,
            'technician_id'     => $booking->technician_id,
            'reference'         => 'PAY-' . strtoupper(Str::random(12)),
            'amount'            => $amount,
            'platform_fee'      => $platformFee,
            'technician_payout' => $technicianPayout,
            'commission_rate'   => $commissionRate,
            'currency'          => 'TZS',
            'status'            => 'pending',
            'payment_method'    => $data['payment_method'],
            'gateway'           => 'snippe',
            'phone_number'      => $data['phone_number'] ?? null,
        ]);
    }

    private function creditWallet(Payment $payment): void
    {
        $wallet = Wallet::firstOrCreate(
            ['technician_id' => $payment->technician_id],
            ['currency' => 'TZS', 'balance' => 0, 'pending_balance' => 0, 'total_earned' => 0, 'total_withdrawn' => 0]
        );

        $balanceBefore = $wallet->balance;
        $balanceAfter  = $balanceBefore + $payment->technician_payout;

        $wallet->increment('balance', $payment->technician_payout);
        $wallet->increment('total_earned', $payment->technician_payout);

        WalletTransaction::create([
            'wallet_id'      => $wallet->id,
            'technician_id'  => $payment->technician_id,
            'payment_id'     => $payment->id,
            'booking_id'     => $payment->booking_id,
            'type'           => 'credit',
            'amount'         => $payment->technician_payout,
            'balance_before' => $balanceBefore,
            'balance_after'  => $balanceAfter,
            'description'    => "Payment for booking #{$payment->booking->booking_number}",
            'reference'      => 'WTX-' . strtoupper(Str::random(10)),
            'status'         => 'completed',
        ]);
    }

    public function debitWallet(Wallet $wallet, float $amount, string $description): WalletTransaction
    {
        $balanceBefore = $wallet->balance;
        $balanceAfter  = $balanceBefore - $amount;

        $wallet->decrement('balance', $amount);
        $wallet->increment('total_withdrawn', $amount);

        return WalletTransaction::create([
            'wallet_id'      => $wallet->id,
            'technician_id'  => $wallet->technician_id,
            'type'           => 'debit',
            'amount'         => $amount,
            'balance_before' => $balanceBefore,
            'balance_after'  => $balanceAfter,
            'description'    => $description,
            'reference'      => 'WTX-' . strtoupper(Str::random(10)),
            'status'         => 'completed',
        ]);
    }
}
