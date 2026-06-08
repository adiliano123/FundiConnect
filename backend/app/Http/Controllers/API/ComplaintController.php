<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\Booking;
use App\Models\Complaint;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class ComplaintController extends Controller
{
    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'booking_id'  => 'required|exists:bookings,id',
            'subject'     => 'required|string|max:255',
            'description' => 'required|string|max:2000',
        ]);

        $booking = Booking::findOrFail($validated['booking_id']);
        $user = $request->user();

        // Determine respondent
        $respondentId = $user->role === 'customer'
            ? $booking->technician->user_id
            : $booking->customer_id;

        $complaint = Complaint::create(array_merge($validated, [
            'complainant_id' => $user->id,
            'respondent_id'  => $respondentId,
        ]));

        return response()->json(['message' => 'Complaint submitted', 'data' => $complaint], 201);
    }

    public function index(Request $request): JsonResponse
    {
        $query = Complaint::with(['booking', 'complainant:id,name', 'respondent:id,name']);

        if ($request->user()->role !== 'admin') {
            $query->where('complainant_id', $request->user()->id);
        }

        if ($request->status) $query->where('status', $request->status);

        $complaints = $query->latest()->paginate($request->per_page ?? 10);
        return response()->json($complaints);
    }

    public function resolve(Request $request, Complaint $complaint): JsonResponse
    {
        $validated = $request->validate([
            'status'           => 'required|in:resolved,dismissed',
            'resolution_notes' => 'required|string',
        ]);

        $complaint->update(array_merge($validated, [
            'resolved_by' => $request->user()->id,
            'resolved_at' => now(),
        ]));

        return response()->json(['message' => 'Complaint resolved', 'data' => $complaint]);
    }
}
