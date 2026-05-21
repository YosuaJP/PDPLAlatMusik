<?php

namespace App\Factories;

use App\Models\Order;
use App\Models\OrderItem;
use App\Models\UserAddress;
use App\Models\Cart;

class OrderFactory
{
    /**
     * Membuat data Order dan OrderItem dari data checkout dan keranjang.
     *
     * @param array $data [
     *   'user_id'       => int,
     *   'address_id'    => int,
     *   'promo_id'      => ?int,
     *   'shipping_cost' => float,
     *   'courier_code'  => string,
     *   'notes'         => ?string,
     * ]
     * @param Cart $cart
     * @return Order
     */
    public static function create(array $data, Cart $cart): Order
    {
        // 1. Ambil detail alamat lengkap untuk dijadikan snapshot di kolom shipping_address
        $address = UserAddress::find($data['address_id']);
        $shippingAddressText = $address 
            ? "{$address->label}: {$address->address}, {$address->city}, {$address->postal_code}" 
            : 'Alamat tidak ditentukan';

        // 2. Hitung subtotal_amount berdasarkan item di keranjang
        $subtotal = 0;
        foreach ($cart->items as $item) {
            $subtotal += $item->quantity * $item->product->price;
        }

        // 3. Hitung diskon promo jika ada
        $discount = 0;
        if ($cart->promo) {
            // Misalkan promo memberikan diskon fixed atau persentase. Kita buat kalkulasi sederhana:
            if ($cart->promo->promo_type === 'percentage') {
                $discount = ($subtotal * $cart->promo->discount_value) / 100;
                // Pastikan diskon tidak melebihi batas max jika ada
                if ($cart->promo->max_discount_amount && $discount > $cart->promo->max_discount_amount) {
                    $discount = $cart->promo->max_discount_amount;
                }
            } else {
                $discount = $cart->promo->discount_value;
            }
        }

        $finalAmount = $subtotal - $discount + $data['shipping_cost'];
        if ($finalAmount < 0) {
            $finalAmount = 0;
        }

        // 4. Buat record Order baru
        $order = Order::create([
            'user_id'          => $data['user_id'],
            'address_id'       => $data['address_id'],
            'promo_id'         => $data['promo_id'] ?? ($cart->promo_id ?? null),
            'subtotal_amount'  => $subtotal,
            'discount_amount'  => $discount,
            'shipping_cost'    => $data['shipping_cost'],
            'final_amount'     => $finalAmount,
            'shipping_address' => $shippingAddressText,
            'courier_code'     => $data['courier_code'],
            'status'           => 'pending',
            'notes'            => $data['notes'] ?? null,
        ]);

        // 5. Buat record OrderItem dengan snapshot product_name dan price_each saat ini
        foreach ($cart->items as $item) {
            OrderItem::create([
                'order_id'     => $order->order_id,
                'product_id'   => $item->product_id,
                'product_name' => $item->product->name, // SNAPSHOT nama produk
                'quantity'     => $item->quantity,
                'price_each'   => (float) $item->product->price, // SNAPSHOT harga produk
            ]);
        }

        return $order;
    }
}
