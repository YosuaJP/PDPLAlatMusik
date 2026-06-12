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
        Schema::table('promos', function (Blueprint $table) {
            $table->string('scope')->default('global')->after('active'); // global, category, product
            $table->json('scope_category_ids')->nullable()->after('scope');
            $table->json('scope_product_ids')->nullable()->after('scope_category_ids');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('promos', function (Blueprint $table) {
            $table->dropColumn(['scope', 'scope_category_ids', 'scope_product_ids']);
        });
    }
};
