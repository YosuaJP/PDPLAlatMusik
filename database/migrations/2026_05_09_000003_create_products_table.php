<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('products', function (Blueprint $table) {
            $table->id('product_id');
            $table->unsignedBigInteger('category_id');
            $table->string('name');
            $table->text('description')->nullable();
            $table->decimal('price', 15, 2);
            $table->integer('stock_qty')->default(0);
            $table->string('sku')->unique();
            $table->string('image_url')->nullable();
            $table->boolean('active')->default(true);
            $table->timestamp('updated_at')->nullable();
            $table->softDeletes('deleted_at');

            $table->foreign('category_id')->references('category_id')->on('categories')->onDelete('restrict');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('products');
    }
};
