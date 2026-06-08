<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Http\Requests\Auth\LoginRequest;
use App\Http\Requests\Auth\RegisterRequest;
use App\Mail\WelcomeMail;
use App\Models\Technician;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Mail;

class AuthController extends Controller
{
    public function register(RegisterRequest $request): JsonResponse
    {
        $user = User::create([
            'name'     => $request->name,
            'email'    => $request->email,
            'password' => Hash::make($request->password),
            'role'     => $request->role ?? 'customer',
            'phone'    => $request->phone,
        ]);

        // If registering as a technician, create technician profile
        if ($user->role === 'technician') {
            Technician::create(['user_id' => $user->id]);
        }

        // Send welcome email (non-blocking — failure won't prevent registration)
        try {
            Mail::to($user->email)->send(new WelcomeMail($user));
        } catch (\Throwable) {
            // log silently, don't fail the registration
        }

        $token = $user->createToken('auth_token')->plainTextToken;

        return response()->json([
            'message' => 'Registration successful',
            'user'    => $this->formatUser($user),
            'token'   => $token,
        ], 201);
    }

    public function login(LoginRequest $request): JsonResponse
    {
        $user = User::where('email', $request->email)->first();

        if (!$user || !Hash::check($request->password, $user->password)) {
            return response()->json(['message' => 'Invalid credentials'], 401);
        }

        if (!$user->is_active) {
            return response()->json(['message' => 'Your account has been suspended'], 403);
        }

        $user->update(['last_login_at' => now()]);
        $token = $user->createToken('auth_token')->plainTextToken;

        return response()->json([
            'message' => 'Login successful',
            'user'    => $this->formatUser($user->load('technician')),
            'token'   => $token,
        ]);
    }

    public function logout(Request $request): JsonResponse
    {
        $request->user()->currentAccessToken()->delete();
        return response()->json(['message' => 'Logged out successfully']);
    }

    public function me(Request $request): JsonResponse
    {
        $user = $request->user()->load('technician');
        return response()->json(['user' => $this->formatUser($user)]);
    }

    private function formatUser(User $user): array
    {
        $data = [
            'id'          => $user->id,
            'name'        => $user->name,
            'email'       => $user->email,
            'role'        => $user->role,
            'phone'       => $user->phone,
            'avatar'      => $user->avatar_url,
            'avatar_url'  => $user->avatar_url,
            'city'        => $user->city,
            'state'       => $user->state,
            'country'     => $user->country,
            'is_active'   => $user->is_active,
            'is_verified' => $user->is_verified,
        ];

        if ($user->relationLoaded('technician') && $user->technician) {
            $data['technician_id'] = $user->technician->id;
            $data['verification_status'] = $user->technician->verification_status;
        }

        return $data;
    }
}
