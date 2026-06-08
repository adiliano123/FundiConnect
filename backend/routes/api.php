<?php

use App\Http\Controllers\API\Admin\AdminController;
use App\Http\Controllers\API\Admin\RevenueController;
use App\Http\Controllers\API\Admin\UserManagementController;
use App\Http\Controllers\API\Admin\WithdrawalManagementController;
use App\Http\Controllers\API\AuthController;
use App\Http\Controllers\API\BookingController;
use App\Http\Controllers\API\CategoryController;
use App\Http\Controllers\API\ComplaintController;
use App\Http\Controllers\API\NotificationController;
use App\Http\Controllers\API\PaymentController;
use App\Http\Controllers\API\ProfileController;
use App\Http\Controllers\API\ReviewController;
use App\Http\Controllers\API\TechnicianController;
use App\Http\Controllers\API\WalletController;
use App\Http\Controllers\API\WithdrawalController;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| Public Routes
|--------------------------------------------------------------------------
*/
Route::prefix('auth')->group(function () {
    Route::post('/register', [AuthController::class, 'register']);
    Route::post('/login',    [AuthController::class, 'login']);
});

// Public: Categories & Technicians
Route::get('/categories', [CategoryController::class, 'index']);
Route::get('/categories/{category}', [CategoryController::class, 'show']);
Route::get('/technicians', [TechnicianController::class, 'index']);
Route::get('/technicians/{technician}', [TechnicianController::class, 'show']);
Route::get('/technicians/{technician}/reviews', [ReviewController::class, 'technicianReviews']);

// ZenoPay webhook — public, no auth
Route::post('/payments/webhook', [PaymentController::class, 'webhook']);

/*
|--------------------------------------------------------------------------
| Authenticated Routes
|--------------------------------------------------------------------------
*/
Route::middleware('auth:sanctum')->group(function () {

    // Auth
    Route::post('/auth/logout', [AuthController::class, 'logout']);
    Route::get('/auth/me',      [AuthController::class, 'me']);

    // Profile
    Route::put('/profile',              [ProfileController::class, 'update']);
    Route::post('/profile/password',    [ProfileController::class, 'changePassword']);
    Route::post('/profile/avatar',      [ProfileController::class, 'uploadAvatar']);

    // Notifications
    Route::get('/notifications',            [NotificationController::class, 'index']);
    Route::get('/notifications/unread-count', [NotificationController::class, 'unreadCount']);
    Route::patch('/notifications/{id}/read', [NotificationController::class, 'markAsRead']);
    Route::post('/notifications/read-all',  [NotificationController::class, 'markAllRead']);

    /*
    |----------------------------------------------------------------------
    | Customer Routes
    |----------------------------------------------------------------------
    */
    Route::middleware('role:customer,admin')->group(function () {
        Route::post('/bookings',    [BookingController::class, 'store']);
        Route::post('/reviews',     [ReviewController::class, 'store']);
        Route::post('/complaints',  [ComplaintController::class, 'store']);

        // Payments (customer initiates)
        Route::post('/bookings/{booking}/pay', [PaymentController::class, 'initiate']);
    });

    // Payment verify — any authenticated user can poll their own payment
    Route::post('/payments/{payment}/verify', [PaymentController::class, 'verify']);

    // Payment history (customer + technician + admin)
    Route::get('/payments',           [PaymentController::class, 'index']);
    Route::get('/payments/{payment}', [PaymentController::class, 'show']);

    // Bookings (shared: customers see theirs, technicians see theirs, admins see all)
    Route::get('/bookings',                     [BookingController::class, 'index']);
    Route::get('/bookings/{booking}',           [BookingController::class, 'show']);
    Route::patch('/bookings/{booking}/status',  [BookingController::class, 'updateStatus']);

    // Complaints
    Route::get('/complaints', [ComplaintController::class, 'index']);

    /*
    |----------------------------------------------------------------------
    | Technician Routes
    |----------------------------------------------------------------------
    */
    Route::middleware('role:technician,admin')->group(function () {
        Route::get('/technician/profile',           [TechnicianController::class, 'getMyProfile']);
        Route::put('/technician/profile',           [TechnicianController::class, 'updateProfile']);
        Route::post('/technician/avatar',           [TechnicianController::class, 'uploadAvatar']);
        Route::post('/technician/portfolio',        [TechnicianController::class, 'uploadPortfolio']);
        Route::get('/technician/reviews',           [ReviewController::class, 'myReviews']);

        // Wallet
        Route::get('/wallet',                       [WalletController::class, 'show']);
        Route::get('/wallet/transactions',          [WalletController::class, 'transactions']);

        // Withdrawals
        Route::get('/withdrawals',                  [WithdrawalController::class, 'index']);
        Route::post('/withdrawals',                 [WithdrawalController::class, 'store']);
    });

    /*
    |----------------------------------------------------------------------
    | Admin Routes
    |----------------------------------------------------------------------
    */
    Route::middleware('role:admin')->prefix('admin')->group(function () {
        Route::get('/dashboard', [AdminController::class, 'dashboard']);

        // User management
        Route::get('/users',                               [UserManagementController::class, 'index']);
        Route::get('/users/{user}',                        [UserManagementController::class, 'show']);
        Route::patch('/users/{user}/suspend',              [UserManagementController::class, 'toggleSuspend']);
        Route::get('/technicians/pending',                 [UserManagementController::class, 'pendingTechnicians']);
        Route::patch('/technicians/{technician}/verify',   [UserManagementController::class, 'verifyTechnician']);

        // Categories management
        Route::post('/categories',             [CategoryController::class, 'store']);
        Route::put('/categories/{category}',   [CategoryController::class, 'update']);
        Route::delete('/categories/{category}', [CategoryController::class, 'destroy']);

        // Complaint resolution
        Route::patch('/complaints/{complaint}/resolve', [ComplaintController::class, 'resolve']);

        // Reviews management
        Route::get('/reviews',             [ReviewController::class, 'adminIndex']);
        Route::delete('/reviews/{review}', [ReviewController::class, 'destroy']);

        // Revenue & payments
        Route::get('/revenue/summary',          [RevenueController::class, 'summary']);
        Route::get('/revenue/monthly',          [RevenueController::class, 'monthly']);
        Route::get('/revenue/by-method',        [RevenueController::class, 'byMethod']);
        Route::get('/revenue/top-technicians',  [RevenueController::class, 'topTechnicians']);
        Route::get('/revenue/payments',         [RevenueController::class, 'payments']);

        // Withdrawal management
        Route::get('/withdrawals',                              [WithdrawalManagementController::class, 'index']);
        Route::patch('/withdrawals/{withdrawal}/approve',       [WithdrawalManagementController::class, 'approve']);
        Route::patch('/withdrawals/{withdrawal}/reject',        [WithdrawalManagementController::class, 'reject']);

        // Notification logs
        Route::get('/notification-logs', function () {
            $logs = \App\Models\NotificationLog::with(['booking', 'user'])
                ->latest()->paginate(50);
            return response()->json($logs);
        });
    });
});
