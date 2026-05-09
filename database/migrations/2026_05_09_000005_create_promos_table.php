<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('promos', function (Blueprint $table) {
            $table->id('promo_id');
            $table->string('promo_code')->unique();
            $table->string('promo_name');
            $table->string('promo_type'); // percentage, fixed
            $table->decimal('discount_value', 15, 2);
            $table->decimal('max_discount_amount', 15, 2)->nullable();
            $table->decimal('min_purchase', 15, 2)->default(0);
            $table->dateTime('start_date');
            $table->dateTime('end_date');
            $table->boolean('active')->default(true);
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('promos');
    }
};
