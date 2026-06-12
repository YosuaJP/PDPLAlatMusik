<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    public function up(): void
    {
        DB::statement('ALTER TABLE products ADD CONSTRAINT check_stock_qty CHECK (stock_qty >= 0)');
    }

    public function down(): void
    {
        DB::statement('ALTER TABLE products DROP CONSTRAINT check_stock_qty');
    }
};
