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
        Schema::table('beds', function (Blueprint $table) {
            $table->string('display_name')->nullable()->after('bed_number');
            $table->integer('grid_row')->default(1)->after('display_name');
            $table->integer('grid_col')->default(1)->after('grid_row');
            $table->string('bed_type')->default('standard')->after('grid_col'); // standard, vip, couple, etc.
            $table->decimal('hourly_rate', 10, 2)->nullable()->after('bed_type');
            $table->text('description')->nullable()->after('hourly_rate');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('beds', function (Blueprint $table) {
            $table->dropColumn([
                'display_name',
                'grid_row',
                'grid_col',
                'bed_type',
                'hourly_rate',
                'description'
            ]);
        });
    }
};
