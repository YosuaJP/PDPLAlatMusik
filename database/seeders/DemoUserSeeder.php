<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

/**
 * DemoUserSeeder
 *
 * Membuat akun demo untuk seluruh mahasiswa Kelas B
 * berdasarkan daftar NRP yang diberikan.
 *
 * Format email : [NRP]@student.maranatha.ac.id
 * Password     : NRP masing-masing (misal: 2372050)
 * Role         : customer (kecuali anggota tim -> admin)
 *
 * @author  Antigravity AI (generated for NadaKito demo)
 * @see     https://github.com/YosuaJP/PDPLAlatMusik
 */
class DemoUserSeeder extends Seeder
{
    /**
     * NRP anggota tim yang diberi akses admin demo.
     * Sisanya mendapat akses customer.
     */
    private array $teamNrp = [
        '2372017', // Christian Jeffri Raphaell
        '2372019', // Charles Sung
        '2372022', // Jason Christian Jonathan
        '2472027', // Yosua Juswandiputra
    ];

    /**
     * Daftar seluruh mahasiswa Kelas B beserta NRP-nya.
     */
    private array $students = [
        ['nrp' => '720309', 'name' => 'Oscar Karnalim, S.T., M.T.'],
        ['nrp' => '2372050', 'name' => 'Alexsander Josse Sulistio'],
        ['nrp' => '2472014', 'name' => 'Archangela Sheilla Haryanto Sundjaya'],
        ['nrp' => '2372015', 'name' => 'Ariel Jonathan Wihardja'],
        ['nrp' => '2472046', 'name' => 'Brilian Viconaftali Tamalau'],
        ['nrp' => '2372019', 'name' => 'Charles Sung'],
        ['nrp' => '2372017', 'name' => 'Christian Jeffri Raphaell'],
        ['nrp' => '2272040', 'name' => 'Daud Junaldi Parasian Panjaitan'],
        ['nrp' => '2372007', 'name' => 'Deivin Sandrian'],
        ['nrp' => '2472011', 'name' => 'Dominic Xaviera'],
        ['nrp' => '2372902', 'name' => 'Fachrizqy Utomo'],
        ['nrp' => '2372053', 'name' => 'Felicia Jean Andrea Preta Moton'],
        ['nrp' => '2472021', 'name' => 'Ferdinand Brian Gondosupadmo'],
        ['nrp' => '2272024', 'name' => 'Gilang Ardiwilaga'],
        ['nrp' => '2372022', 'name' => 'Jason Christian Jonathan'],
        ['nrp' => '2472013', 'name' => 'Javier Leander Wijaya'],
        ['nrp' => '2272019', 'name' => 'Johanes Mario Pranata Listianto'],
        ['nrp' => '2472033', 'name' => 'Josephine Andrea Sanjaya'],
        ['nrp' => '2472043', 'name' => 'Keyren Estevania'],
        ['nrp' => '2372027', 'name' => 'Mary Yekholya Simbolon'],
        ['nrp' => '2372056', 'name' => 'Maverick Rafael Tanadi'],
        ['nrp' => '2372042', 'name' => 'Muhammad Rasyad Andhika Yogaswara'],
        ['nrp' => '2372036', 'name' => 'Muhammad Sava Akbar Bastaman'],
        ['nrp' => '2372012', 'name' => 'Rachel Apriyani'],
        ['nrp' => '2472017', 'name' => 'Ricko'],
        ['nrp' => '2372062', 'name' => 'Serra Dominggus Guntur Sawaki'],
        ['nrp' => '2372006', 'name' => 'Stepanus Sugianto'],
        ['nrp' => '2372059', 'name' => 'Syahrial Achmad'],
        ['nrp' => '2372004', 'name' => 'Thaddeus Clarence Leonardy'],
        ['nrp' => '2472034', 'name' => 'Theofilus Victor King'],
        ['nrp' => '2472027', 'name' => 'Yosua Juswandiputra'],
        ['nrp' => '2372028', 'name' => 'Yudi Hamdani'],
    ];

    public function run(): void
    {
        $created = 0;
        $skipped = 0;

        foreach ($this->students as $student) {
            $email = $student['nrp'] . '@student.maranatha.ac.id';

            // Lewati jika email sudah ada (idempotent seeder)
            if (User::where('email', $email)->exists()) {
                $skipped++;
                continue;
            }

            $isTeam = in_array($student['nrp'], $this->teamNrp);

            User::create([
                'name'         => $student['name'],
                'email'        => $email,
                'password'     => Hash::make($student['nrp']),  // password = NRP
                'role'         => $isTeam ? 'admin' : 'customer',
                'phone_number' => null,
                'status'       => 'active',
                'created_at'   => now(),
                'updated_at'   => now(),
            ]);

            $created++;
        }

        $this->command->info("DemoUserSeeder selesai: {$created} akun dibuat, {$skipped} dilewati.");
    }
}
