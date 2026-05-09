<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('payments', function (Blueprint $table) {
            $table->id('payment_id');
            $table->unsignedBigInteger('order_id');
            $table->string('external_id')->unique(); // ID dari sistem kita ke gateway
            $table->string('gateway_ref')->nullable(); // ID dari gateway
            $table->string('payment_url')->nullable();
            $table->string('payment_method')->nullable(); // gopay, bank_transfer, qris, dll
            $table->string('gateway_status')->nullable();
            $table->string('payment_status')->default('pending'); // pending, paid, failed, expired
            $table->decimal('amount', 15, 2);
            $table->decimal('paid_amount', 15, 2)->nullable();
            $table->decimal('gateway_fee', 15, 2)->nullable();
            $table->text('webhook_payload')->nullable();
            $table->dateTime('expired_at')->nullable();
            $table->dateTime('paid_at')->nullable();
            $table->timestamp('created_at')->nullable();

            $table->foreign('order_id')->references('order_id')->on('orders')->onDelete('cascade');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('payments');
    }
};
