<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('bed_allocations', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('customer_id');
            $table->unsignedBigInteger('bed_id');
            $table->unsignedBigInteger('package_id');
            $table->datetime('start_time'); // Start of therapy
            $table->datetime('end_time'); // start_time + package duration
            $table->enum('status', ['pending', 'active', 'completed', 'cancelled'])->default('pending');
            $table->enum('payment_status', ['pending', 'paid'])->default('pending');
            $table->timestamps();
            
            $table->foreign('customer_id')->references('id')->on('customers');
            $table->foreign('bed_id')->references('id')->on('beds');
            $table->foreign('package_id')->references('id')->on('packages');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('bed_allocations');
    }
};
