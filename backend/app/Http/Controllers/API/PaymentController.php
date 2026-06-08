<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\Booking;
use App\Models\Payment;
use App\Services\PaymentService;
use App\Services\ZenoPayService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;

class PaymentController extends Controller
{
    public function __construct(
        private PaymentService $paymentService,
        private ZenoPayService $zenoPayService,
    ) {}

    /**
     * POST /api/bookings/{booking}/pay
     * Customer initiates ZenoPay STK push.
     */
    public function initiate(Request $request, Booking $booking): JsonResponse
    {
        if ($booking->customer_id !== $request->user()->id) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        if (!in_array($booking->status, ['accepted', 'awaiting_payment'])) {
            return response()->json(['message' => 'Booking must be accepted before payment'], 422);
        }

        if ($booking->payment?->isCompleted()) {
            return response()->json(['message' => 'Booking already paid'], 422);
        }

        $validated = $request->validate([
            'amount'         => 'required|numeric|min:100',
            'payment_method' => 'required|in:mpesa,airtel,tigopesa,halopesa,visa,mastercard',
            'phone_number'   => 'required_if:payment_method,mpesa,airtel,tigopesa,halopesa|nullable|string|max:20',
        ]);

        $result = $this->paymentService->initiate($booking, $validated);

        if (!$result['success']) {
            return response()->json([
                'message' => $result['message'],
                'data'    => null,
            ], 422);
        }

        return response()->json([
            'message'  => $result['message'],
            'data'     => $result['payment'],
            'order_id' => $result['order_id'] ?? null,
        ], 200);
    }

    /**
     * POST /api/payments/{payment}/verify
     * Frontend polls this to check ZenoPay payment status.
     */
    public function verify(Request $request, Payment $payment): JsonResponse
    {
        if ($request->user()->role !== 'admin' && $payment->customer_id !== $request->user()->id) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        if ($payment->isCompleted()) {
            return response()->json(['status' => 'COMPLETED', 'message' => 'Payment already confirmed']);
        }

        $result = $this->paymentService->verify($payment);

        return response()->json([
            'status'  => $result['status'],
            'message' => $result['message'],
            'data'    => $payment->fresh()->load('booking'),
        ]);
    }

    /**
     * POST /api/payments/webhook  (public — called by ZenoPay)
     * No auth middleware. Validates signature, processes callback.
     */
    public function webhook(Request $request): JsonResponse
    {
        $rawBody  = $request->getContent();
        $signature = $request->header('X-ZenoPay-Signature', '');

        if (!$this->zenoPayService->verifyWebhookSignature($rawBody, $signature)) {
            Log::warning('ZenoPay webhook: invalid signature');
            return response()->json(['message' => 'Invalid signature'], 401);
        }

        $payload = $request->all();
        $handled = $this->paymentService->handleWebhook($payload);

        return response()->json(['message' => $handled ? 'OK' : 'Ignored'], 200);
    }

    /**
     * GET /api/payments
     * Payment history for current user.
     */
    public function index(Request $request): JsonResponse
    {
        $user  = $request->user();
        $query = Payment::with(['booking.category', 'technician.user'])->latest();

        if ($user->role === 'customer') {
            $query->where('customer_id', $user->id);
        } elseif ($user->role === 'technician') {
            $query->where('technician_id', $user->technician->id);
        }

        if ($request->status) {
            $query->where('status', $request->status);
        }

        return response()->json($query->paginate($request->per_page ?? 15));
    }

    /**
     * GET /api/payments/{payment}
     */
    public function show(Request $request, Payment $payment): JsonResponse
    {
        $user = $request->user();

        if ($user->role !== 'admin'
            && $payment->customer_id !== $user->id
            && $payment->technician_id !== $user->technician?->id) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        return response()->json([
            'data' => $payment->load(['booking.category', 'booking.technician.user', 'customer', 'technician.user']),
        ]);
    }
}
