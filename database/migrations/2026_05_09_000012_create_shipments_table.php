<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('shipments', function (Blueprint $table) {
            $table->id('shipment_id');
            $table->unsignedBigInteger('order_id');
            $table->string('tracking_number')->nullable();
            $table->dateTime('delivered_at')->nullable();
            $table->string('status')->default('pending'); // pending, picked_up, in_transit, delivered, returned
            $table->text('notes')->nullable();

            $table->foreign('order_id')->references('order_id')->on('orders')->onDelete('cascade');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('shipments');
    }
};
