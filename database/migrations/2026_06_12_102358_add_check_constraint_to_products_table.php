<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    public function up(): void
    {
        try {
            DB::statement('ALTER TABLE products ADD CONSTRAINT check_stock_qty CHECK (stock_qty >= 0)');
        } catch (\Exception $e) {
            // Ignore SQLite lack of support for ALTER TABLE ADD CONSTRAINT in testing
        }
    }

    public function down(): void
    {
        try {
            DB::statement('ALTER TABLE products DROP CONSTRAINT check_stock_qty');
        } catch (\Exception $e) {
            // Ignore SQLite error in testing rollback
        }
    }
};
