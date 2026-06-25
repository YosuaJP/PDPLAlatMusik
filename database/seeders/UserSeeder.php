<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class UserSeeder extends Seeder
{
    public function run(): void
    {
        // Admin Utama
        User::create([
            'name'         => 'Admin Toko',
            'email'        => 'admin@alatmusik.com',
            'password'     => Hash::make('password'),
            'role'         => 'admin',
            'phone_number' => '081200000001',
            'status'       => 'active',
            'created_at'   => now(),
            'updated_at'   => now(),
        ]);

        // Admin Tim — NRP@alatmusik.com (password = NRP)
        $teamAdmins = [
            ['nrp' => '2372017', 'name' => 'Christian Jeffri Raphaell'],
            ['nrp' => '2372019', 'name' => 'Charles Sung'],
            ['nrp' => '2372022', 'name' => 'Jason Christian Jonathan'],
            ['nrp' => '2472027', 'name' => 'Yosua Juswandiputra'],
        ];

        foreach ($teamAdmins as $admin) {
            $email = $admin['nrp'] . '@alatmusik.com';
            if (!User::where('email', $email)->exists()) {
                User::create([
                    'name'         => $admin['name'],
                    'email'        => $email,
                    'password'     => Hash::make($admin['nrp']),
                    'role'         => 'admin',
                    'phone_number' => null,
                    'status'       => 'active',
                    'created_at'   => now(),
                    'updated_at'   => now(),
                ]);
            }
        }

        // Customers
        $customers = [
            ['name' => 'Budi Santoso', 'email' => 'budi@gmail.com', 'phone' => '081234567890'],
            ['name' => 'Sari Dewi', 'email' => 'sari@gmail.com', 'phone' => '081234567891'],
            ['name' => 'Ahmad Fauzi', 'email' => 'ahmad@gmail.com', 'phone' => '081234567892'],
            ['name' => 'Linda Permata', 'email' => 'linda@gmail.com', 'phone' => '081234567893'],
            ['name' => 'Rizky Pratama', 'email' => 'rizky@gmail.com', 'phone' => '081234567894'],
        ];

        foreach ($customers as $c) {
            User::create([
                'name' => $c['name'],
                'email' => $c['email'],
                'password' => Hash::make('password'),
                'role' => 'customer',
                'phone_number' => $c['phone'],
                'status' => 'active',
                'created_at' => now(),
                'updated_at' => now(),
            ]);
        }
    }
}
