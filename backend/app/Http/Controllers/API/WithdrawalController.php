<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Mail\WithdrawalRequestedMail;
use App\Models\User;
use App\Models\Wallet;
use App\Models\WithdrawalRequest;
use App\Services\MailService;
use App\Services\PaymentService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class WithdrawalController extends Controller
{
    public function __construct(private PaymentService $paymentService) {}

    /**
     * Technician: request a withdrawal.
     */
    public function store(Request $request): JsonResponse
    {
        $technician = $request->user()->technician;

        if (!$technician) {
            return response()->json(['message' => 'Technician profile not found'], 404);
        }

        $validated = $request->validate([
            'amount'         => 'required|numeric|min:1000',
            'method'         => 'required|in:mpesa,airtel,tigopesa,halopesa,bank',
            'account_number' => 'required|string|max:50',
            'account_name'   => 'required|string|max:100',
            'bank_name'      => 'required_if:method,bank|nullable|string|max:100',
        ]);

        $wallet = Wallet::firstOrCreate(
            ['technician_id' => $technician->id],
            ['currency' => 'TZS']
        );

        if ($wallet->balance < $validated['amount']) {
            return response()->json([
                'message' => 'Insufficient balance',
                'available' => $wallet->balance,
            ], 422);
        }

        // Check no pending request exists
        $hasPending = WithdrawalRequest::where('technician_id', $technician->id)
            ->where('status', 'pending')
            ->exists();

        if ($hasPending) {
            return response()->json(['message' => 'You already have a pending withdrawal request'], 422);
        }

        $withdrawal = WithdrawalRequest::create([
            'technician_id'  => $technician->id,
            'wallet_id'      => $wallet->id,
            'reference'      => 'WDR-' . strtoupper(Str::random(10)),
            'amount'         => $validated['amount'],
            'currency'       => 'TZS',
            'method'         => $validated['method'],
            'account_number' => $validated['account_number'],
            'account_name'   => $validated['account_name'],
            'bank_name'      => $validated['bank_name'] ?? null,
            'status'         => 'pending',
        ]);

        $withdrawal->load('technician.user');

        // Notify technician
        MailService::send(
            $request->user()->email,
            new WithdrawalRequestedMail($withdrawal, 'technician'),
            'withdrawal_requested', 'technician',
            null, $request->user()->id
        );

        // Notify all admins
        User::where('role', 'admin')->each(function ($admin) use ($withdrawal) {
            MailService::send(
                $admin->email,
                new WithdrawalRequestedMail($withdrawal, 'admin'),
                'withdrawal_requested', 'admin',
                null, $admin->id
            );
        });

        return response()->json([
            'message' => 'Withdrawal request submitted',
            'data'    => $withdrawal,
        ], 201);
    }

    /**
     * Technician: list own withdrawal requests.
     */
    public function index(Request $request): JsonResponse
    {
        $technician = $request->user()->technician;

        if (!$technician) {
            return response()->json(['message' => 'Technician profile not found'], 404);
        }

        $requests = WithdrawalRequest::where('technician_id', $technician->id)
            ->latest()
            ->paginate($request->per_page ?? 15);

        return response()->json($requests);
    }
}
