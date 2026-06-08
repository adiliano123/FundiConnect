<?php

namespace App\Http\Controllers\API\Admin;

use App\Http\Controllers\Controller;
use App\Models\Booking;
use App\Models\Complaint;
use App\Models\Payment;
use App\Models\Review;
use App\Models\Technician;
use App\Models\User;
use Illuminate\Http\JsonResponse;

class AdminController extends Controller
{
    public function dashboard(): JsonResponse
    {
        $stats = [
            'total_users'       => User::count(),
            'total_customers'   => User::where('role', 'customer')->count(),
            'total_technicians' => User::where('role', 'technician')->count(),
            'verified_technicians' => Technician::where('verification_status', 'verified')->count(),
            'pending_verifications' => Technician::where('verification_status', 'pending')->count(),
            'total_bookings'    => Booking::count(),
            'pending_bookings'  => Booking::where('status', 'pending')->count(),
            'completed_bookings' => Booking::where('status', 'completed')->count(),
            'total_revenue'     => Payment::where('status', 'completed')->sum('amount'),
            'platform_earnings' => Payment::where('status', 'completed')->sum('platform_fee'),
            'open_complaints'   => Complaint::where('status', 'open')->count(),
            'total_reviews'     => Review::count(),
        ];

        // Recent bookings
        $recentBookings = Booking::with(['customer:id,name', 'technician.user:id,name', 'category:id,name'])
            ->latest()
            ->take(5)
            ->get();

        // Monthly revenue
        $monthlyRevenue = Payment::where('status', 'completed')
            ->selectRaw('YEAR(created_at) year, MONTH(created_at) month, SUM(amount) total')
            ->groupByRaw('YEAR(created_at), MONTH(created_at)')
            ->orderByRaw('YEAR(created_at) DESC, MONTH(created_at) DESC')
            ->take(12)
            ->get();

        return response()->json([
            'stats'           => $stats,
            'recent_bookings' => $recentBookings,
            'monthly_revenue' => $monthlyRevenue,
        ]);
    }
}
