<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('technicians', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->cascadeOnDelete();
            $table->foreignId('category_id')->nullable()->constrained()->nullOnDelete();
            $table->string('bio')->nullable();
            $table->text('description')->nullable();
            $table->unsignedSmallInteger('experience_years')->default(0);
            $table->string('id_number')->nullable();
            $table->string('license_number')->nullable();
            $table->decimal('hourly_rate', 10, 2)->default(0);
            $table->decimal('rating', 3, 2)->default(0);
            $table->unsignedInteger('total_reviews')->default(0);
            $table->unsignedInteger('total_jobs')->default(0);
            $table->string('service_area')->nullable();
            $table->boolean('is_available')->default(true);
            $table->enum('verification_status', ['pending', 'verified', 'rejected'])->default('pending');
            $table->text('rejection_reason')->nullable();
            $table->json('working_hours')->nullable(); // {"mon":{"start":"08:00","end":"17:00"},...}
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('technicians');
    }
};
