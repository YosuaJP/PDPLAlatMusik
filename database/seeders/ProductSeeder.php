<?php

namespace Database\Seeders;

use App\Models\Product;
use Illuminate\Database\Seeder;

class ProductSeeder extends Seeder
{
    public function run(): void
    {
        // Copy images from base_path('foto') to public_path('images/products')
        $fotoDir = base_path('foto');
        $destDir = public_path('images/products');

        if (!\Illuminate\Support\Facades\File::exists($destDir)) {
            \Illuminate\Support\Facades\File::makeDirectory($destDir, 0755, true);
        }

        if (\Illuminate\Support\Facades\File::exists($fotoDir)) {
            $files = \Illuminate\Support\Facades\File::files($fotoDir);
            foreach ($files as $file) {
                \Illuminate\Support\Facades\File::copy(
                    $file->getPathname(),
                    $destDir . '/' . $file->getFilename()
                );
            }
        }

        $products = [
            // === GITAR (category_id=1) ===
            [
                'category_id' => 1,
                'name'        => 'Yamaha F310 Acoustic Guitar',
                'description' => 'Gitar akustik entry-level dengan body spruce top dan meranti back & sides. Cocok untuk pemula.',
                'price'       => 1250000,
                'stock_qty'   => 15,
                'sku'         => 'GTR-YAMF310',
                'image_url'   => '/images/products/Yamaha F310 Acoustic Guitar.webp',
                'active'      => true,
                'updated_at'  => now(),
            ],
            [
                'category_id' => 1,
                'name'        => 'Fender Stratocaster Standard Electric Guitar',
                'description' => 'Gitar elektrik Fender Stratocaster Player Series dengan pickup single-coil. Body alder, neck maple.',
                'price'       => 8500000,
                'stock_qty'   => 8,
                'sku'         => 'GTR-FENSTRAT',
                'image_url'   => '/images/products/Fender Stratocaster Standard Electric Guitar.webp',
                'active'      => true,
                'updated_at'  => now(),
            ],
            [
                'category_id' => 1,
                'name'        => 'Gibson Les Paul Standard Electric Guitar',
                'description' => 'Gitar elektrik premium Gibson Les Paul dengan pickup humbucker Burstbucker. Mahogany body.',
                'price'       => 25000000,
                'stock_qty'   => 3,
                'sku'         => 'GTR-GIBLESPAUL',
                'image_url'   => '/images/products/Gibson Les Paul Standard Electric Guitar.jpg',
                'active'      => true,
                'updated_at'  => now(),
            ],
            [
                'category_id' => 1,
                'name'        => 'Taylor 114ce Acoustic Electric Guitar',
                'description' => 'Gitar akustik-elektrik Taylor dengan top sitka spruce dan layali rosewood. Suara jernih dan proyeksi baik.',
                'price'       => 14500000,
                'stock_qty'   => 5,
                'sku'         => 'GTR-TAY114CE',
                'image_url'   => '/images/products/Taylor 114ce Acoustic Electric Guitar.webp',
                'active'      => true,
                'updated_at'  => now(),
            ],

            // === BASS (category_id=2) ===
            [
                'category_id' => 2,
                'name'        => 'Squier Affinity Jazz Bass',
                'description' => 'Bass elektrik Squier Jazz Bass entry-level dengan pickup split single-coil. Body poplar, neck maple.',
                'price'       => 2800000,
                'stock_qty'   => 10,
                'sku'         => 'BSS-SQRJAZZ',
                'image_url'   => '/images/products/Squier Affinity Jazz Bass.jpg',
                'active'      => true,
                'updated_at'  => now(),
            ],
            [
                'category_id' => 2,
                'name'        => 'Ibanez SR505 5-String Bass',
                'description' => 'Bass elektrik 5 senar Ibanez SR505 dengan pickup Bartolini. Ideal untuk slap bass.',
                'price'       => 6500000,
                'stock_qty'   => 6,
                'sku'         => 'BSS-IBANSR505',
                'image_url'   => '/images/products/Ibanez SR505 5-String Bass.webp',
                'active'      => true,
                'updated_at'  => now(),
            ],

            // === DRUM & PERKUSI (category_id=3) ===
            [
                'category_id' => 3,
                'name'        => 'Pearl Export EXX 5-Piece Drum Set',
                'description' => 'Set drum akustik 5 piece Pearl Export EXX. Termasuk hardware dan hi-hat, bass drum pedal.',
                'price'       => 9500000,
                'stock_qty'   => 4,
                'sku'         => 'DRM-PEARLEXX5',
                'image_url'   => '/images/products/Pearl Export EXX 5-Piece Drum Set.jpg',
                'active'      => true,
                'updated_at'  => now(),
            ],
            [
                'category_id' => 3,
                'name'        => 'Meinl Cajon Box Drum',
                'description' => 'Cajon Meinl dengan snare wires internal, body birch, dan soundhole belakang. Portabel dan bersuara kuat.',
                'price'       => 1350000,
                'stock_qty'   => 20,
                'sku'         => 'DRM-MEINLCAJ',
                'image_url'   => '/images/products/Meinl Cajon Box Drum.jpg',
                'active'      => true,
                'updated_at'  => now(),
            ],
            [
                'category_id' => 3,
                'name'        => 'Roland TD-17KVX Electronic Drum Kit',
                'description' => 'Drum elektrik Roland TD-17KVX dengan modul TD-17 dan mesh head. Ideal untuk latihan senyap.',
                'price'       => 22000000,
                'stock_qty'   => 2,
                'sku'         => 'DRM-ROLTD17',
                'image_url'   => '/images/products/Roland TD-17KVX Electronic Drum Kit.png',
                'active'      => true,
                'updated_at'  => now(),
            ],

            // === KEYBOARD & PIANO (category_id=4) ===
            [
                'category_id' => 4,
                'name'        => 'Yamaha P-45 Digital Piano',
                'description' => 'Digital piano 88 tuts weighted Yamaha P-45 dengan Pure CF Sound Engine. Ringan dan portabel.',
                'price'       => 5200000,
                'stock_qty'   => 7,
                'sku'         => 'KBD-YAMP45',
                'image_url'   => '/images/products/Yamaha P-45 Digital Piano.jpg',
                'active'      => true,
                'updated_at'  => now(),
            ],
            [
                'category_id' => 4,
                'name'        => 'Roland JUNO-DS61 Synthesizer',
                'description' => 'Synthesizer Roland JUNO-DS61 dengan 61 tuts and 128-voice polyphony. Cocok untuk stage performance.',
                'price'       => 11500000,
                'stock_qty'   => 4,
                'sku'         => 'KBD-ROLJUNO61',
                'image_url'   => '/images/products/Roland JUNO-DS61 Synthesizer.webp',
                'active'      => true,
                'updated_at'  => now(),
            ],

            // === ALAT MUSIK TIUP (category_id=5) ===
            [
                'category_id' => 5,
                'name'        => 'Yamaha YAS-280 Alto Saxophone',
                'description' => 'Alto saxophone Yamaha YAS-280 untuk pemula dengan pad kualitas tinggi dan tuning akurat.',
                'price'       => 13500000,
                'stock_qty'   => 5,
                'sku'         => 'TUP-YAMYAS280',
                'image_url'   => '/images/products/Yamaha YAS-280 Alto Saxophone.jpg',
                'active'      => true,
                'updated_at'  => now(),
            ],
            [
                'category_id' => 5,
                'name'        => 'Jupiter JTR700 Bb Trumpet',
                'description' => 'Trumpet Bb Jupiter JTR700 dengan bell kuningan dan lacquer finish emas. Cocok untuk pelajar.',
                'price'       => 4800000,
                'stock_qty'   => 8,
                'sku'         => 'TUP-JUPJTR700',
                'image_url'   => '/images/products/Jupiter JTR700 Bb Trumpet.webp',
                'active'      => true,
                'updated_at'  => now(),
            ],

            // === AKSESORIS (category_id=6) ===
            [
                'category_id' => 6,
                'name'        => 'Ernie Ball Regular Slinky Guitar Strings',
                'description' => 'Senar gitar elektrik Ernie Ball Regular Slinky gauge 10-46. Set 6 senar nickel wound.',
                'price'       => 95000,
                'stock_qty'   => 100,
                'sku'         => 'AKS-ERBSLINKY',
                'image_url'   => '/images/products/Ernie Ball Regular Slinky Guitar Strings.webp',
                'active'      => true,
                'updated_at'  => now(),
            ],
            [
                'category_id' => 6,
                'name'        => 'Dunlop Tortex Guitar Pick (Assorted)',
                'description' => 'Pick gitar Dunlop Tortex paket isi 12 pcs. Tersedia berbagai ketebalan (0.5mm - 1.14mm).',
                'price'       => 75000,
                'stock_qty'   => 150,
                'sku'         => 'AKS-DUNLPICK12',
                'image_url'   => '/images/products/Dunlop Tortex Guitar Pick (Assorted).webp',
                'active'      => true,
                'updated_at'  => now(),
            ],
            [
                'category_id' => 6,
                'name'        => 'KORG CA-50 Chromatic Tuner',
                'description' => 'Tuner kromatik KORG CA-50 untuk semua jenis instrumen. LCD display lebar dan akurasi tinggi.',
                'price'       => 180000,
                'stock_qty'   => 50,
                'sku'         => 'AKS-KORGCA50',
                'image_url'   => '/images/products/KORG CA-50 Chromatic Tuner.webp',
                'active'      => true,
                'updated_at'  => now(),
            ],

            // === STUDIO & RECORDING (category_id=7) ===
            [
                'category_id' => 7,
                'name'        => 'Focusrite Scarlett Solo 3rd Gen Audio Interface',
                'description' => 'Audio interface USB Focusrite Scarlett Solo Gen 3 dengan 1 mic preamp dan 1 instrument input.',
                'price'       => 1650000,
                'stock_qty'   => 20,
                'sku'         => 'STD-FOCSSOLO3',
                'image_url'   => '/images/products/Focusrite Scarlett Solo 3rd Gen Audio Interface.jpg',
                'active'      => true,
                'updated_at'  => now(),
            ],
            [
                'category_id' => 7,
                'name'        => 'Shure SM58 Dynamic Vocal Microphone',
                'description' => 'Microphone dinamik Shure SM58 standar industri untuk vokal live dan rekaman. Kardioid, -54.5 dBV/Pa.',
                'price'       => 1450000,
                'stock_qty'   => 25,
                'sku'         => 'STD-SHURESM58',
                'image_url'   => '/images/products/Shure SM58 Dynamic Vocal Microphone.webp',
                'active'      => true,
                'updated_at'  => now(),
            ],
        ];

        foreach ($products as $prod) {
            Product::create($prod);
        }
    }
}
