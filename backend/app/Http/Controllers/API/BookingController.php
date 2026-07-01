<?php

namespace App\Http\Controllers\API;

use App\Events\BookingCreated;
use App\Events\BookingStatusUpdated;
use App\Http\Controllers\Controller;
use App\Models\Booking;
use App\Models\Technician;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class BookingController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $user  = $request->user();
        $query = Booking::with(['customer', 'technician.user', 'service', 'category', 'review', 'payment']);

        if ($user->role === 'customer') {
            $query->where('customer_id', $user->id);
        } elseif ($user->role === 'technician') {
            $query->where('technician_id', $user->technician->id);
        }

        if ($request->status) {
            $query->where('status', $request->status);
        }

        return response()->json($query->latest()->paginate($request->per_page ?? 10));
    }

    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'technician_id' => 'required|exists:technicians,id',
            'service_id'    => 'nullable|exists:services,id',
            'category_id'   => 'required|exists:categories,id',
            'description'   => 'required|string|max:1000',
            'address'       => 'required|string|max:500',
            'city'          => 'required|string|max:100',
            'scheduled_at'  => 'required|date|after:now',
        ]);

        $technician = Technician::findOrFail($validated['technician_id']);

        if (!$technician->is_available) {
            return response()->json(['message' => 'Technician is not available'], 422);
        }

        $booking = Booking::create(array_merge($validated, [
            'customer_id' => $request->user()->id,
        ]));

        // Fire event — listeners handle all emails + in-app notifications
        BookingCreated::dispatch($booking);

        return response()->json([
            'message' => 'Booking submitted successfully',
            'data'    => $booking->load(['technician.user', 'category', 'service']),
        ], 201);
    }

    public function show(Booking $booking): JsonResponse
    {
        $this->authorizeBookingAccess($booking, request()->user());
        $booking->load(['customer', 'technician.user', 'service', 'category', 'review', 'payment']);
        return response()->json(['data' => $booking]);
    }

    public function updateStatus(Request $request, Booking $booking): JsonResponse
    {
        $user      = $request->user();
        $validated = $request->validate([
            'status'              => 'required|in:accepted,rejected,in_progress,completed,cancelled',
            'rejection_reason'    => 'required_if:status,rejected|nullable|string',
            'cancellation_reason' => 'nullable|string',
            'final_cost'          => 'nullable|numeric|min:0',
        ]);

        // Technician/admin can change accepted/rejected/in_progress/completed
        if (in_array($validated['status'], ['accepted', 'rejected', 'completed'])
            && $user->role !== 'technician' && $user->role !== 'admin') {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        // Technician can only start (in_progress) once booking is paid
        if ($validated['status'] === 'in_progress') {
            if ($user->role !== 'technician' && $user->role !== 'admin') {
                return response()->json(['message' => 'Unauthorized'], 403);
            }
            if (!in_array($booking->status, ['paid', 'accepted']) && $user->role !== 'admin') {
                return response()->json(['message' => 'Booking must be paid before starting work'], 422);
            }
        }

        if ($validated['status'] === 'cancelled'
            && !in_array($user->role, ['customer', 'admin', 'technician'])) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $timestamps = [
            'accepted'    => 'accepted_at',
            'in_progress' => 'started_at',
            'completed'   => 'completed_at',
        ];

        $updateData = array_filter($validated, fn($v) => !is_null($v));

        if (isset($timestamps[$validated['status']])) {
            $updateData[$timestamps[$validated['status']]] = now();
        }

        $booking->update($updateData);

        // Fire event — listeners handle notifications
        BookingStatusUpdated::dispatch($booking->fresh(), $validated['status'], $user->role);

        return response()->json([
            'message' => 'Status updated',
            'data'    => $booking->fresh()->load(['customer', 'technician.user', 'category']),
        ]);
    }

    private function authorizeBookingAccess(Booking $booking, $user): void
    {
        if ($user->role === 'admin') return;
        if ($user->role === 'customer' && $booking->customer_id === $user->id) return;
        if ($user->role === 'technician' && $booking->technician_id === $user->technician?->id) return;
        abort(403, 'Unauthorized');
    }
}
