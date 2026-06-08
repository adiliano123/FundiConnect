<?php

namespace App\Http\Controllers\API\Admin;

use App\Http\Controllers\Controller;
use App\Models\Technician;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class UserManagementController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $query = User::query();

        if ($request->role) $query->where('role', $request->role);
        if ($request->search) {
            $query->where(fn($q) =>
                $q->where('name', 'like', "%{$request->search}%")
                  ->orWhere('email', 'like', "%{$request->search}%")
            );
        }

        $users = $query->latest()->paginate($request->per_page ?? 20);
        return response()->json($users);
    }

    public function show(User $user): JsonResponse
    {
        $user->load('technician.category');
        return response()->json(['data' => $user]);
    }

    public function toggleSuspend(User $user): JsonResponse
    {
        $user->update(['is_active' => !$user->is_active]);
        $action = $user->is_active ? 'activated' : 'suspended';
        return response()->json(['message' => "User $action successfully", 'is_active' => $user->is_active]);
    }

    public function verifyTechnician(Request $request, Technician $technician): JsonResponse
    {
        $validated = $request->validate([
            'status' => 'required|in:verified,rejected',
            'rejection_reason' => 'required_if:status,rejected|nullable|string',
        ]);

        $technician->update([
            'verification_status' => $validated['status'],
            'rejection_reason'    => $validated['rejection_reason'] ?? null,
        ]);
        $technician->user->update(['is_verified' => $validated['status'] === 'verified']);

        return response()->json(['message' => 'Technician verification updated', 'data' => $technician]);
    }

    public function pendingTechnicians(): JsonResponse
    {
        $technicians = Technician::where('verification_status', 'pending')
            ->with('user', 'category')
            ->latest()
            ->paginate(20);

        return response()->json($technicians);
    }
}
