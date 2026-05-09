<?php

namespace Database\Seeders;

use App\Models\Cart;
use App\Models\CartItem;
use App\Models\Order;
use App\Models\OrderItem;
use App\Models\OrderStatusHistory;
use App\Models\Payment;
use App\Models\Refund;
use App\Models\Review;
use App\Models\Shipment;
use App\Models\StockMovement;
use Illuminate\Database\Seeder;

class OrderSeeder extends Seeder
{
    public function run(): void
    {
        // ======================================================
        // ORDER 1: Budi (user_id=2) - Status: delivered, dengan promo
        // ======================================================
        $order1 = Order::create([
            'user_id'          => 2,
            'address_id'       => 1,
            'promo_id'         => 1, // WELCOME10
            'subtotal_amount'  => 1250000,
            'discount_amount'  => 125000,
            'shipping_cost'    => 45000,
            'final_amount'     => 1170000,
            'shipping_address' => 'Jl. Merdeka No. 12, RT 03/RW 05, Jakarta Selatan 12550',
            'courier_code'     => 'jne',
            'status'           => 'delivered',
            'notes'            => null,
            'created_at'       => now()->subDays(30),
            'updated_at'       => now()->subDays(25),
        ]);

        OrderItem::create([
            'order_id'     => $order1->order_id,
            'product_id'   => 1, // Yamaha F310
            'product_name' => 'Yamaha F310 Acoustic Guitar',
            'quantity'     => 1,
            'price_each'   => 1250000,
        ]);

        // Stock movement untuk order 1
        StockMovement::create([
            'product_id'    => 1,
            'created_by'    => 1, // admin
            'order_id'      => $order1->order_id,
            'movement_type' => 'out',
            'quantity'      => -1,
            'notes'         => 'Penjualan Order #' . $order1->order_id,
            'created_at'    => now()->subDays(30),
        ]);

        // Status history order 1
        $order1Statuses = [
            ['old' => null,          'new' => 'pending',    'days' => 30],
            ['old' => 'pending',     'new' => 'processing', 'days' => 29],
            ['old' => 'processing',  'new' => 'shipped',    'days' => 28],
            ['old' => 'shipped',     'new' => 'delivered',  'days' => 25],
        ];
        foreach ($order1Statuses as $s) {
            OrderStatusHistory::create([
                'order_id'   => $order1->order_id,
                'changed_by' => $s['new'] === 'pending' ? 2 : 1,
                'old_status' => $s['old'],
                'new_status' => $s['new'],
                'note'       => 'Status diperbarui ke ' . $s['new'],
                'changed_at' => now()->subDays($s['days']),
            ]);
        }

        // Payment order 1
        Payment::create([
            'order_id'       => $order1->order_id,
            'external_id'    => 'INV-ORD' . $order1->order_id . '-' . time(),
            'gateway_ref'    => 'MIDTRANS-PAY-001',
            'payment_url'    => null,
            'payment_method' => 'gopay',
            'gateway_status' => 'settlement',
            'payment_status' => 'paid',
            'amount'         => 1170000,
            'paid_amount'    => 1170000,
            'gateway_fee'    => 3510,
            'webhook_payload'=> '{"transaction_status":"settlement"}',
            'expired_at'     => now()->subDays(29)->addHours(24),
            'paid_at'        => now()->subDays(29),
            'created_at'     => now()->subDays(30),
        ]);

        // Shipment order 1
        Shipment::create([
            'order_id'        => $order1->order_id,
            'tracking_number' => 'JNE1234567890',
            'delivered_at'    => now()->subDays(25),
            'status'          => 'delivered',
            'notes'           => 'Paket diterima oleh penerima langsung.',
        ]);

        // Review order 1 (item 1)
        Review::create([
            'order_item_id' => 1,
            'product_id'    => 1,
            'rating'        => 5,
            'comment'       => 'Gitar sangat bagus! Suara jernih dan action string rendah. Cocok untuk pemula.',
            'created_at'    => now()->subDays(20),
            'updated_at'    => now()->subDays(20),
        ]);

        // ======================================================
        // ORDER 2: Sari (user_id=3) - Status: shipped
        // ======================================================
        $order2 = Order::create([
            'user_id'          => 3,
            'address_id'       => 3, // kantor
            'promo_id'         => null,
            'subtotal_amount'  => 9690000, // Meinl Cajon + Pearl Export EXX
            'discount_amount'  => 0,
            'shipping_cost'    => 90000,
            'final_amount'     => 9780000,
            'shipping_address' => 'Jl. Asia Afrika No. 8, Lt. 3, Bandung 40112',
            'courier_code'     => 'sicepat',
            'status'           => 'shipped',
            'notes'            => 'Tolong bubble wrap double ya, barang mudah pecah.',
            'created_at'       => now()->subDays(5),
            'updated_at'       => now()->subDays(3),
        ]);

        OrderItem::create([
            'order_id'     => $order2->order_id,
            'product_id'   => 7, // Pearl Export EXX
            'product_name' => 'Pearl Export EXX 5-Piece Drum Set',
            'quantity'     => 1,
            'price_each'   => 9500000,
        ]);
        OrderItem::create([
            'order_id'     => $order2->order_id,
            'product_id'   => 8, // Meinl Cajon
            'product_name' => 'Meinl Cajon Box Drum',
            'quantity'     => 1,  // salah input, seharusnya 1 tapi ini demo
            'price_each'   => 1350000,
        ]);

        // Stock movements order 2
        foreach ([7 => -1, 8 => -1] as $prodId => $qty) {
            StockMovement::create([
                'product_id'    => $prodId,
                'created_by'    => 1,
                'order_id'      => $order2->order_id,
                'movement_type' => 'out',
                'quantity'      => $qty,
                'notes'         => 'Penjualan Order #' . $order2->order_id,
                'created_at'    => now()->subDays(5),
            ]);
        }

        // Status history order 2
        $order2Statuses = [
            ['old' => null,         'new' => 'pending',    'days' => 5],
            ['old' => 'pending',    'new' => 'processing', 'days' => 4],
            ['old' => 'processing', 'new' => 'shipped',    'days' => 3],
        ];
        foreach ($order2Statuses as $s) {
            OrderStatusHistory::create([
                'order_id'   => $order2->order_id,
                'changed_by' => $s['new'] === 'pending' ? 3 : 1,
                'old_status' => $s['old'],
                'new_status' => $s['new'],
                'note'       => 'Status diperbarui ke ' . $s['new'],
                'changed_at' => now()->subDays($s['days']),
            ]);
        }

        // Payment order 2
        Payment::create([
            'order_id'       => $order2->order_id,
            'external_id'    => 'INV-ORD' . $order2->order_id . '-' . (time() + 1),
            'gateway_ref'    => 'MIDTRANS-PAY-002',
            'payment_url'    => null,
            'payment_method' => 'bank_transfer',
            'gateway_status' => 'settlement',
            'payment_status' => 'paid',
            'amount'         => 9780000,
            'paid_amount'    => 9780000,
            'gateway_fee'    => 5000,
            'webhook_payload'=> '{"transaction_status":"settlement"}',
            'expired_at'     => now()->subDays(4)->addHours(24),
            'paid_at'        => now()->subDays(4),
            'created_at'     => now()->subDays(5),
        ]);

        // Shipment order 2
        Shipment::create([
            'order_id'        => $order2->order_id,
            'tracking_number' => 'SCP9876543210',
            'delivered_at'    => null,
            'status'          => 'in_transit',
            'notes'           => 'Dalam perjalanan ke alamat tujuan.',
        ]);

        // ======================================================
        // ORDER 3: Ahmad (user_id=4) - Status: pending payment
        // ======================================================
        $order3 = Order::create([
            'user_id'          => 4,
            'address_id'       => 4,
            'promo_id'         => 2, // MUSIK50K
            'subtotal_amount'  => 1725000, // Senar + Pick + Tuner
            'discount_amount'  => 50000,
            'shipping_cost'    => 25000,
            'final_amount'     => 1700000,
            'shipping_address' => 'Perum. Griya Asri Blok C No. 7, Surabaya 60231',
            'courier_code'     => 'jnt',
            'status'           => 'pending',
            'notes'            => null,
            'created_at'       => now()->subHours(3),
            'updated_at'       => now()->subHours(3),
        ]);

        OrderItem::create([
            'order_id'     => $order3->order_id,
            'product_id'   => 14, // Ernie Ball
            'product_name' => 'Ernie Ball Regular Slinky Guitar Strings',
            'quantity'     => 3,
            'price_each'   => 95000,
        ]);
        OrderItem::create([
            'order_id'     => $order3->order_id,
            'product_id'   => 15, // Dunlop Pick
            'product_name' => 'Dunlop Tortex Guitar Pick (Assorted)',
            'quantity'     => 2,
            'price_each'   => 75000,
        ]);
        OrderItem::create([
            'order_id'     => $order3->order_id,
            'product_id'   => 16, // KORG Tuner
            'product_name' => 'KORG CA-50 Chromatic Tuner',
            'quantity'     => 1,
            'price_each'   => 180000,
        ]);

        // Status history order 3
        OrderStatusHistory::create([
            'order_id'   => $order3->order_id,
            'changed_by' => 4,
            'old_status' => null,
            'new_status' => 'pending',
            'note'       => 'Order dibuat, menunggu pembayaran.',
            'changed_at' => now()->subHours(3),
        ]);

        // Payment order 3 (pending)
        Payment::create([
            'order_id'       => $order3->order_id,
            'external_id'    => 'INV-ORD' . $order3->order_id . '-' . (time() + 2),
            'gateway_ref'    => null,
            'payment_url'    => 'https://app.sandbox.midtrans.com/snap/v4/redirection/dummy-token',
            'payment_method' => null,
            'gateway_status' => 'pending',
            'payment_status' => 'pending',
            'amount'         => 1700000,
            'paid_amount'    => null,
            'gateway_fee'    => null,
            'webhook_payload'=> null,
            'expired_at'     => now()->addHours(21),
            'paid_at'        => null,
            'created_at'     => now()->subHours(3),
        ]);

        // ======================================================
        // ORDER 4: Linda (user_id=5) - Status: cancelled + refund
        // ======================================================
        $order4 = Order::create([
            'user_id'          => 5,
            'address_id'       => 5,
            'promo_id'         => null,
            'subtotal_amount'  => 25000000, // Gibson Les Paul
            'discount_amount'  => 0,
            'shipping_cost'    => 150000,
            'final_amount'     => 25150000,
            'shipping_address' => 'Apartemen Green View Tower A Lt. 12 No. 1205, Yogyakarta 55223',
            'courier_code'     => 'tiki',
            'status'           => 'cancelled',
            'notes'            => 'Mohon dikonfirmasi ketersediaan stok.',
            'created_at'       => now()->subDays(15),
            'updated_at'       => now()->subDays(14),
        ]);

        $orderItem4 = OrderItem::create([
            'order_id'     => $order4->order_id,
            'product_id'   => 3, // Gibson Les Paul
            'product_name' => 'Gibson Les Paul Standard Electric Guitar',
            'quantity'     => 1,
            'price_each'   => 25000000,
        ]);

        // Status history order 4
        $order4Statuses = [
            ['old' => null,      'new' => 'pending',   'days' => 15, 'by' => 5],
            ['old' => 'pending', 'new' => 'cancelled', 'days' => 14, 'by' => 1],
        ];
        foreach ($order4Statuses as $s) {
            OrderStatusHistory::create([
                'order_id'   => $order4->order_id,
                'changed_by' => $s['by'],
                'old_status' => $s['old'],
                'new_status' => $s['new'],
                'note'       => $s['new'] === 'cancelled' ? 'Dibatalkan karena stok tidak tersedia.' : 'Order dibuat.',
                'changed_at' => now()->subDays($s['days']),
            ]);
        }

        // Payment order 4 (failed/cancelled)
        Payment::create([
            'order_id'       => $order4->order_id,
            'external_id'    => 'INV-ORD' . $order4->order_id . '-' . (time() + 3),
            'gateway_ref'    => null,
            'payment_url'    => null,
            'payment_method' => null,
            'gateway_status' => 'cancel',
            'payment_status' => 'failed',
            'amount'         => 25150000,
            'paid_amount'    => null,
            'gateway_fee'    => null,
            'webhook_payload'=> null,
            'expired_at'     => now()->subDays(14),
            'paid_at'        => null,
            'created_at'     => now()->subDays(15),
        ]);

        // Refund order 4
        Refund::create([
            'order_id'         => $order4->order_id,
            'order_item_id'    => $orderItem4->order_item_id,
            'reason'           => 'Order dibatalkan karena stok tidak tersedia saat konfirmasi pembayaran.',
            'status'           => 'approved',
            'rejection_reason' => null,
            'evidence_urls'    => null,
            'created_at'       => now()->subDays(14),
            'updated_at'       => now()->subDays(13),
        ]);

        // ======================================================
        // STOCK IN (Restocking) - dilakukan admin
        // ======================================================
        $restockItems = [
            ['product_id' => 1, 'qty' => 10, 'note' => 'Restock Yamaha F310 dari supplier'],
            ['product_id' => 7, 'qty' => 5,  'note' => 'Restock Pearl Export EXX dari distributor'],
            ['product_id' => 9, 'qty' => 2,  'note' => 'Stok awal Roland TD-17'],
        ];
        foreach ($restockItems as $r) {
            StockMovement::create([
                'product_id'    => $r['product_id'],
                'created_by'    => 1, // admin
                'order_id'      => null,
                'movement_type' => 'in',
                'quantity'      => $r['qty'],
                'notes'         => $r['note'],
                'created_at'    => now()->subDays(45),
            ]);
        }

        // ======================================================
        // CART AKTIF: Rizky (user_id=6) sedang belanja
        // ======================================================
        $cart = Cart::create([
            'user_id'    => 6,
            'promo_id'   => 1, // WELCOME10
            'status'     => 'active',
            'expires_at' => now()->addHours(6),
            'created_at' => now()->subHours(1),
        ]);

        CartItem::create([
            'cart_id'    => $cart->cart_id,
            'product_id' => 10, // Yamaha P-45
            'quantity'   => 1,
            'price_each' => 5200000,
        ]);
        CartItem::create([
            'cart_id'    => $cart->cart_id,
            'product_id' => 17, // Focusrite Scarlett
            'quantity'   => 1,
            'price_each' => 1650000,
        ]);
    }
}
