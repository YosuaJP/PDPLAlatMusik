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
    public function index(Request $request)
    {
        $user = auth()->user();
        $userId = $user->user_id ?? $user->id;

        $cartId = $request->query('cart_id');

        if ($cartId) {
            $cart = Cart::where('user_id', $userId)
                ->where('cart_id', $cartId)
                ->with(['items.product.category', 'promo'])
                ->first();
        } else {
            $cart = Cart::where('user_id', $userId)
                ->where('status', 'active')
                ->with(['items.product.category', 'promo'])
                ->first();
        }

        if (!$cart || $cart->items->isEmpty()) {
            return redirect()->route('cart.index')->with('error', 'Keranjang belanja Anda kosong.');
        }

        // Ambil daftar alamat milik user
        $addresses = UserAddress::where('user_id', $userId)->get();

        // Ambil subtotal untuk filter promo
        $subtotal = $cart->items->sum(fn($i) => $i->price_each * $i->quantity);

        // Ambil cartItems dengan semua field yang dibutuhkan tampilan checkout
        $cartItems = $cart->items->map(fn($item) => [
            'cart_item_id' => $item->cart_item_id,
            'product_id'   => $item->product_id,
            'category_id'  => $item->product?->category_id,
            'quantity'     => $item->quantity,
            'price_each'   => (float) $item->price_each,
            'product'      => $item->product ? [
                'product_id' => $item->product->product_id,
                'name'       => $item->product->name,
                'price'      => (float) $item->product->price,
                'image_url'  => $item->product->image_url,
            ] : null,
        ]);

        // Ambil daftar promo yang aktif & belum expired
        $allPromos = Promo::where('active', true)
            ->where(function ($q) {
                $q->whereNull('end_date')
                    ->orWhere('end_date', '>=', now());
            })
            ->get();

        // Filter di PHP berdasarkan applicable subtotal
        $promos = $allPromos->filter(function ($p) use ($cartItems, $subtotal) {
            $applicableSubtotal = $subtotal;
            $scope = $p->scope ?? 'global';

            if ($scope === 'category' && !empty($p->scope_category_ids)) {
                $applicableSubtotal = $cartItems
                    ->filter(fn($i) => in_array($i['category_id'], $p->scope_category_ids))
                    ->sum(fn($i) => $i['price_each'] * $i['quantity']);
            } elseif ($scope === 'category') {
                $applicableSubtotal = 0; // Invalid category scope fallback
            } elseif ($scope === 'product' && !empty($p->scope_product_ids)) {
                $applicableSubtotal = $cartItems
                    ->filter(fn($i) => in_array($i['product_id'], $p->scope_product_ids))
                    ->sum(fn($i) => $i['price_each'] * $i['quantity']);
            } elseif ($scope === 'product') {
                $applicableSubtotal = 0; // Invalid product scope fallback
            }

            return $p->min_purchase <= 0 || $applicableSubtotal >= $p->min_purchase;
        })->map(fn($p) => [
            'promo_id'           => $p->promo_id,
            'promo_code'         => $p->promo_code,
            'promo_name'         => $p->promo_name,
            'promo_type'         => $p->promo_type,
            'discount_value'     => (float) $p->discount_value,
            'max_discount_amount' => (float) $p->max_discount_amount,
            'min_purchase'       => (float) $p->min_purchase,
            'scope'              => $p->scope ?? 'global',
            'scope_category_ids' => $p->scope_category_ids,
            'scope_product_ids'  => $p->scope_product_ids,
        ])->values();

        // List Kurir simulasi
        $couriers = [
            ['code' => 'JNE', 'name' => 'JNE Express (Reguler)', 'cost' => 20000],
            ['code' => 'POS', 'name' => 'POS Indonesia (Kilat)', 'cost' => 15000],
            ['code' => 'TIKI', 'name' => 'TIKI (Overnight Service)', 'cost' => 18000],
        ];

        return Inertia::render('Checkout', [
            'cartItems' => $cartItems,
            'cart' => [
                'cart_id' => $cart->cart_id,
                'promo_id' => $cart->promo_id,
                'promo' => $cart->promo,
            ],
            'addresses' => $addresses,
            'promos' => $promos,
            'couriers' => $couriers,
        ]);
    }

    /**
     * Proses pembuatan Order (Place Order).
     */
    public function store(Request $request)
    {
        $request->validate([
            'address_id' => 'required|exists:user_addresses,address_id',
            'courier_code' => 'required|string',
            'shipping_cost' => 'required|numeric|min:0',
            'notes' => 'nullable|string',
            'promo_id' => 'nullable|exists:promos,promo_id',
            'cart_id' => 'nullable|exists:carts,cart_id',
        ]);

        $user = auth()->user();
        $userId = $user->user_id ?? $user->id;

        $cartId = $request->input('cart_id');

        if ($cartId) {
            $cart = Cart::where('user_id', $userId)
                ->where('cart_id', $cartId)
                ->firstOrFail();
        } else {
            $cart = Cart::where('user_id', $userId)
                ->where('status', 'active')
                ->firstOrFail();
        }

        // Update promo_id di keranjang jika ada pilihan promo baru dari halaman checkout
        if ($request->has('promo_id')) {
            $cart->update(['promo_id' => $request->promo_id]);
        }

        try {
            $orderData = [
                'user_id' => $userId,
                'address_id' => $request->address_id,
                'promo_id' => $request->promo_id,
                'shipping_cost' => (float) $request->shipping_cost,
                'courier_code' => $request->courier_code,
                'notes' => $request->notes,
            ];

            // Panggil service untuk membuat order dengan DB Transaction & lock stok
            $order = $this->orderService->createOrder($orderData, $cart->cart_id);

            // Muat relasi payment
            $order->load('payment');

            // Redirect ke halaman "Complete Your Payment" sebagai intermediate page
            if ($order->payment && $order->payment->external_id) {
                return redirect()->route('payment.checkout', $order->payment->external_id);
            }

            return redirect()->route('orders.show', $order->order_id)
                ->with('success', 'Pesanan berhasil dibuat!');

        } catch (\Exception $e) {
            return back()->withErrors(['error' => $e->getMessage()]);
        }
    }

    /**
     * Fitur Beli Langsung.
     */
    public function directBuy(Request $request)
    {
        $request->validate([
            'product_id' => 'required|exists:products,product_id',
            'quantity'   => 'required|integer|min:1',
        ]);

        $product = \App\Models\Product::findOrFail($request->product_id);

        if ($product->stock_qty < $request->quantity) {
            return back()->with('error', 'Stok produk tidak mencukupi untuk jumlah tersebut.');
        }

        $userId = auth()->id();

        // Buat cart khusus 'direct'
        $cart = Cart::create([
            'user_id' => $userId,
            'status'  => 'direct',
        ]);

        // Tambahkan item ke cart direct
        \App\Models\CartItem::create([
            'cart_id'    => $cart->cart_id,
            'product_id' => $product->product_id,
            'quantity'   => $request->quantity,
            'price_each' => $product->price,
        ]);

        // Redirect ke halaman checkout dengan membawa cart_id
        return redirect()->route('checkout.index', ['cart_id' => $cart->cart_id]);
    }
}
