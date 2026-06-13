<?php

namespace App\Http\Controllers\API\Admin;

use App\Http\Controllers\Controller;
use App\Mail\WithdrawalStatusMail;
use App\Models\WithdrawalRequest;
use App\Services\MailService;
use App\Services\PaymentService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class WithdrawalManagementController extends Controller
{
    public function __construct(private PaymentService $paymentService) {}

    /**
     * List all withdrawal requests.
     */
    public function index(Request $request): JsonResponse
    {
        $requests = WithdrawalRequest::with(['technician.user'])
            ->when($request->status, fn($q) => $q->where('status', $request->status))
            ->latest()
            ->paginate($request->per_page ?? 20);

        return response()->json($requests);
    }

    /**
     * Approve a withdrawal — deducts wallet balance.
     */
    public function approve(Request $request, WithdrawalRequest $withdrawal): JsonResponse
    {
        if (!$withdrawal->isPending()) {
            return response()->json(['message' => 'Only pending requests can be approved'], 422);
        }

        $wallet = $withdrawal->wallet;

        if ($wallet->balance < $withdrawal->amount) {
            return response()->json(['message' => 'Insufficient wallet balance'], 422);
        }

        // Debit wallet
        $this->paymentService->debitWallet(
            $wallet,
            $withdrawal->amount,
            "Withdrawal #{$withdrawal->reference}"
        );

        $withdrawal->update([
            'status'       => 'completed',
            'processed_by' => $request->user()->id,
            'processed_at' => now(),
            'admin_notes'  => $request->admin_notes,
        ]);

        $withdrawal->load('technician.user');
        MailService::send(
            $withdrawal->technician->user->email,
            new WithdrawalStatusMail($withdrawal),
            'withdrawal_approved', 'technician',
            null, $withdrawal->technician->user->id
        );

        return response()->json([
            'message' => 'Withdrawal approved and processed',
            'data'    => $withdrawal->fresh()->load('technician.user'),
        ]);
    }

    /**
     * Reject a withdrawal request.
     */
    public function reject(Request $request, WithdrawalRequest $withdrawal): JsonResponse
    {
        $request->validate(['admin_notes' => 'required|string|max:500']);

        if (!$withdrawal->isPending()) {
            return response()->json(['message' => 'Only pending requests can be rejected'], 422);
        }

        $withdrawal->update([
            'status'       => 'rejected',
            'processed_by' => $request->user()->id,
            'processed_at' => now(),
            'admin_notes'  => $request->admin_notes,
        ]);

        $withdrawal->load('technician.user');
        MailService::send(
            $withdrawal->technician->user->email,
            new WithdrawalStatusMail($withdrawal),
            'withdrawal_rejected', 'technician',
            null, $withdrawal->technician->user->id
        );

        return response()->json([
            'message' => 'Withdrawal rejected',
            'data'    => $withdrawal->fresh()->load('technician.user'),
        ]);
    }
}
