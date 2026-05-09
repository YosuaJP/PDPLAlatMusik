<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('user_addresses', function (Blueprint $table) {
            $table->id('address_id');
            $table->unsignedBigInteger('user_id');
            $table->string('label'); // e.g. Rumah, Kantor
            $table->text('address');
            $table->string('city');
            $table->string('postal_code');
            $table->boolean('is_default')->default(false);
            $table->timestamp('created_at')->nullable();

            $table->foreign('user_id')->references('user_id')->on('users')->onDelete('cascade');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('user_addresses');
    }
};
