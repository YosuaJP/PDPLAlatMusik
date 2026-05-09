<?php

namespace Database\Seeders;

use App\Models\Promo;
use Illuminate\Database\Seeder;

class PromoSeeder extends Seeder
{
    public function run(): void
    {
        $promos = [
            [
                'promo_code'          => 'WELCOME10',
                'promo_name'          => 'Welcome Discount 10%',
                'promo_type'          => 'percentage',
                'discount_value'      => 10,
                'max_discount_amount' => 200000,
                'min_purchase'        => 500000,
                'start_date'          => now()->subMonths(3),
                'end_date'            => now()->addMonths(6),
                'active'              => true,
            ],
            [
                'promo_code'          => 'MUSIK50K',
                'promo_name'          => 'Diskon Flat 50rb',
                'promo_type'          => 'fixed',
                'discount_value'      => 50000,
                'max_discount_amount' => null,
                'min_purchase'        => 300000,
                'start_date'          => now()->subMonth(),
                'end_date'            => now()->addMonth(),
                'active'              => true,
            ],
            [
                'promo_code'          => 'GITAR20',
                'promo_name'          => 'Festival Gitar 20%',
                'promo_name'          => 'Festival Gitar 20%',
                'promo_type'          => 'percentage',
                'discount_value'      => 20,
                'max_discount_amount' => 1500000,
                'min_purchase'        => 2000000,
                'start_date'          => now()->subDays(7),
                'end_date'            => now()->addDays(14),
                'active'              => true,
            ],
            [
                'promo_code'          => 'ENDYEAR25',
                'promo_name'          => 'Year End Sale 25%',
                'promo_type'          => 'percentage',
                'discount_value'      => 25,
                'max_discount_amount' => 3000000,
                'min_purchase'        => 5000000,
                'start_date'          => now()->subMonths(6),
                'end_date'            => now()->subMonths(5), // sudah expired
                'active'              => false,
            ],
        ];

        foreach ($promos as $promo) {
            Promo::create($promo);
        }
    }
}
