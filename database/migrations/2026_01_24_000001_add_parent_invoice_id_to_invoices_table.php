<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('invoices', function (Blueprint $table) {
            $table->unsignedBigInteger('parent_invoice_id')->nullable()->after('allocation_id');
            $table->foreign('parent_invoice_id')->references('id')->on('invoices')->nullOnDelete();
        });

        // Update invoice_type enum to include 'addon'
        DB::statement("ALTER TABLE invoices MODIFY COLUMN invoice_type ENUM('walk_in', 'booking', 'pos_sale', 'addon') DEFAULT 'pos_sale'");
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('invoices', function (Blueprint $table) {
            $table->dropForeign(['parent_invoice_id']);
            $table->dropColumn('parent_invoice_id');
        });

        DB::statement("ALTER TABLE invoices MODIFY COLUMN invoice_type ENUM('walk_in', 'booking', 'pos_sale') DEFAULT 'pos_sale'");
    }
};
