<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class UserSeeder extends Seeder
{
    public function run(): void
    {
        // Admin
        User::create([
            'name' => 'Admin Toko',
            'email' => 'admin@alatmusik.com',
            'password' => Hash::make('password'),
            'role' => 'admin',
            'phone_number' => '081200000001',
            'status' => 'active',
            'created_at' => now(),
            'updated_at' => now(),
        ]);

        // Customers
        $customers = [
            ['name' => 'Charles Sung', 'email' => 'budi@gmail.com', 'phone' => '081234567890'],
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
