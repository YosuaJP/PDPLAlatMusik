<?php

namespace Database\Seeders;

use App\Models\UserAddress;
use Illuminate\Database\Seeder;

class UserAddressSeeder extends Seeder
{
    public function run(): void
    {
        $addresses = [
            // Budi (user_id=2)
            [
                'user_id'     => 2,
                'label'       => 'Rumah',
                'address'     => 'Jl. Merdeka No. 12, RT 03/RW 05',
                'city'        => 'Jakarta Selatan',
                'postal_code' => '12550',
                'is_default'  => true,
                'created_at'  => now(),
            ],
            // Sari (user_id=3)
            [
                'user_id'     => 3,
                'label'       => 'Rumah',
                'address'     => 'Jl. Gatot Subroto No. 45, Blok B',
                'city'        => 'Bandung',
                'postal_code' => '40123',
                'is_default'  => true,
                'created_at'  => now(),
            ],
            [
                'user_id'     => 3,
                'label'       => 'Kantor',
                'address'     => 'Jl. Asia Afrika No. 8, Lt. 3',
                'city'        => 'Bandung',
                'postal_code' => '40112',
                'is_default'  => false,
                'created_at'  => now(),
            ],
            // Ahmad (user_id=4)
            [
                'user_id'     => 4,
                'label'       => 'Rumah',
                'address'     => 'Perum. Griya Asri Blok C No. 7',
                'city'        => 'Surabaya',
                'postal_code' => '60231',
                'is_default'  => true,
                'created_at'  => now(),
            ],
            // Linda (user_id=5)
            [
                'user_id'     => 5,
                'label'       => 'Apartemen',
                'address'     => 'Apartemen Green View Tower A Lt. 12 No. 1205',
                'city'        => 'Yogyakarta',
                'postal_code' => '55223',
                'is_default'  => true,
                'created_at'  => now(),
            ],
            // Rizky (user_id=6)
            [
                'user_id'     => 6,
                'label'       => 'Rumah',
                'address'     => 'Jl. Diponegoro No. 99, Komplek Indah',
                'city'        => 'Medan',
                'postal_code' => '20151',
                'is_default'  => true,
                'created_at'  => now(),
            ],
        ];

        foreach ($addresses as $addr) {
            UserAddress::create($addr);
        }
    }
}
