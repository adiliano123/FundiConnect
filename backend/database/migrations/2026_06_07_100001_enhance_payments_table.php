<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('payments', function (Blueprint $table) {
            // Extended payment method & gateway fields
            $table->string('gateway')->nullable()->after('payment_method');
            $table->string('phone_number')->nullable()->after('gateway');
            $table->string('gateway_reference')->nullable()->after('phone_number');
            $table->timestamp('paid_at')->nullable()->after('gateway_reference');
            $table->text('failure_reason')->nullable()->after('paid_at');

            // Commission rate snapshot
            $table->decimal('commission_rate', 5, 2)->default(10.00)->after('technician_payout');
        });
    }

    public function down(): void
    {
        Schema::table('payments', function (Blueprint $table) {
            $table->dropColumn([
                'gateway', 'phone_number', 'gateway_reference',
                'paid_at', 'failure_reason', 'commission_rate',
            ]);
        });
    }
};
