<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('wallets', function (Blueprint $table) {
            $table->id();
            $table->foreignId('technician_id')->unique()->constrained()->cascadeOnDelete();
            $table->decimal('balance', 12, 2)->default(0);          // available to withdraw
            $table->decimal('pending_balance', 12, 2)->default(0);  // earned, not yet cleared
            $table->decimal('total_earned', 12, 2)->default(0);     // all-time earnings
            $table->decimal('total_withdrawn', 12, 2)->default(0);  // all-time withdrawals
            $table->string('currency', 10)->default('TZS');
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('wallets');
    }
};
