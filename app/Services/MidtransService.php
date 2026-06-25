<?php

namespace App\Services;

use App\Contracts\PaymentGatewayInterface;
use App\Models\Order;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class MidtransService implements PaymentGatewayInterface
{
    /**
     * Pembuatan invoice/pembayaran di Midtrans (Sandbox API).
     *
     * @param Order $order
     * @return array
     */
    public function createPayment(Order $order): array
    {
        // Pastikan relasi penting termuat
        $order->loadMissing(['user', 'items.product']);

        $serverKey = config('services.midtrans.server_key');
        $isProduction = config('services.midtrans.is_production', false);
        
        $baseUrl = $isProduction 
            ? 'https://app.midtrans.com/snap/v1' 
            : 'https://app.sandbox.midtrans.com/snap/v1';

        $externalId = 'INV-MID-' . $order->order_id . '-' . Str::upper(Str::random(6));

        // Jika API key belum dikonfigurasi, gunakan mode simulasi (dummy data)
        if (empty($serverKey)) {
            Log::warning("Midtrans Server Key kosong. Menggunakan mode simulasi offline untuk pesanan #{$order->order_id}.");
            return [
                'external_id'    => $externalId,
                'payment_url'    => route('payment.simulate', $externalId), // Arahkan langsung ke simulator
                'gateway_ref'    => 'midtrans_fallback_' . Str::random(10),
                'payment_status' => 'pending',
                'amount'         => (float) $order->final_amount,
                'error'          => 'Server Key belum diatur. Menggunakan mode simulasi offline.',
            ];
        }

        // Susun item_details dari item pesanan
        $itemDetails = [];
        foreach ($order->items as $item) {
            $itemDetails[] = [
                'id'       => (string) $item->product_id,
                'price'    => (float) $item->price_each,
                'quantity' => (int) $item->quantity,
                'name'     => Str::limit($item->product_name, 50, ''),
            ];
        }

        // Tambahkan ongkos kirim jika ada
        if ($order->shipping_cost > 0) {
            $itemDetails[] = [
                'id'       => 'SHIPPING_COST',
                'price'    => (float) $order->shipping_cost,
                'quantity' => 1,
                'name'     => 'Ongkos Kirim (' . ($order->courier_code ?? 'Ekspedisi') . ')',
            ];
        }

        // Tambahkan potongan diskon jika ada
        if ($order->discount_amount > 0) {
            $itemDetails[] = [
                'id'       => 'PROMO_DISCOUNT',
                'price'    => -(float) $order->discount_amount,
                'quantity' => 1,
                'name'     => 'Potongan Diskon Promo',
            ];
        }

        $payload = [
            'transaction_details' => [
                'order_id'     => $externalId,
                'gross_amount' => (float) $order->final_amount,
            ],
            'item_details' => $itemDetails,
            'customer_details' => [
                'first_name' => $order->user->name ?? 'Pelanggan',
                'email'      => $order->user->email ?? 'pelanggan@example.com',
                'phone'      => $order->user->phone_number ?? '081234567890',
            ],
            'callbacks' => [
                'finish'   => route('orders.show', $order->order_id),
                'unfinish' => route('orders.show', $order->order_id),
                'error'    => route('orders.show', $order->order_id),
            ]
        ];

        try {
            $response = Http::withBasicAuth($serverKey, '')
                ->withHeaders([
                    'Accept'       => 'application/json',
                    'Content-Type' => 'application/json',
                ])
                ->post($baseUrl . '/transactions', $payload);

            if ($response->failed()) {
                Log::error("Panggilan API Midtrans gagal untuk Order #{$order->order_id}: " . $response->body());
                throw new \Exception('Gagal mendapatkan token pembayaran dari Midtrans: ' . ($response->json('error_messages')[0] ?? 'Unauthorized/Invalid Server Key.'));
            }

            $responseData = $response->json();

            return [
                'external_id'    => $externalId,
                'payment_url'    => $responseData['redirect_url'], // URL pembayaran resmi Midtrans
                'gateway_ref'    => $responseData['token'],        // Snap Token
                'payment_status' => 'pending',
                'amount'         => (float) $order->final_amount,
            ];

        } catch (\Exception $e) {
            Log::error("Eksepsi terjadi saat memanggil API Midtrans untuk Order #{$order->order_id}: " . $e->getMessage());
            throw $e;
        }
    }

    /**
     * Mendapatkan nama gerbang pembayaran.
     *
     * @return string
     */
    public function getGatewayName(): string
    {
        return 'midtrans';
    }
}
