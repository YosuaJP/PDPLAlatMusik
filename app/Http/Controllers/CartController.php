<?php

namespace App\Http\Controllers;

use App\Models\Cart;
use App\Models\CartItem;
use App\Models\Product;
use Illuminate\Http\Request;
use Inertia\Inertia;

class CartController extends Controller
{
    // Helper: get or create active cart for the authenticated user
    private function getOrCreateCart()
    {
        $user = auth()->user();

        $cart = Cart::where('user_id', $user->user_id ?? $user->id)
            ->where('status', 'active')
            ->first();

        if (!$cart) {
            $cart = Cart::create([
                'user_id'    => $user->user_id ?? $user->id,
                'promo_id'   => null,
                'status'     => 'active',
                'created_at' => now(),
            ]);
        }

        return $cart;
    }

    // GET /cart — render cart page
    public function index()
    {
        $user  = auth()->user();
        $userId = $user->user_id ?? $user->id;

        $cart = Cart::where('user_id', $userId)
            ->where('status', 'active')
            ->with(['items.product.category'])
            ->first();

        $cartItems  = $cart ? $cart->items->map(function ($item) {
            return [
                'cart_item_id' => $item->cart_item_id,
                'product_id'   => $item->product_id,
                'quantity'     => $item->quantity,
                'price_each'   => (float) $item->price_each,
                'product'      => $item->product ? [
                    'product_id'    => $item->product->product_id,
                    'name'          => $item->product->name,
                    'price'         => (float) $item->product->price,
                    'stock_qty'     => $item->product->stock_qty,
                    'image_url'     => $item->product->image_url,
                    'category_name' => $item->product->category->category_name ?? 'Umum',
                ] : null,
            ];
        }) : collect();

        // Recommended products (random 4 active products not already in cart)
        $inCartIds = $cartItems->pluck('product_id')->toArray();
        $recommended = Product::with('category')
            ->where('active', true)
            ->whereNotIn('product_id', $inCartIds)
            ->inRandomOrder()
            ->limit(4)
            ->get()
            ->map(fn($p) => [
                'product_id'    => $p->product_id,
                'name'          => $p->name,
                'price'         => (float) $p->price,
                'image_url'     => $p->image_url,
                'category_name' => $p->category->category_name ?? 'Umum',
            ]);

        return Inertia::render('Cart', [
            'cartItems'   => $cartItems,
            'recommended' => $recommended,
            'cartId'      => $cart?->cart_id,
        ]);
    }

    // POST /cart/add — add item to cart
    public function add(Request $request)
    {
        $request->validate([
            'product_id' => 'required|exists:products,product_id',
            'quantity'   => 'integer|min:1',
        ]);

        $cart    = $this->getOrCreateCart();
        $product = Product::findOrFail($request->product_id);
        $qty     = $request->quantity ?? 1;

        $existing = CartItem::where('cart_id', $cart->cart_id)
            ->where('product_id', $product->product_id)
            ->first();

        if ($existing) {
            $existing->update(['quantity' => $existing->quantity + $qty]);
        } else {
            CartItem::create([
                'cart_id'    => $cart->cart_id,
                'product_id' => $product->product_id,
                'quantity'   => $qty,
                'price_each' => $product->price,
            ]);
        }

        return back()->with('success', 'Produk ditambahkan ke keranjang.');
    }

    // PATCH /cart/update/{cartItemId} — change quantity
    public function update(Request $request, $cartItemId)
    {
        $request->validate(['quantity' => 'required|integer|min:1']);

        $item = CartItem::findOrFail($cartItemId);
        $item->update(['quantity' => $request->quantity]);

        return back();
    }

    // DELETE /cart/remove/{cartItemId} — remove item
    public function remove($cartItemId)
    {
        CartItem::findOrFail($cartItemId)->delete();
        return back()->with('success', 'Item dihapus dari keranjang.');
    }

    // Helper for navbar cart count (shared via Inertia HandleInertiaRequests)
    public static function getCartCount()
    {
        if (!auth()->check()) return 0;

        $user   = auth()->user();
        $userId = $user->user_id ?? $user->id;

        $cart = Cart::where('user_id', $userId)
            ->where('status', 'active')
            ->first();

        if (!$cart) return 0;

        return CartItem::where('cart_id', $cart->cart_id)->sum('quantity');
    }
}
