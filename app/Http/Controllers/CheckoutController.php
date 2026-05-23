<?php

namespace App\Http\Controllers;

use App\Models\Cart;
use App\Models\Promo;
use App\Models\UserAddress;
use App\Services\OrderService;
use Illuminate\Http\Request;
use Inertia\Inertia;

class CheckoutController extends Controller
{
    protected OrderService $orderService;

    public function __construct(OrderService $orderService)
    {
        $this->orderService = $orderService;
    }

    /**
     * Tampilkan halaman Checkout.
     */
    public function index()
    {
        $user = auth()->user();
        $userId = $user->user_id ?? $user->id;

        // Ambil keranjang aktif beserta item & produknya
        $cart = Cart::where('user_id', $userId)
            ->where('status', 'active')
            ->with(['items.product.category', 'promo'])
            ->first();

        if (!$cart || $cart->items->isEmpty()) {
            return redirect()->route('cart.index')->with('error', 'Keranjang belanja Anda kosong.');
        }

        // Ambil daftar alamat milik user
        $addresses = UserAddress::where('user_id', $userId)->get();

        // Ambil daftar promo yang aktif
        $promos = Promo::where('active', true)
            ->where(function($q) {
                $q->whereNull('end_date')
                  ->orWhere('end_date', '>=', now());
            })
            ->get();

        // Format data cart items
        $cartItems = $cart->items->map(function ($item) {
            return [
                'cart_item_id' => $item->cart_item_id,
                'product_id'   => $item->product_id,
                'quantity'     => $item->quantity,
                'price_each'   => (float) $item->price_each,
                'product'      => $item->product ? [
                    'product_id' => $item->product->product_id,
                    'name'       => $item->product->name,
                    'price'      => (float) $item->product->price,
                    'image_url'  => $item->product->image_url,
                ] : null,
            ];
        });

        // List Kurir simulasi
        $couriers = [
            ['code' => 'JNE', 'name' => 'JNE Express (Reguler)', 'cost' => 20000],
            ['code' => 'POS', 'name' => 'POS Indonesia (Kilat)', 'cost' => 15000],
            ['code' => 'TIKI', 'name' => 'TIKI (Overnight Service)', 'cost' => 18000],
        ];

        return Inertia::render('Checkout', [
            'cartItems' => $cartItems,
            'cart'      => [
                'cart_id'  => $cart->cart_id,
                'promo_id' => $cart->promo_id,
                'promo'    => $cart->promo,
            ],
            'addresses' => $addresses,
            'promos'    => $promos,
            'couriers'  => $couriers,
        ]);
    }

    /**
     * Proses pembuatan Order (Place Order).
     */
    public function store(Request $request)
    {
        $request->validate([
            'address_id'    => 'required|exists:user_addresses,address_id',
            'courier_code'  => 'required|string',
            'shipping_cost' => 'required|numeric|min:0',
            'notes'         => 'nullable|string',
            'promo_id'      => 'nullable|exists:promos,promo_id',
        ]);

        $user = auth()->user();
        $userId = $user->user_id ?? $user->id;

        // Ambil keranjang aktif
        $cart = Cart::where('user_id', $userId)
            ->where('status', 'active')
            ->firstOrFail();

        // Update promo_id di keranjang jika ada pilihan promo baru dari halaman checkout
        if ($request->has('promo_id')) {
            $cart->update(['promo_id' => $request->promo_id]);
        }

        try {
            $orderData = [
                'user_id'       => $userId,
                'address_id'    => $request->address_id,
                'promo_id'      => $request->promo_id,
                'shipping_cost' => (float) $request->shipping_cost,
                'courier_code'  => $request->courier_code,
                'notes'         => $request->notes,
            ];

            // Panggil service untuk membuat order dengan DB Transaction & lock stok
            $order = $this->orderService->createOrder($orderData, $cart->cart_id);

            // Muat relasi payment
            $order->load('payment');

            // Redirect Inertia ke Halaman Pembayaran/Invoice
            if ($order->payment && $order->payment->payment_url) {
                return Inertia::location($order->payment->payment_url);
            }

            return redirect()->route('orders.show', $order->order_id)
                ->with('success', 'Pesanan berhasil dibuat!');

        } catch (\Exception $e) {
            return back()->withErrors(['error' => $e->getMessage()]);
        }
    }
}
