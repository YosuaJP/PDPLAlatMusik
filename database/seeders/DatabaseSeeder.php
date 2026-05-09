<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     * Urutan penting: ikuti dependency antar tabel (foreign key).
     */
    public function run(): void
    {
        $this->call([
            UserSeeder::class,          // 1. Users dulu
            UserAddressSeeder::class,   // 2. Alamat user
            CategorySeeder::class,      // 3. Kategori produk
            ProductSeeder::class,       // 4. Produk
            PromoSeeder::class,         // 5. Promo/voucher
            OrderSeeder::class,         // 6. Orders + semua turunannya (cart, payment, shipment, review, refund, stock_movement)
        ]);
    }
}
