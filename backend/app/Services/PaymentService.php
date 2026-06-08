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

    public function __construct(private ZenoPayService $zenoPay) {}

    /**
     * Initiate payment via ZenoPay STK push.
     * Creates payment record + fires STK push to customer's phone.
     */
    public function initiate(Booking $booking, array $data): array
    {
        // Prevent duplicate pending payments
        if ($booking->payment && $booking->payment->isCompleted()) {
            return ['success' => false, 'message' => 'Booking already paid', 'payment' => $booking->payment];
        }

        // Reuse or create payment record
        $payment = $booking->payment ?? $this->createPaymentRecord($booking, $data);

        // Update phone/method if re-initiating
        if ($booking->payment) {
            $payment->update([
                'payment_method' => $data['payment_method'],
                'phone_number'   => $data['phone_number'] ?? null,
                'status'         => 'pending',
            ]);
        }

        $isMobileMoney = in_array($data['payment_method'], ['mpesa', 'airtel', 'tigopesa', 'halopesa']);

        if ($isMobileMoney) {
            $result = $this->zenoPay->initiatePayment(
                phone:       $data['phone_number'],
                amount:      $payment->amount,
                reference:   $payment->reference,
                callbackUrl: url('/api/payments/webhook')
            );

            if (!$result['success']) {
                return ['success' => false, 'message' => $result['message'], 'payment' => $payment];
            }

            // Store the ZenoPay order_id for status polling / webhook matching
            $payment->update([
                'gateway_reference' => $result['order_id'],
                'meta'              => array_merge($payment->meta ?? [], ['zenopay_order_id' => $result['order_id']]),
            ]);

            // Transition booking to awaiting_payment
            $booking->update(['status' => 'awaiting_payment']);

            return [
                'success'  => true,
                'message'  => 'Payment request sent to your phone. Enter your PIN to complete.',
                'payment'  => $payment->fresh(),
                'order_id' => $result['order_id'],
            ];
        }

        // Card/cash — return payment record for manual handling
        $booking->update(['status' => 'awaiting_payment']);

        return ['success' => true, 'message' => 'Payment initiated', 'payment' => $payment];
    }

    /**
     * Poll ZenoPay for payment status (called by frontend polling or manual verify).
     */
    public function verify(Payment $payment): array
    {
        $orderId = $payment->meta['zenopay_order_id'] ?? $payment->gateway_reference;

        if (!$orderId) {
            return ['success' => false, 'status' => 'PENDING', 'message' => 'No order ID found'];
        }

        $result = $this->zenoPay->checkStatus($orderId);

        if ($result['status'] === 'COMPLETED') {
            $this->complete($payment, $orderId, $result['raw']['transaction_id'] ?? $orderId);
            return ['success' => true, 'status' => 'COMPLETED', 'message' => 'Payment confirmed'];
        }

        if ($result['status'] === 'FAILED' || $result['status'] === 'CANCELLED') {
            $this->fail($payment, $result['message']);
            return ['success' => false, 'status' => $result['status'], 'message' => $result['message']];
        }

        return ['success' => false, 'status' => 'PENDING', 'message' => 'Payment still pending'];
    }

    /**
     * Process ZenoPay webhook callback.
     * Called automatically by ZenoPay after STK push completes.
     */
    public function handleWebhook(array $payload): bool
    {
        Log::info('ZenoPay webhook received', $payload);

        $orderId       = $payload['order_id']      ?? null;
        $status        = strtoupper($payload['payment_status'] ?? '');
        $transactionId = $payload['transaction_id'] ?? $orderId;

        if (!$orderId) {
            Log::warning('ZenoPay webhook missing order_id', $payload);
            return false;
        }

        // Find payment by gateway_reference (ZenoPay order_id)
        $payment = Payment::where('gateway_reference', $orderId)
            ->orWhereJsonContains('meta->zenopay_order_id', $orderId)
            ->first();

        if (!$payment) {
            Log::warning('ZenoPay webhook: payment not found', ['order_id' => $orderId]);
            return false;
        }

        if ($payment->isCompleted()) {
            Log::info('ZenoPay webhook: already completed', ['payment_id' => $payment->id]);
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

    /**
     * Mark payment completed, update booking to 'paid', credit wallet, fire event.
     */
    public function complete(Payment $payment, string $gatewayReference, string $transactionId): Payment
    {
        return DB::transaction(function () use ($payment, $gatewayReference, $transactionId) {
            $payment->update([
                'status'            => 'completed',
                'gateway_reference' => $gatewayReference,
                'transaction_id'    => $transactionId,
                'paid_at'           => now(),
            ]);

            // Update booking status to 'paid'
            $payment->booking->update([
                'status'  => 'paid',
                'paid_at' => now(),
            ]);

            // Credit technician wallet
            $this->creditWallet($payment);

            // Fire event — listener handles all emails + notifications
            PaymentProcessed::dispatch($payment->fresh());

            return $payment->fresh();
        });
    }

    /**
     * Mark payment as failed.
     */
    public function fail(Payment $payment, string $reason): Payment
    {
        $payment->update(['status' => 'failed', 'failure_reason' => $reason]);

        // Revert booking to accepted so customer can retry
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
            'gateway'           => 'zenopay',
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

    public function debitWallet(Wallet $wallet, float $amount, string $description, ?int $bookingId = null): WalletTransaction
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
