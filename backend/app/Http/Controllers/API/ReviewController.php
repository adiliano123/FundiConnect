<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\Booking;
use App\Models\Review;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class ReviewController extends Controller
{
    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'booking_id' => 'required|exists:bookings,id',
            'rating'     => 'required|integer|min:1|max:5',
            'comment'    => 'nullable|string|max:1000',
        ]);

        $booking = Booking::findOrFail($validated['booking_id']);

        // Only customer of the booking can review
        if ($booking->customer_id !== $request->user()->id) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        if (!$booking->isCompleted()) {
            return response()->json(['message' => 'Can only review completed bookings'], 422);
        }

        if ($booking->review) {
            return response()->json(['message' => 'You already reviewed this booking'], 422);
        }

        $review = Review::create(array_merge($validated, [
            'customer_id'   => $request->user()->id,
            'technician_id' => $booking->technician_id,
            'is_published'  => true,
        ]));

        return response()->json([
            'message' => 'Review submitted',
            'data'    => $review->load('customer'),
        ], 201);
    }

    public function technicianReviews(Request $request, int $technicianId): JsonResponse
    {
        $reviews = Review::where('technician_id', $technicianId)
            ->where('is_published', true)
            ->with('customer:id,name,avatar')
            ->latest()
            ->paginate($request->per_page ?? 10);

        return response()->json($reviews);
    }

    public function myReviews(Request $request): JsonResponse
    {
        $technician = $request->user()->technician;

        if (!$technician) {
            return response()->json(['message' => 'Not a technician'], 404);
        }

        $reviews = Review::where('technician_id', $technician->id)
            ->with('customer:id,name,avatar')
            ->latest()
            ->paginate($request->per_page ?? 20);

        return response()->json($reviews);
    }

    public function destroy(Review $review): JsonResponse
    {
        $user = request()->user();
        if ($user->role !== 'admin' && $review->customer_id !== $user->id) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }
        $review->delete();
        return response()->json(['message' => 'Review deleted']);
    }

    public function adminIndex(Request $request): JsonResponse
    {
        $reviews = Review::with(['customer:id,name', 'technician.user:id,name'])
            ->when($request->search, fn($q) =>
                $q->whereHas('customer', fn($c) => $c->where('name', 'like', "%{$request->search}%"))
            )
            ->latest()
            ->paginate($request->per_page ?? 20);

        return response()->json($reviews);
    }
}
