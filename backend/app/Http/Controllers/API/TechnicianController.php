<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\Technician;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class TechnicianController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $query = Technician::with(['user', 'category', 'skills'])
            ->whereHas('user', fn($q) => $q->where('is_active', true))
            ->where('verification_status', 'verified');

        if ($request->category_id) {
            $query->where('category_id', $request->category_id);
        }

        if ($request->city) {
            $query->whereHas('user', fn($q) => $q->where('city', 'like', '%' . $request->city . '%'));
        }

        if ($request->search) {
            $search = $request->search;
            $query->whereHas('user', fn($q) => $q->where('name', 'like', "%$search%"))
                  ->orWhere('bio', 'like', "%$search%");
        }

        if ($request->available) {
            $query->where('is_available', true);
        }

        $query->orderByDesc('rating');

        $technicians = $query->paginate($request->per_page ?? 12);

        return response()->json($technicians);
    }

    public function show(Technician $technician): JsonResponse
    {
        $technician->load(['user', 'category', 'skills', 'portfolioImages', 'reviews.customer']);
        return response()->json(['data' => $technician]);
    }

    public function updateProfile(Request $request): JsonResponse
    {
        $user = $request->user();
        $technician = $user->technician;

        if (!$technician) {
            return response()->json(['message' => 'Technician profile not found'], 404);
        }

        $validated = $request->validate([
            'bio'              => 'nullable|string|max:500',
            'description'      => 'nullable|string',
            'experience_years' => 'nullable|integer|min:0|max:50',
            'hourly_rate'      => 'nullable|numeric|min:0',
            'service_area'     => 'nullable|string|max:255',
            'is_available'     => 'nullable|boolean',
            'id_number'        => 'nullable|string|max:50',
            'license_number'   => 'nullable|string|max:50',
            'working_hours'    => 'nullable|array',
            'category_id'      => 'nullable|exists:categories,id',
            'skills'           => 'nullable|array',
            'skills.*'         => 'exists:categories,id',
        ]);

        $skills = $validated['skills'] ?? null;
        unset($validated['skills']);

        $technician->update($validated);

        if ($skills !== null) {
            $technician->skills()->sync($skills);
        }

        return response()->json([
            'message' => 'Profile updated',
            'data'    => $technician->load(['user', 'category', 'skills']),
        ]);
    }

    public function uploadAvatar(Request $request): JsonResponse
    {
        $request->validate(['avatar' => 'required|image|max:2048']);
        $user = $request->user();

        if ($user->avatar) {
            Storage::disk('public')->delete($user->avatar);
        }

        $path = $request->file('avatar')->store('avatars', 'public');
        $user->update(['avatar' => $path]);

        return response()->json(['message' => 'Avatar uploaded', 'avatar_url' => asset('storage/' . $path)]);
    }

    public function uploadPortfolio(Request $request): JsonResponse
    {
        $request->validate(['images.*' => 'required|image|max:4096', 'images' => 'required|array|max:10']);
        $technician = $request->user()->technician;

        $uploaded = [];
        foreach ($request->file('images') as $image) {
            $path = $image->store('portfolio', 'public');
            $pi = $technician->portfolioImages()->create(['image_path' => $path]);
            $uploaded[] = ['id' => $pi->id, 'image_url' => asset('storage/' . $path)];
        }

        return response()->json(['message' => 'Images uploaded', 'data' => $uploaded]);
    }

    public function getMyProfile(Request $request): JsonResponse
    {
        $technician = $request->user()->technician;
        if (!$technician) {
            return response()->json(['message' => 'Not a technician'], 404);
        }

        $technician->load(['user', 'category', 'skills', 'portfolioImages']);
        return response()->json(['data' => $technician]);
    }
}
