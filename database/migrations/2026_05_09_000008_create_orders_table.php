<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('orders', function (Blueprint $table) {
            $table->id('order_id');
            $table->unsignedBigInteger('user_id');
            $table->unsignedBigInteger('address_id')->nullable();
            $table->unsignedBigInteger('promo_id')->nullable();
            $table->decimal('subtotal_amount', 15, 2);
            $table->decimal('discount_amount', 15, 2)->default(0);
            $table->decimal('shipping_cost', 15, 2)->default(0);
            $table->decimal('final_amount', 15, 2);
            $table->text('shipping_address')->nullable();
            $table->string('courier_code')->nullable();
            $table->string('status')->default('pending'); // pending, processing, shipped, delivered, cancelled, refunded
            $table->text('notes')->nullable();
            $table->timestamps();

            $table->foreign('user_id')->references('user_id')->on('users')->onDelete('restrict');
            $table->foreign('address_id')->references('address_id')->on('user_addresses')->onDelete('set null');
            $table->foreign('promo_id')->references('promo_id')->on('promos')->onDelete('set null');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('orders');
    }
};
