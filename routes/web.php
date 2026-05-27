<?php

use App\Http\Controllers\AdminCategoryController;
use App\Http\Controllers\AdminProductController;
use App\Http\Controllers\AdminStockController;
use App\Http\Controllers\AdminPromoController;
use App\Http\Controllers\AdminPerformanceController;
use App\Http\Controllers\AdminReportController;
use App\Http\Controllers\AdminOrderController;
use App\Http\Controllers\AdminRefundController;
use App\Http\Controllers\AdminUserController;
use App\Http\Controllers\CartController;
use App\Http\Controllers\CheckoutController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\OrderController;
use App\Http\Controllers\PaymentController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\ShopController;
use Illuminate\Support\Facades\Route;

Route::get('/', [DashboardController::class, 'welcome'])->name('welcome');

Route::get('/dashboard', [DashboardController::class, 'index'])
    ->middleware(['auth', 'verified'])
    ->name('dashboard');

Route::middleware(['auth'])->group(function () {
    Route::get('/categories', [AdminCategoryController::class, 'index'])->name('categories.index');
    Route::post('/categories', [AdminCategoryController::class, 'store'])->name('categories.store');
    Route::put('/categories/{id}', [AdminCategoryController::class, 'update'])->name('categories.update');
    Route::delete('/categories/{id}', [AdminCategoryController::class, 'destroy'])->name('categories.destroy');

    Route::get('/products', [AdminProductController::class, 'index'])->name('products.index');
    Route::post('/products', [AdminProductController::class, 'store'])->name('products.store');
    Route::put('/products/{id}', [AdminProductController::class, 'update'])->name('products.update');
    Route::delete('/products/{id}', [AdminProductController::class, 'destroy'])->name('products.destroy');

    Route::prefix('admin')->group(function () {
        Route::get('/stocks', [AdminStockController::class, 'index'])->name('admin.stocks.index');
        Route::post('/stocks', [AdminStockController::class, 'store'])->name('admin.stocks.store');

        Route::get('/promos', [AdminPromoController::class, 'index'])->name('admin.promos.index');
        Route::post('/promos', [AdminPromoController::class, 'store'])->name('admin.promos.store');
        Route::put('/promos/{id}', [AdminPromoController::class, 'update'])->name('admin.promos.update');
        Route::patch('/promos/{id}/toggle', [AdminPromoController::class, 'toggleActive'])->name('admin.promos.toggle');
        Route::delete('/promos/{id}', [AdminPromoController::class, 'destroy'])->name('admin.promos.destroy');

        Route::get('/product-performance', [AdminPerformanceController::class, 'index'])->name('admin.performance.index');
        Route::get('/reports', [AdminReportController::class, 'index'])->name('admin.reports.index');
        
        Route::get('/orders', [AdminOrderController::class, 'index'])->name('admin.orders.index');
        Route::post('/orders/{id}/process', [AdminOrderController::class, 'process'])->name('admin.orders.process');

        Route::get('/refunds', [AdminRefundController::class, 'index'])->name('admin.refunds.index');
        Route::post('/refunds/{id}/process', [AdminRefundController::class, 'process'])->name('admin.refunds.process');
        
        Route::get('/users', [AdminUserController::class, 'index'])->name('admin.users.index');
        Route::post('/users', [AdminUserController::class, 'store'])->name('admin.users.store');
        Route::put('/users/{id}', [AdminUserController::class, 'update'])->name('admin.users.update');
        Route::delete('/users/{id}', [AdminUserController::class, 'destroy'])->name('admin.users.destroy');
    });

    Route::get('/cart', [CartController::class, 'index'])->name('cart.index');
    Route::post('/cart/add', [CartController::class, 'add'])->name('cart.add');
    Route::patch('/cart/update/{cartItemId}', [CartController::class, 'update'])->name('cart.update');
    Route::delete('/cart/remove/{cartItemId}', [CartController::class, 'remove'])->name('cart.remove');

    Route::get('/shop/products', [ShopController::class, 'catalog'])->name('product.catalog');
    Route::get('/shop/product/{id}', [ShopController::class, 'detail'])->name('product.detail');

    Route::get('/checkout', [CheckoutController::class, 'index'])->name('checkout.index');
    Route::post('/checkout', [CheckoutController::class, 'store'])->name('checkout.store');

    Route::get('/orders', [OrderController::class, 'index'])->name('orders.index');
    Route::get('/orders/{id}', [OrderController::class, 'show'])->name('orders.show');
    Route::post('/orders/{id}/refund', [OrderController::class, 'submitRefund'])->name('orders.refund');
    Route::post('/orders/{id}/receive', [OrderController::class, 'markAsReceived'])->name('orders.receive');

    Route::get('/payment/checkout/{external_id}', [PaymentController::class, 'checkoutPage'])->name('payment.checkout');

    Route::get('/payment/simulate/{external_id}', [PaymentController::class, 'simulate'])->name('payment.simulate');
    Route::post('/payment/simulate/{external_id}/process', [PaymentController::class, 'processSimulate'])->name('payment.process');

    Route::post('/addresses', [\App\Http\Controllers\AddressController::class, 'store'])->name('addresses.store');
    Route::put('/addresses/{id}', [\App\Http\Controllers\AddressController::class, 'update'])->name('addresses.update');

    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});

Route::post('/payment/webhook/midtrans', [PaymentController::class, 'handleWebhook'])->name('payment.webhook.midtrans');
Route::post('/payment/webhook/xendit', [PaymentController::class, 'handleXenditWebhook'])->name('payment.webhook.xendit');

require __DIR__.'/auth.php';
