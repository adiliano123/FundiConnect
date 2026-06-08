<?php

namespace App\Http\Controllers\API\Admin;

use App\Http\Controllers\Controller;
use App\Models\Payment;
use App\Models\WithdrawalRequest;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class RevenueController extends Controller
{
    /**
     * Overall revenue summary.
     */
    public function summary(): JsonResponse
    {
        $completed = Payment::where('status', 'completed');

        $summary = [
            'total_revenue'        => (float) (clone $completed)->sum('amount'),
            'platform_earnings'    => (float) (clone $completed)->sum('platform_fee'),
            'technician_payouts'   => (float) (clone $completed)->sum('technician_payout'),
            'total_transactions'   => (clone $completed)->count(),
            'pending_payments'     => Payment::where('status', 'pending')->count(),
            'failed_payments'      => Payment::where('status', 'failed')->count(),
            'pending_withdrawals'  => WithdrawalRequest::where('status', 'pending')->sum('amount'),
            'completed_withdrawals'=> WithdrawalRequest::where('status', 'completed')->sum('amount'),
        ];

        return response()->json(['data' => $summary]);
    }

    /**
     * Monthly revenue breakdown.
     */
    public function monthly(Request $request): JsonResponse
    {
        $year = $request->year ?? now()->year;

        $data = Payment::where('status', 'completed')
            ->whereYear('paid_at', $year)
            ->selectRaw('
                MONTH(paid_at) as month,
                COUNT(*) as transactions,
                SUM(amount) as total_revenue,
                SUM(platform_fee) as platform_fee,
                SUM(technician_payout) as technician_payout
            ')
            ->groupByRaw('MONTH(paid_at)')
            ->orderBy('month')
            ->get();

        return response()->json(['data' => $data, 'year' => $year]);
    }

    /**
     * Payment method breakdown.
     */
    public function byMethod(): JsonResponse
    {
        $data = Payment::where('status', 'completed')
            ->selectRaw('payment_method, COUNT(*) as count, SUM(amount) as total')
            ->groupBy('payment_method')
            ->orderByDesc('total')
            ->get();

        return response()->json(['data' => $data]);
    }

    /**
     * All payments (admin view).
     */
    public function payments(Request $request): JsonResponse
    {
        $payments = Payment::with(['booking.category', 'customer', 'technician.user'])
            ->when($request->status, fn($q) => $q->where('status', $request->status))
            ->when($request->method, fn($q) => $q->where('payment_method', $request->method))
            ->when($request->from, fn($q) => $q->whereDate('created_at', '>=', $request->from))
            ->when($request->to, fn($q) => $q->whereDate('created_at', '<=', $request->to))
            ->latest()
            ->paginate($request->per_page ?? 20);

        return response()->json($payments);
    }

    /**
     * Top earning technicians.
     */
    public function topTechnicians(Request $request): JsonResponse
    {
        $data = Payment::where('status', 'completed')
            ->with('technician.user')
            ->selectRaw('technician_id, COUNT(*) as jobs, SUM(amount) as gross, SUM(technician_payout) as net_earned')
            ->groupBy('technician_id')
            ->orderByDesc('gross')
            ->take($request->limit ?? 10)
            ->get();

        return response()->json(['data' => $data]);
    }
}
