<?php

namespace App\Http\Controllers;

use App\Models\Category;
use App\Models\Order;
use App\Models\Product;
use Illuminate\Http\Request;
use Inertia\Inertia;

class DashboardController extends Controller
{
    protected function getCurrentUserId()
    {
        $user = auth()->user();
        return $user->user_id ?? $user->id;
    }

    public function welcome()
    {
        return Inertia::render('Welcome', [
            'categories' => Category::where('active', true)->get(),
            'products'   => Product::with('category')->where('active', true)->inRandomOrder()->limit(8)->get(),
        ]);
    }

    public function index(Request $request)
    {
        $user = auth()->user();

        if ($user->role === 'admin') {
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
        }

        $userId = $this->getCurrentUserId();

        $orders = Order::where('user_id', $userId)
            ->with(['items', 'payment'])
            ->orderByDesc('created_at')
            ->limit(6)
            ->get()
            ->map(function ($order) {
                return [
                    'order_id'       => $order->order_id,
                    'created_at'     => $order->created_at->format('d M Y, H:i'),
                    'final_amount'   => (float) $order->final_amount,
                    'status'         => $order->status,
                    'items_count'    => $order->items->sum('quantity'),
                    'payment_status' => $order->payment->payment_status ?? 'pending',
                ];
            });

        return Inertia::render('UserDashboard', [
            'categories' => Category::where('active', true)->get(),
            'products'   => Product::with('category')->where('active', true)->get(),
            'orders'     => $orders,
        ]);
    }
}
