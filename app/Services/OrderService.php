<?php

namespace App\Services;

use App\Contracts\PaymentGatewayInterface;
use App\Factories\OrderFactory;
use App\Models\Cart;
use App\Models\Order;
use App\Models\OrderStatusHistory;
use App\Models\Payment;
use App\Models\Product;
use App\Services\PromoService;
use App\Services\StockService;
use Illuminate\Support\Facades\DB;

class OrderService
{
    protected PaymentGatewayInterface $paymentGateway;
    protected PromoService $promoService;
    protected StockService $stockService;

    public function __construct(PaymentGatewayInterface $paymentGateway, PromoService $promoService, StockService $stockService)
    {
        $this->paymentGateway = $paymentGateway;
        $this->promoService = $promoService;
        $this->stockService = $stockService;
    }

    /**
     * Memproses checkout belanja dalam satu DB Transaction yang aman.
     *
     * @param array $data [
     *   'user_id'       => int,
     *   'address_id'    => int,
     *   'promo_id'      => ?int,
     *   'shipping_cost' => float,
     *   'courier_code'  => string,
     *   'notes'         => ?string,
     * ]
     * @param int $cartId
     * @return Order
     * @throws \Exception
     */
    public function createOrder(array $data, int $cartId): Order
    {
        return DB::transaction(function () use ($data, $cartId) {
            // 1. Ambil data keranjang beserta item-nya
            $cart = Cart::with(['items.product', 'promo'])->findOrFail($cartId);

            if ($cart->items->isEmpty()) {
                throw new \Exception("Keranjang belanja Anda kosong.");
            }

            // 2. Kunci baris data stok produk (SELECT FOR UPDATE) dan lakukan pengecekan stok
            foreach ($cart->items as $item) {
                // lockForUpdate() memicu SELECT ... FOR UPDATE pada database
                $product = Product::lockForUpdate()->findOrFail($item->product_id);

                if ($product->stock_qty < $item->quantity) {
                    throw new \Exception(
                        "Stok produk '{$product->name}' tidak mencukupi. " .
                        "Tersedia: {$product->stock_qty}, Diminta: {$item->quantity}."
                    );
                }
            }

            // 3. Buat pesanan & item pesanan menggunakan OrderFactory
            // Hitung discount menggunakan PromoService jika ada promo di cart
            if ($cart->promo) {
                $subtotal = $cart->items->sum(function ($item) {
                    return $item->price_each * $item->quantity;
                });
                
                // Validasi ulang promo di sisi backend untuk keamanan (expired, min purchase, dll)
                $this->promoService->validatePromo($cart->promo->promo_code, (float)$subtotal);
                
                // Gunakan PromoService untuk menghitung diskon
                $discountAmount = $this->promoService->applyDiscount($cart->promo, $subtotal);
                
                // Set data tambahan ke array data agar dibaca oleh OrderFactory
                $data['calculated_discount_amount'] = $discountAmount;
            }

            $order = OrderFactory::create($data, $cart);

            // 4. Potong stok produk dilakukan SETELAH pembayaran dikonfirmasi (bukan di sini)
            //    Di sini hanya validasi stok sudah dilakukan di atas (step 2)

            // 5. Integrasikan dengan Payment Gateway via interface
            $paymentData = $this->paymentGateway->createPayment($order);

            // 6. Buat record Payment di database
            Payment::create([
                'order_id'       => $order->order_id,
                'external_id'    => $paymentData['external_id'],
                'gateway_ref'    => $paymentData['gateway_ref'],
                'payment_url'    => $paymentData['payment_url'],
                'payment_method' => $this->paymentGateway->getGatewayName(),
                'gateway_status' => 'pending',
                'payment_status' => 'pending',
                'amount'         => $paymentData['amount'],
                'created_at'     => now(),
            ]);

            // 7. Catat riwayat status order awal ke tabel order_status_histories
            OrderStatusHistory::create([
                'order_id'   => $order->order_id,
                'changed_by' => $data['user_id'],
                'old_status' => null,
                'new_status' => 'pending',
                'note'       => 'Pesanan berhasil dibuat, menunggu pembayaran.',
                'changed_at' => now(),
            ]);

            // 8. Tandai keranjang belanja aktif sebagai checked_out
            $cart->update([
                'status' => 'checked_out',
            ]);

            return $order;
        });
    }
}
