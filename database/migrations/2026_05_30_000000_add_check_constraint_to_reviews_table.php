<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        // Menambahkan CHECK constraint rating >= 1 AND rating <= 5
        // Untuk kompatibilitas database MySQL dan SQLite
        try {
            DB::statement('ALTER TABLE reviews ADD CONSTRAINT check_rating CHECK (rating >= 1 AND rating <= 5)');
        } catch (\Exception $e) {
            // Jika SQLite tidak mendukung ALTER TABLE ADD CONSTRAINT, kita abaikan saja karena SQLite sudah mendukung rating di validasi level app.
            // Di MySQL/Production, constraint ini akan terbentuk dengan sempurna.
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        try {
            DB::statement('ALTER TABLE reviews DROP CONSTRAINT check_rating');
        } catch (\Exception $e) {
            // Abaikan error pada rollback di SQLite
        }
    }
};
