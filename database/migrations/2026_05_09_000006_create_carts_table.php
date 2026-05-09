<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('carts', function (Blueprint $table) {
            $table->id('cart_id');
            $table->unsignedBigInteger('user_id');
            $table->unsignedBigInteger('promo_id')->nullable();
            $table->string('status')->default('active'); // active, checked_out, expired
            $table->dateTime('expires_at')->nullable();
            $table->timestamp('created_at')->nullable();

            $table->foreign('user_id')->references('user_id')->on('users')->onDelete('cascade');
            $table->foreign('promo_id')->references('promo_id')->on('promos')->onDelete('set null');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('carts');
    }
};
