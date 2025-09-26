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
        Schema::table('lottery_tickets', function (Blueprint $table) {
            $table->string('payment_image', 255)->nullable()->after('payment_reference');
            $table->string('payment_verified_by', 100)->nullable()->after('payment_image');
            $table->timestamp('payment_verified_at')->nullable()->after('payment_verified_by');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('lottery_tickets', function (Blueprint $table) {
            $table->dropColumn(['payment_image', 'payment_verified_by', 'payment_verified_at']);
        });
    }
};
