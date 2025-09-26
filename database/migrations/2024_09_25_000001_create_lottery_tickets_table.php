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
        Schema::create('lottery_tickets', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('player_id');
            $table->string('player_user_name', 100);
            $table->string('selected_digit', 10); // e.g., "022", "024", "026", "037"
            $table->decimal('amount', 10, 2); // e.g., 1000.00
            $table->timestamp('selected_datetime'); // Myanmar time
            $table->string('payment_status', 20)->default('pending'); // pending, completed, failed
            $table->string('payment_method', 50)->nullable(); // kpay, bank_transfer, etc.
            $table->text('payment_reference')->nullable(); // transaction reference
            $table->timestamp('payment_completed_at')->nullable();
            $table->timestamps();

            // Indexes for better performance
            $table->index(['player_id', 'selected_datetime']);
            $table->index(['selected_digit', 'selected_datetime']);
            $table->index('payment_status');

            // Foreign key constraint if you have a users table
            $table->foreign('player_id')->references('id')->on('users')->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('lottery_tickets');
    }
};
