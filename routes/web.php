<?php

use App\Http\Controllers\ProfileController;
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
    if (auth()->user()->role === 'admin') {
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

        return Inertia::render('AdminDashboard', [
            'stats'            => $stats,
            'recentOrders'     => $recentOrders,
            'lowStockProducts' => $lowStockProducts,
        ]);
    }

    return Inertia::render('UserDashboard');
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
});

Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});

require __DIR__.'/auth.php';
