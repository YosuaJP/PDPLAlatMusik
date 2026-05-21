<?php

use App\Http\Controllers\ProfileController;
use App\Http\Controllers\CartController;
use App\Http\Controllers\CheckoutController;
use App\Http\Controllers\OrderController;
use App\Http\Controllers\PaymentController;
use App\Models\Order;
use App\Models\Product;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

use App\Models\Category;

Route::get('/', function () {
    return Inertia::render('Welcome', [
        'canLogin'       => Route::has('login'),
        'canRegister'    => Route::has('register'),
        'laravelVersion' => Application::VERSION,
        'phpVersion'     => PHP_VERSION,
        'categories'     => Category::where('active', true)->get(),
        'products'       => Product::with('category')->where('active', true)->inRandomOrder()->limit(8)->get(),
    ]);
});

Route::get('/dashboard', function () {
    $stats = [
        'total_orders'   => Order::count(),
        'total_revenue'  => Order::whereIn('status', ['processing', 'shipped', 'delivered'])->sum('final_amount'),
        'total_products' => Product::where('active', true)->count(),
        'pending_orders' => Order::where('status', 'pending')->count(),
    ];

    $recentOrders = Order::with('user')
        ->orderByDesc('created_at')
        ->limit(7)
        ->get();

    $lowStockProducts = Product::where('stock_qty', '<=', 5)
        ->where('active', true)
        ->orderBy('stock_qty')
        ->get();

    if (auth()->user()->role === 'admin') {
        return Inertia::render('AdminDashboard', [
            'stats'            => $stats,
            'recentOrders'     => $recentOrders,
            'lowStockProducts' => $lowStockProducts,
        ]);
    }

    $userId = auth()->user()->user_id ?? auth()->user()->id;
    $orders = Order::where('user_id', $userId)
        ->with(['items', 'payment'])
        ->orderByDesc('created_at')
        ->limit(6)
        ->get()
        ->map(function ($order) {
            return [
                'order_id'        => $order->order_id,
                'created_at'      => $order->created_at->format('d M Y, H:i'),
                'final_amount'    => (float) $order->final_amount,
                'status'          => $order->status,
                'items_count'     => $order->items->sum('quantity'),
                'payment_status'  => $order->payment->payment_status ?? 'pending',
            ];
        });

    return Inertia::render('UserDashboard', [
        'categories' => Category::where('active', true)->get(),
        'products'   => Product::with('category')->where('active', true)->get(),
        'orders'     => $orders,
    ]);
})->middleware(['auth', 'verified'])->name('dashboard');

use App\Http\Controllers\AdminCategoryController;
use App\Http\Controllers\AdminProductController;

Route::middleware(['auth'])->group(function () {
    Route::get('/categories', [AdminCategoryController::class, 'index'])->name('categories.index');
    Route::post('/categories', [AdminCategoryController::class, 'store'])->name('categories.store');
    Route::put('/categories/{id}', [AdminCategoryController::class, 'update'])->name('categories.update');
    Route::delete('/categories/{id}', [AdminCategoryController::class, 'destroy'])->name('categories.destroy');

    Route::get('/products', [AdminProductController::class, 'index'])->name('products.index');
    Route::post('/products', [AdminProductController::class, 'store'])->name('products.store');
    Route::put('/products/{id}', [AdminProductController::class, 'update'])->name('products.update');
    Route::delete('/products/{id}', [AdminProductController::class, 'destroy'])->name('products.destroy');

    // Cart routes (user)
    Route::get('/cart', [CartController::class, 'index'])->name('cart.index');
    Route::post('/cart/add', [CartController::class, 'add'])->name('cart.add');
    Route::patch('/cart/update/{cartItemId}', [CartController::class, 'update'])->name('cart.update');
    Route::delete('/cart/remove/{cartItemId}', [CartController::class, 'remove'])->name('cart.remove');

    // Product catalog (user-facing)
    Route::get('/shop/products', function () {
        $search   = request('search', '');
        $catId    = request('category', '');
        $sort     = request('sort', 'latest');

        $query = \App\Models\Product::with('category')->where('active', true);

        if ($search) {
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                  ->orWhere('description', 'like', "%{$search}%");
            });
        }
        if ($catId) {
            $query->where('category_id', $catId);
        }
        switch ($sort) {
            case 'price_asc':  $query->orderBy('price', 'asc'); break;
            case 'price_desc': $query->orderBy('price', 'desc'); break;
            default:           $query->orderByDesc('product_id'); break;
        }

        return Inertia::render('ProductCatalog', [
            'products'   => $query->get(),
            'categories' => \App\Models\Category::where('active', true)->get(),
            'filters'    => ['search' => $search, 'category' => $catId, 'sort' => $sort],
        ]);
    })->name('product.catalog');

    // Product detail (user-facing)

    Route::get('/shop/product/{id}', function ($id) {
        $product = \App\Models\Product::with(['category', 'reviews'])->findOrFail($id);
        $related = \App\Models\Product::with('category')
            ->where('category_id', $product->category_id)
            ->where('product_id', '!=', $product->product_id)
            ->where('active', true)
            ->inRandomOrder()
            ->limit(4)
            ->get();

        $reviews = $product->reviews()->with('orderItem.order.user')->latest()->get()->map(function ($r) {
            return [
                'review_id' => $r->review_id,
                'rating'    => $r->rating,
                'comment'   => $r->comment,
                'created_at'=> $r->created_at?->format('d M Y') ?? '',
                'user_name' => $r->orderItem?->order?->user?->name ?? 'Pembeli',
            ];
        });

        $avgRating = $reviews->count() > 0 ? round($reviews->avg('rating'), 1) : 0;

        return Inertia::render('ProductDetail', [
            'product'   => $product,
            'related'   => $related,
            'reviews'   => $reviews,
            'avgRating' => $avgRating,
        ]);
    })->name('product.detail');

    // Checkout routes
    Route::get('/checkout', [CheckoutController::class, 'index'])->name('checkout.index');
    Route::post('/checkout', [CheckoutController::class, 'store'])->name('checkout.store');

    // Order status routes
    Route::get('/orders', [OrderController::class, 'index'])->name('orders.index');
    Route::get('/orders/{id}', [OrderController::class, 'show'])->name('orders.show');

    // Payment simulation routes
    Route::get('/payment/simulate/{external_id}', [PaymentController::class, 'simulate'])->name('payment.simulate');
    Route::post('/payment/simulate/{external_id}/process', [PaymentController::class, 'processSimulate'])->name('payment.process');
});
Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});

require __DIR__.'/auth.php';
