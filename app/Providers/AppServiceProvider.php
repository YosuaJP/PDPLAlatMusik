<?php
#cc
namespace App\Providers;

use App\Contracts\OrderRepositoryInterface;
use App\Contracts\ProductRepositoryInterface;
use App\Repositories\EloquentOrderRepository;
use App\Repositories\EloquentProductRepository;
use Illuminate\Support\Facades\Vite;
use Illuminate\Support\ServiceProvider;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        // Repository Pattern — binding interface ke implementasi Eloquent
        $this->app->bind(ProductRepositoryInterface::class, EloquentProductRepository::class);
        $this->app->bind(OrderRepositoryInterface::class, EloquentOrderRepository::class);
        $this->app->bind(\App\Contracts\PaymentGatewayInterface::class, function ($app) {
            $gateway = env('PAYMENT_GATEWAY', 'xendit');
            if ($gateway === 'midtrans') {
                return $app->make(\App\Services\MidtransService::class);
            }
            return $app->make(\App\Services\XenditService::class);
        });
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        Vite::prefetch(concurrency: 3);
    }
}
