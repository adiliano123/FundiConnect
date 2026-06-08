<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

/**
 * Add 'awaiting_payment' and 'paid' to bookings.status enum.
 * Also adds paid_at timestamp column.
 *
 * MySQL requires re-defining the full ENUM to add values.
 */
return new class extends Migration
{
    public function up(): void
    {
        // Modify the enum to include new statuses
        DB::statement("ALTER TABLE bookings MODIFY COLUMN status ENUM(
            'pending',
            'accepted',
            'awaiting_payment',
            'paid',
            'rejected',
            'in_progress',
            'completed',
            'cancelled'
        ) NOT NULL DEFAULT 'pending'");

        Schema::table('bookings', function (Blueprint $table) {
            $table->timestamp('paid_at')->nullable()->after('completed_at');
        });
    }

    public function down(): void
    {
        Schema::table('bookings', function (Blueprint $table) {
            $table->dropColumn('paid_at');
        });

        DB::statement("ALTER TABLE bookings MODIFY COLUMN status ENUM(
            'pending','accepted','rejected','in_progress','completed','cancelled'
        ) NOT NULL DEFAULT 'pending'");
    }
};
