<?php

namespace App\Http\Controllers\API;

/**
 * @OA\Info(
 *     title="FundiConnect API",
 *     version="1.0.0",
 *     description="REST API for FundiConnect — a platform connecting customers with verified skilled technicians in Tanzania.",
 *     @OA\Contact(email="support@fundiconnect.co.tz"),
 *     @OA\License(name="MIT")
 * )
 *
 * @OA\Server(url="/api", description="API Base URL")
 *
 * @OA\SecurityScheme(
 *     securityScheme="sanctum",
 *     type="http",
 *     scheme="bearer",
 *     bearerFormat="JWT",
 *     description="Enter the token returned from /auth/login or /auth/register"
 * )
 *
 * @OA\Tag(name="Auth",          description="Registration, login, logout")
 * @OA\Tag(name="Profile",       description="User profile management")
 * @OA\Tag(name="Technicians",   description="Browse and manage technician profiles")
 * @OA\Tag(name="Categories",    description="Service categories")
 * @OA\Tag(name="Bookings",      description="Create and manage service bookings")
 * @OA\Tag(name="Payments",      description="Initiate and track payments")
 * @OA\Tag(name="Reviews",       description="Customer reviews for technicians")
 * @OA\Tag(name="Wallet",        description="Technician wallet and transactions")
 * @OA\Tag(name="Withdrawals",   description="Technician withdrawal requests")
 * @OA\Tag(name="Complaints",    description="Booking complaints")
 * @OA\Tag(name="Notifications", description="In-app notifications")
 * @OA\Tag(name="Admin",         description="Admin-only management endpoints")
 *
 * ---------------------------------------------------------------------------
 * Reusable Schemas
 * ---------------------------------------------------------------------------
 *
 * @OA\Schema(
 *     schema="User",
 *     @OA\Property(property="id",           type="integer",  example=1),
 *     @OA\Property(property="name",         type="string",   example="John Doe"),
 *     @OA\Property(property="email",        type="string",   example="john@example.com"),
 *     @OA\Property(property="role",         type="string",   enum={"customer","technician","admin"}),
 *     @OA\Property(property="phone",        type="string",   example="255712345678"),
 *     @OA\Property(property="avatar_url",   type="string",   example="https://..."),
 *     @OA\Property(property="city",         type="string",   example="Dar es Salaam"),
 *     @OA\Property(property="is_active",    type="boolean",  example=true),
 *     @OA\Property(property="is_verified",  type="boolean",  example=false)
 * )
 *
 * @OA\Schema(
 *     schema="Category",
 *     @OA\Property(property="id",                 type="integer", example=1),
 *     @OA\Property(property="name",               type="string",  example="Electrical"),
 *     @OA\Property(property="slug",               type="string",  example="electrical"),
 *     @OA\Property(property="description",        type="string"),
 *     @OA\Property(property="is_active",          type="boolean", example=true),
 *     @OA\Property(property="technicians_count",  type="integer", example=12)
 * )
 *
 * @OA\Schema(
 *     schema="Technician",
 *     @OA\Property(property="id",                  type="integer", example=3),
 *     @OA\Property(property="bio",                 type="string"),
 *     @OA\Property(property="experience_years",    type="integer", example=5),
 *     @OA\Property(property="hourly_rate",         type="number",  example=15000),
 *     @OA\Property(property="rating",              type="number",  example=4.8),
 *     @OA\Property(property="total_reviews",       type="integer", example=32),
 *     @OA\Property(property="is_available",        type="boolean", example=true),
 *     @OA\Property(property="verification_status", type="string",  enum={"pending","verified","rejected"}),
 *     @OA\Property(property="user",    ref="#/components/schemas/User"),
 *     @OA\Property(property="category",ref="#/components/schemas/Category")
 * )
 *
 * @OA\Schema(
 *     schema="Booking",
 *     @OA\Property(property="id",             type="integer", example=21),
 *     @OA\Property(property="booking_number", type="string",  example="BK-20240001"),
 *     @OA\Property(property="description",    type="string",  example="Fix kitchen light"),
 *     @OA\Property(property="address",        type="string",  example="123 Msimbazi St"),
 *     @OA\Property(property="city",           type="string",  example="Dar es Salaam"),
 *     @OA\Property(property="scheduled_at",   type="string",  format="date-time"),
 *     @OA\Property(property="status",         type="string",  enum={"pending","accepted","awaiting_payment","paid","rejected","in_progress","completed","cancelled"}),
 *     @OA\Property(property="estimated_cost", type="number",  example=25000),
 *     @OA\Property(property="final_cost",     type="number",  example=22000),
 *     @OA\Property(property="created_at",     type="string",  format="date-time"),
 *     @OA\Property(property="customer",   ref="#/components/schemas/User"),
 *     @OA\Property(property="technician", ref="#/components/schemas/Technician"),
 *     @OA\Property(property="category",   ref="#/components/schemas/Category")
 * )
 *
 * @OA\Schema(
 *     schema="Payment",
 *     @OA\Property(property="id",                 type="integer", example=10),
 *     @OA\Property(property="reference",          type="string",  example="FC-PAY-XXXXXXXX"),
 *     @OA\Property(property="amount",             type="number",  example=25000),
 *     @OA\Property(property="platform_fee",       type="number",  example=2500),
 *     @OA\Property(property="technician_payout",  type="number",  example=22500),
 *     @OA\Property(property="currency",           type="string",  example="TZS"),
 *     @OA\Property(property="status",             type="string",  enum={"pending","completed","failed","refunded"}),
 *     @OA\Property(property="payment_method",     type="string",  enum={"mpesa","airtel","tigopesa","halopesa","visa","mastercard"}),
 *     @OA\Property(property="phone_number",       type="string",  example="255712345678"),
 *     @OA\Property(property="paid_at",            type="string",  format="date-time"),
 *     @OA\Property(property="created_at",         type="string",  format="date-time")
 * )
 *
 * @OA\Schema(
 *     schema="Review",
 *     @OA\Property(property="id",         type="integer", example=5),
 *     @OA\Property(property="rating",     type="integer", minimum=1, maximum=5, example=5),
 *     @OA\Property(property="comment",    type="string",  example="Excellent work!"),
 *     @OA\Property(property="created_at", type="string",  format="date-time"),
 *     @OA\Property(property="customer",   ref="#/components/schemas/User")
 * )
 *
 * @OA\Schema(
 *     schema="Wallet",
 *     @OA\Property(property="id",               type="integer", example=1),
 *     @OA\Property(property="balance",          type="number",  example=50000),
 *     @OA\Property(property="pending_balance",  type="number",  example=10000),
 *     @OA\Property(property="total_earned",     type="number",  example=200000),
 *     @OA\Property(property="total_withdrawn",  type="number",  example=150000),
 *     @OA\Property(property="currency",         type="string",  example="TZS")
 * )
 *
 * @OA\Schema(
 *     schema="Complaint",
 *     @OA\Property(property="id",               type="integer", example=3),
 *     @OA\Property(property="subject",          type="string",  example="Technician did not show up"),
 *     @OA\Property(property="description",      type="string"),
 *     @OA\Property(property="status",           type="string",  enum={"open","under_review","resolved","dismissed"}),
 *     @OA\Property(property="resolution_notes", type="string"),
 *     @OA\Property(property="created_at",       type="string",  format="date-time")
 * )
 *
 * @OA\Schema(
 *     schema="WithdrawalRequest",
 *     @OA\Property(property="id",             type="integer", example=2),
 *     @OA\Property(property="reference",      type="string",  example="WDR-XXXXXXXXXX"),
 *     @OA\Property(property="amount",         type="number",  example=30000),
 *     @OA\Property(property="currency",       type="string",  example="TZS"),
 *     @OA\Property(property="method",         type="string",  enum={"mpesa","airtel","tigopesa","halopesa","bank"}),
 *     @OA\Property(property="account_number", type="string",  example="255712345678"),
 *     @OA\Property(property="account_name",   type="string",  example="John Doe"),
 *     @OA\Property(property="status",         type="string",  enum={"pending","approved","processing","completed","rejected"}),
 *     @OA\Property(property="created_at",     type="string",  format="date-time")
 * )
 *
 * @OA\Schema(
 *     schema="PaginatedMeta",
 *     @OA\Property(property="current_page", type="integer", example=1),
 *     @OA\Property(property="last_page",    type="integer", example=5),
 *     @OA\Property(property="per_page",     type="integer", example=10),
 *     @OA\Property(property="total",        type="integer", example=48)
 * )
 *
 * @OA\Schema(
 *     schema="Error",
 *     @OA\Property(property="message", type="string", example="Unauthorized")
 * )
 */
class SwaggerDefinitions {}
