<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Mail\PasswordResetMail;
use App\Models\User;
use App\Services\MailService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Str;

class PasswordResetController extends Controller
{
    /**
     * Send a password reset link to the given email.
     */
    public function forgotPassword(Request $request): JsonResponse
    {
        $request->validate([
            'email' => 'required|email',
        ]);

        $user = User::where('email', $request->email)->first();

        // Always return success to prevent email enumeration
        if (!$user) {
            return response()->json([
                'message' => 'If that email is registered, you will receive a reset link shortly.',
            ]);
        }

        // Delete any existing tokens for this email
        DB::table('password_reset_tokens')->where('email', $user->email)->delete();

        // Generate a secure token
        $token = Str::random(64);

        DB::table('password_reset_tokens')->insert([
            'email'      => $user->email,
            'token'      => Hash::make($token),
            'created_at' => now(),
        ]);

        $resetUrl = (env('FRONTEND_URL', 'http://localhost:3000'))
            . '/auth/reset-password?token=' . $token
            . '&email=' . urlencode($user->email);

        try {
            MailService::send(
                $user->email,
                new PasswordResetMail($user, $resetUrl),
                'password_reset',
                'customer',
                null,
                $user->id
            );
        } catch (\Throwable $e) {
            Log::error('Password reset email failed', [
                'user_id' => $user->id,
                'error'   => $e->getMessage(),
            ]);
        }

        return response()->json([
            'message' => 'If that email is registered, you will receive a reset link shortly.',
        ]);
    }

    /**
     * Reset the password using the token.
     */
    public function resetPassword(Request $request): JsonResponse
    {
        $request->validate([
            'token'                 => 'required|string',
            'email'                 => 'required|email',
            'password'              => 'required|string|min:8|confirmed',
            'password_confirmation' => 'required|string',
        ]);

        $record = DB::table('password_reset_tokens')
            ->where('email', $request->email)
            ->first();

        if (!$record || !Hash::check($request->token, $record->token)) {
            return response()->json([
                'message' => 'Invalid or expired reset token.',
            ], 422);
        }

        // Tokens expire after 60 minutes
        if (now()->diffInMinutes($record->created_at) > 60) {
            DB::table('password_reset_tokens')->where('email', $request->email)->delete();
            return response()->json([
                'message' => 'This reset link has expired. Please request a new one.',
            ], 422);
        }

        $user = User::where('email', $request->email)->first();

        if (!$user) {
            return response()->json(['message' => 'User not found.'], 404);
        }

        $user->update([
            'password' => Hash::make($request->password),
        ]);

        // Invalidate all existing tokens for this user
        $user->tokens()->delete();

        // Clean up the reset token
        DB::table('password_reset_tokens')->where('email', $request->email)->delete();

        return response()->json([
            'message' => 'Password reset successful. You can now sign in with your new password.',
        ]);
    }
}
