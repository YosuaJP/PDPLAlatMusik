<?php

namespace Database\Seeders;

use App\Models\Category;
use Illuminate\Database\Seeder;

class CategorySeeder extends Seeder
{
    public function run(): void
    {
        $categories = [
            [
                'category_name' => 'Gitar',
                'description'   => 'Berbagai jenis gitar akustik, klasik, dan elektrik dari brand ternama.',
                'active'        => true,
                'created_at'    => now(),
            ],
            [
                'category_name' => 'Bass',
                'description'   => 'Gitar bass elektrik dan akustik untuk semua level pemain.',
                'active'        => true,
                'created_at'    => now(),
            ],
            [
                'category_name' => 'Drum & Perkusi',
                'description'   => 'Drum akustik, drum elektrik, cajon, dan berbagai alat perkusi.',
                'active'        => true,
                'created_at'    => now(),
            ],
            [
                'category_name' => 'Keyboard & Piano',
                'description'   => 'Keyboard synthesizer, digital piano, dan organ untuk studio maupun panggung.',
                'active'        => true,
                'created_at'    => now(),
            ],
            [
                'category_name' => 'Alat Musik Tiup',
                'description'   => 'Saxophone, trumpet, flute, klarinet, dan berbagai alat tiup lainnya.',
                'active'        => true,
                'created_at'    => now(),
            ],
            [
                'category_name' => 'Aksesoris & Spare Part',
                'description'   => 'Senar, pick, strap, tuner, capo, dan berbagai aksesoris alat musik.',
                'active'        => true,
                'created_at'    => now(),
            ],
            [
                'category_name' => 'Studio & Recording',
                'description'   => 'Audio interface, microphone, monitor speaker, dan peralatan rekaman.',
                'active'        => true,
                'created_at'    => now(),
            ],
        ];

        foreach ($categories as $cat) {
            Category::create($cat);
        }
    }
}
