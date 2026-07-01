<?php

namespace App\Services;

use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

/**
 * Snippe Payment Gateway Service
 *
 * Handles mobile-money USSD push payments via the Snippe API.
 * Base URL: https://payments.hasethospital.or.tz/public/api
 *
 * Endpoints:
 *   POST /payment/initiate  — trigger STK push
 *   GET  /payment/status    — poll for completion
 *   POST /payment/cancel    — cancel a pending payment
 */
class SnippePayService
{
    private string $baseUrl;
    private ?string $apiKey;

    /** Maps our internal method names to Snippe provider strings */
    public const PROVIDERS = [
        'mpesa'    => 'Vodacom',
        'airtel'   => 'Airtel',
        'tigopesa' => 'Tigo',
        'halopesa' => 'Halotel',
    ];

    public function __construct()
    {
        $this->baseUrl = rtrim(config('services.snippe.base_url', 'https://payments.hasethospital.or.tz/public/api'), '/');
        $this->apiKey  = config('services.snippe.api_key');
    }

    /**
     * Initiate a USSD push payment.
     *
     * @return array{success: bool, order_id: string|null, message: string, raw: array}
     */
    public function initiatePayment(
        string $userId,
        string $recipientId,
        float  $amount,
        string $paymentMethod,
        string $paymentAccount
    ): array {
        $provider = self::PROVIDERS[$paymentMethod] ?? 'Vodacom';

        try {
            $response = Http::timeout(30)
                ->withHeaders($this->headers())
                ->post("{$this->baseUrl}/payment/initiate", [
                    'user_id'         => $userId,
                    'doctor_id'       => $recipientId,
                    'amount'          => (int) round($amount),
                    'provider'        => $provider,
                    'payment_account' => $this->normalizePhone($paymentAccount),
                ]);

            $body = $response->json() ?? [];

            Log::info('Snippe initiate', [
                'user_id'   => $userId,
                'amount'    => $amount,
                'provider'  => $provider,
                'status'    => $response->status(),
                'response'  => $body,
            ]);

            // 429 = duplicate payment within 2 minutes
            if ($response->status() === 429) {
                return [
                    'success'  => false,
                    'order_id' => null,
                    'message'  => 'A payment for this booking is already pending. Please wait 2 minutes and try again.',
                    'raw'      => $body,
                ];
            }

            if ($response->successful() && isset($body['order_id'])) {
                return [
                    'success'  => true,
                    'order_id' => (string) $body['order_id'],
                    'message'  => $body['message'] ?? 'Payment request sent to your phone',
                    'raw'      => $body,
                ];
            }

            return [
                'success'  => false,
                'order_id' => null,
                'message'  => $body['message'] ?? 'Payment initiation failed',
                'raw'      => $body,
            ];
        } catch (\Throwable $e) {
            Log::error('Snippe initiate exception', ['error' => $e->getMessage()]);
            return [
                'success'  => false,
                'order_id' => null,
                'message'  => 'Gateway connection failed: ' . $e->getMessage(),
                'raw'      => [],
            ];
        }
    }

    /**
     * Check payment status by Snippe order_id.
     *
     * @return array{success: bool, status: string, transaction_id: string|null, message: string, raw: array}
     */
    public function checkStatus(string $orderId): array
    {
        try {
            $response = Http::timeout(15)
                ->withHeaders($this->headers())
                ->get("{$this->baseUrl}/payment/status", [
                    'order_id' => $orderId,
                ]);

            $body = $response->json() ?? [];

            Log::info('Snippe status check', ['order_id' => $orderId, 'response' => $body]);

            $raw    = strtoupper($body['status'] ?? $body['payment_status'] ?? 'PENDING');
            $status = match (true) {
                str_contains($raw, 'COMPLET') => 'COMPLETED',
                str_contains($raw, 'FAIL')    => 'FAILED',
                str_contains($raw, 'CANCEL')  => 'CANCELLED',
                default                       => 'PENDING',
            };

            return [
                'success'        => $response->successful(),
                'status'         => $status,
                'transaction_id' => $body['transaction_id'] ?? null,
                'message'        => $body['message'] ?? '',
                'raw'            => $body,
            ];
        } catch (\Throwable $e) {
            Log::error('Snippe status check exception', ['order_id' => $orderId, 'error' => $e->getMessage()]);
            return [
                'success'        => false,
                'status'         => 'PENDING',
                'transaction_id' => null,
                'message'        => $e->getMessage(),
                'raw'            => [],
            ];
        }
    }

    /**
     * Cancel a pending payment.
     */
    public function cancelPayment(string $orderId): array
    {
        try {
            $response = Http::timeout(15)
                ->withHeaders($this->headers())
                ->post("{$this->baseUrl}/payment/cancel", [
                    'order_id' => $orderId,
                ]);

            $body = $response->json() ?? [];

            Log::info('Snippe cancel', ['order_id' => $orderId, 'response' => $body]);

            return [
                'success' => $response->successful(),
                'message' => $body['message'] ?? 'Cancel request sent',
                'raw'     => $body,
            ];
        } catch (\Throwable $e) {
            Log::error('Snippe cancel exception', ['order_id' => $orderId, 'error' => $e->getMessage()]);
            return ['success' => false, 'message' => $e->getMessage(), 'raw' => []];
        }
    }

    /**
     * Normalise phone to 255XXXXXXXXX format.
     */
    public function normalizePhone(string $phone): string
    {
        $phone = preg_replace('/\D/', '', $phone);
        if (str_starts_with($phone, '0')) {
            $phone = '255' . substr($phone, 1);
        }
        $phone = ltrim($phone, '+');
        return $phone;
    }

    private function headers(): array
    {
        $headers = ['Accept' => 'application/json'];
        if ($this->apiKey) {
            $headers['Authorization'] = "Bearer {$this->apiKey}";
        }
        return $headers;
    }
}
