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
        Schema::create('payments', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('allocation_id');
            $table->decimal('base_amount', 10, 2); // Original package price
            $table->decimal('discount_value', 10, 2)->default(0.00); // Discount applied
            $table->decimal('final_amount', 10, 2); // Amount actually paid
            $table->enum('payment_method', ['cash', 'card', 'upi', 'other']);
            $table->datetime('payment_date');
            $table->enum('status', ['pending', 'completed', 'failed'])->default('pending');
            $table->timestamps();
            
            $table->foreign('allocation_id')->references('id')->on('bed_allocations');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('payments');
    }
};
