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
        Schema::table('bed_allocations', function (Blueprint $table) {
            $table->string('booking_number')->unique()->nullable()->after('id');
            $table->text('notes')->nullable()->after('payment_status');
            $table->decimal('total_amount', 10, 2)->default(0)->after('payment_status');
            $table->decimal('discount_amount', 10, 2)->default(0)->after('total_amount');
            $table->decimal('service_charge', 10, 2)->default(0)->after('discount_amount');
            $table->decimal('tax_amount', 10, 2)->default(0)->after('service_charge');
            $table->decimal('final_amount', 10, 2)->default(0)->after('tax_amount');
            $table->unsignedBigInteger('created_by')->nullable()->after('notes');
            
            $table->foreign('created_by')->references('id')->on('users')->nullOnDelete();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('bed_allocations', function (Blueprint $table) {
            $table->dropForeign(['created_by']);
            $table->dropColumn([
                'booking_number',
                'notes',
                'total_amount',
                'discount_amount',
                'service_charge',
                'tax_amount',
                'final_amount',
                'created_by'
            ]);
        });
    }
};
