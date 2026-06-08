<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\Wallet;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class WalletController extends Controller
{
    /**
     * Get technician's wallet summary.
     */
    public function show(Request $request): JsonResponse
    {
        $technician = $request->user()->technician;

        if (!$technician) {
            return response()->json(['message' => 'Technician profile not found'], 404);
        }

        $wallet = Wallet::firstOrCreate(
            ['technician_id' => $technician->id],
            ['currency' => 'TZS', 'balance' => 0, 'pending_balance' => 0, 'total_earned' => 0, 'total_withdrawn' => 0]
        );

        return response()->json(['data' => $wallet]);
    }

    /**
     * Get wallet transaction history.
     */
    public function transactions(Request $request): JsonResponse
    {
        $technician = $request->user()->technician;

        if (!$technician) {
            return response()->json(['message' => 'Technician profile not found'], 404);
        }

        $wallet = $technician->wallet;

        if (!$wallet) {
            return response()->json(['data' => [], 'total' => 0]);
        }

        $transactions = $wallet->transactions()
            ->with(['booking', 'payment'])
            ->when($request->type, fn($q) => $q->where('type', $request->type))
            ->latest()
            ->paginate($request->per_page ?? 20);

        return response()->json($transactions);
    }
}
