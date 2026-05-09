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

    return Inertia::render('Dashboard', [
        'stats'            => $stats,
        'recentOrders'     => $recentOrders,
        'lowStockProducts' => $lowStockProducts,
    ]);
})->middleware(['auth', 'verified'])->name('dashboard');

Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});

require __DIR__.'/auth.php';
