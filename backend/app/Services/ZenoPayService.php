<?php

namespace App\Services;

use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

/**
 * ZenoPay Payment Gateway Service
 *
 * Handles STK push requests and payment status checks
 * via the ZenoPay REST API (https://api.zeno.africa).
 *
 * Docs: https://zeno.africa/docs
 */
class ZenoPayService
{
    private ?string $apiKey;
    private ?string $accountId;
    private ?string $secretKey;
    private string $baseUrl;

    public function __construct()
    {
        $this->apiKey    = config('services.zenopay.api_key');
        $this->accountId = config('services.zenopay.account_id');
        $this->secretKey = config('services.zenopay.secret_key');
        $this->baseUrl   = rtrim(config('services.zenopay.base_url', 'https://api.zeno.africa'), '/');
    }

    /**
     * Initiate an STK push / mobile money payment request.
     *
     * @param  string $phone     Recipient phone e.g. 255712345678
     * @param  float  $amount    Amount in TZS
     * @param  string $reference Internal payment reference (unique)
     * @param  string $callbackUrl  Your webhook URL
     * @return array{success: bool, order_id: string|null, message: string, raw: array}
     */
    public function initiatePayment(
        string $phone,
        float  $amount,
        string $reference,
        string $callbackUrl
    ): array {
        try {
            $response = Http::timeout(30)
                ->post("{$this->baseUrl}/", [
                    'create_order' => 1,
                    'buyer_email'  => '',           // optional
                    'buyer_name'   => '',           // optional
                    'buyer_phone'  => $this->normalizePhone($phone),
                    'amount'       => (int) round($amount),
                    'account_id'   => $this->accountId,
                    'api_key'      => $this->apiKey,
                    'secret_key'   => $this->secretKey,
                    'webhook_url'  => $callbackUrl,
                    'metadata'     => $reference,
                ]);

            $body = $response->json();

            Log::info('ZenoPay initiate', ['reference' => $reference, 'response' => $body]);

            if ($response->successful() && ($body['message'] ?? '') === 'success') {
                return [
                    'success'  => true,
                    'order_id' => $body['order_id'] ?? null,
                    'message'  => 'Payment request sent to phone',
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
            Log::error('ZenoPay initiate exception', ['error' => $e->getMessage(), 'reference' => $reference]);
            return [
                'success'  => false,
                'order_id' => null,
                'message'  => 'Gateway connection failed: ' . $e->getMessage(),
                'raw'      => [],
            ];
        }
    }

    /**
     * Check payment status by ZenoPay order_id.
     *
     * @return array{success: bool, status: string, message: string, raw: array}
     *   status: 'PENDING' | 'COMPLETED' | 'FAILED' | 'CANCELLED'
     */
    public function checkStatus(string $orderId): array
    {
        try {
            $response = Http::timeout(15)
                ->post("{$this->baseUrl}/", [
                    'check_payment' => 1,
                    'order_id'      => $orderId,
                    'api_key'       => $this->apiKey,
                    'account_id'    => $this->accountId,
                    'secret_key'    => $this->secretKey,
                ]);

            $body = $response->json();

            Log::info('ZenoPay status check', ['order_id' => $orderId, 'response' => $body]);

            $status = strtoupper($body['payment_status'] ?? 'PENDING');

            return [
                'success' => $response->successful(),
                'status'  => $status,
                'message' => $body['message'] ?? '',
                'raw'     => $body,
            ];
        } catch (\Throwable $e) {
            Log::error('ZenoPay status check exception', ['order_id' => $orderId, 'error' => $e->getMessage()]);
            return [
                'success' => false,
                'status'  => 'PENDING',
                'message' => $e->getMessage(),
                'raw'     => [],
            ];
        }
    }

    /**
     * Verify webhook signature from ZenoPay.
     * ZenoPay sends HMAC-SHA256 of the raw body using the secret key.
     */
    public function verifyWebhookSignature(string $rawBody, string $signature): bool
    {
        $secret = config('services.zenopay.webhook_secret');
        if (empty($secret)) {
            return true; // skip verification if not configured
        }
        $expected = hash_hmac('sha256', $rawBody, $secret);
        return hash_equals($expected, $signature);
    }

    /**
     * Normalize phone to 255XXXXXXXXX format.
     */
    private function normalizePhone(string $phone): string
    {
        $phone = preg_replace('/\D/', '', $phone);
        if (str_starts_with($phone, '0')) {
            $phone = '255' . substr($phone, 1);
        }
        if (str_starts_with($phone, '+')) {
            $phone = ltrim($phone, '+');
        }
        return $phone;
    }
}
