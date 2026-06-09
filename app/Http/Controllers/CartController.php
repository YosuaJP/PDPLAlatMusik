<?php

namespace App\Http\Controllers;

use App\Models\Cart;
use App\Models\CartItem;
use App\Models\Product;
use App\Services\PromoService;
use Illuminate\Http\Request;
use Inertia\Inertia;

class CartController extends Controller
{
    protected PromoService $promoService;

    public function __construct(PromoService $promoService)
    {
        $this->promoService = $promoService;
    }

    protected function getCurrentUserId()
    {
        $user = auth()->user();
        return $user->user_id ?? $user->id;
    }

    public function index()
    {
        $userId = $this->getCurrentUserId();

        $cart = Cart::with(['items.product.category', 'promo'])
            ->where('user_id', $userId)
            ->where('status', 'active')
            ->first();

        $cartItems = $cart
            ? $cart->items->map(function ($item) {
                return [
                    'cart_item_id' => $item->cart_item_id,
                    'product_id'   => $item->product_id,
                    'quantity'     => $item->quantity,
                    'price_each'   => (float) $item->price_each,
                    'product'      => $item->product ? [
                        'product_id'    => $item->product->product_id,
                        'name'          => $item->product->name,
                        'category_name' => $item->product->category?->category_name,
                        'price'         => (float) $item->product->price,
                        'image_url'     => $item->product->image_url,
                        'stock_qty'     => $item->product->stock_qty,
                    ] : null,
                ];
            })
            : [];

        return Inertia::render('Cart', [
            'cartItems'   => $cartItems,
            'recommended' => Product::where('active', true)->inRandomOrder()->limit(4)->get(),
            'cartId'      => $cart?->cart_id,
            'cart'        => $cart ? [
                'promo_id' => $cart->promo_id,
                'promo'    => $cart->promo,
            ] : null,
        ]);
    }

    public function add(Request $request)
    {
        $request->validate([
            'product_id' => 'required|exists:products,product_id',
            'quantity'   => 'required|integer|min:1',
        ]);

        $product = Product::findOrFail($request->product_id);

        // Stock guard — reject if out of stock or requested quantity exceeds stock
        if ($product->stock_qty <= 0) {
            return back()->withErrors(['stock' => 'Maaf, stok produk ini sudah habis.']);
        }

        if ($request->quantity > $product->stock_qty) {
            return back()->withErrors(['stock' => "Maaf, stok tersedia hanya {$product->stock_qty} unit."]);
        }

        $userId = $this->getCurrentUserId();

        $cart = Cart::firstOrCreate(
            ['user_id' => $userId, 'status' => 'active'],
            ['created_at' => now()]
        );

        $cartItem = CartItem::where('cart_id', $cart->cart_id)
            ->where('product_id', $product->product_id)
            ->first();

        if ($cartItem) {
            $newQty = $cartItem->quantity + $request->quantity;
            if ($newQty > $product->stock_qty) {
                return back()->withErrors(['stock' => "Maaf, stok tersedia hanya {$product->stock_qty} unit (sudah ada {$cartItem->quantity} di keranjang)."]);
            }
            $cartItem->increment('quantity', $request->quantity);
        } else {
            CartItem::create([
                'cart_id'    => $cart->cart_id,
                'product_id' => $product->product_id,
                'quantity'   => $request->quantity,
                'price_each' => $product->price,
            ]);
        }

        if ($request->redirect_to_checkout) {
            return redirect()->route('checkout.index');
        }

        return back()->with('success', 'Produk berhasil ditambahkan ke keranjang.');
    }

    public function update(Request $request, $cartItemId)
    {
        $request->validate([
            'quantity' => 'required|integer|min:1',
        ]);

        $userId = $this->getCurrentUserId();

        $cartItem = CartItem::where('cart_item_id', $cartItemId)
            ->whereHas('cart', function ($query) use ($userId) {
                $query->where('user_id', $userId)->where('status', 'active');
            })
            ->firstOrFail();

        $cartItem->update(['quantity' => $request->quantity]);

        return back()->with('success', 'Jumlah item keranjang telah diperbarui.');
    }

    public function remove($cartItemId)
    {
        $userId = $this->getCurrentUserId();

        $cartItem = CartItem::where('cart_item_id', $cartItemId)
            ->whereHas('cart', function ($query) use ($userId) {
                $query->where('user_id', $userId)->where('status', 'active');
            })
            ->firstOrFail();

        $cartItem->delete();

        return back()->with('success', 'Item keranjang berhasil dihapus.');
    }

    public function previewPromo(Request $request)
    {
        $request->validate([
            'promo_code' => 'required|string',
            'subtotal'   => 'required|numeric|min:0',
        ]);

        $result = $this->promoService->applyPromoPreview($request->promo_code, $request->subtotal);

        return response()->json($result);
    }

    public function applyPromo(Request $request)
    {
        $request->validate([
            'promo_code' => 'required|string',
        ]);

        $userId = $this->getCurrentUserId();
        
        $cart = Cart::with('items')->where('user_id', $userId)->where('status', 'active')->first();
        if (!$cart) {
            return back()->withErrors(['promo_error' => 'Keranjang kosong.']);
        }

        $subtotal = $cart->items->sum(function ($item) {
            return $item->price_each * $item->quantity;
        });

        $result = $this->promoService->applyPromoPreview($request->promo_code, $subtotal);

        if (!$result['success']) {
            return back()->withErrors(['promo_error' => $result['message']]);
        }

        $cart->update(['promo_id' => $result['promo_id']]);

        return back()->with('success', $result['message']);
    }

    public function removePromo()
    {
        $userId = $this->getCurrentUserId();
        $cart = Cart::where('user_id', $userId)->where('status', 'active')->first();
        
        if ($cart) {
            $cart->update(['promo_id' => null]);
        }

        return back()->with('success', 'Promo berhasil dihapus dari keranjang.');
    }
}
