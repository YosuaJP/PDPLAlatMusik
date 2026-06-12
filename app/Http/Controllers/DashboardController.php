<?php

namespace App\Http\Controllers;

use App\Models\Category;
use App\Models\Order;
use App\Models\OrderItem;
use App\Models\Product;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
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
            'products'   => Product::with('category')
                                ->where('active', true)
                                ->whereHas('category', fn($q) => $q->where('active', true))
                                ->orderByRaw('stock_qty > 0 DESC')
                                ->inRandomOrder()
                                ->limit(8)->get(),
        ]);
    }

    public function index(Request $request)
    {
        $user = auth()->user();

        if ($user->role === 'admin') {
            $stats = [
                'total_orders'    => Order::where('status', '!=', 'pending')->count(),
                'total_revenue'   => Order::whereIn('status', ['processing', 'shipped', 'delivered', 'completed'])->sum('final_amount'),
                'total_products'  => Product::where('active', true)->count(),
                'pending_orders'  => Order::where('status', 'processing')->count(),
                'total_customers' => User::where('role', 'user')->count(),
            ];

            $recentOrders = Order::with('user')
                ->where('status', '!=', 'pending')
                ->orderByDesc('created_at')
                ->limit(7)
                ->get();

            $lowStockProducts = Product::where('stock_qty', '<=', 5)
                ->where('active', true)
                ->orderBy('stock_qty')
                ->get();

            // Top selling products
            $topProducts = OrderItem::select(
                    'product_name',
                    'product_id',
                    DB::raw('SUM(quantity) as total_sold'),
                    DB::raw('SUM(quantity * price_each) as total_revenue')
                )
                ->groupBy('product_name', 'product_id')
                ->orderByDesc('total_sold')
                ->limit(5)
                ->get()
                ->map(fn ($item) => [
                    'product_name'  => $item->product_name,
                    'product_id'    => $item->product_id,
                    'total_sold'    => (int) $item->total_sold,
                    'total_revenue' => (float) $item->total_revenue,
                    'image_url'     => Product::find($item->product_id)?->image_url,
                ]);

            // Orders needing processing
            $pendingOrdersList = Order::with(['user', 'items.product'])
                ->where('status', 'processing')
                ->orderByDesc('created_at')
                ->limit(5)
                ->get()
                ->map(fn ($o) => [
                    'order_id'    => $o->order_id,
                    'user_name'   => $o->user?->name ?? 'Pelanggan',
                    'shipping_address' => $o->shipping_address ?? 'Alamat tidak tersedia',
                    'courier_code' => strtoupper($o->courier_code ?? 'Kurir'),
                    'final_amount'=> (float) $o->final_amount,
                    'status'      => $o->status,
                    'created_at'  => $o->created_at->diffForHumans(),
                    'items'       => $o->items->map(fn($item) => [
                        'product_name' => $item->product_name,
                        'quantity'     => $item->quantity,
                        'price'        => (float) $item->price_each,
                        'image_url'    => $item->product?->image_url,
                    ]),
                ]);

            return Inertia::render('Dashboard', [
                'stats'             => $stats,
                'recentOrders'      => $recentOrders,
                'lowStockProducts'  => $lowStockProducts,
                'topProducts'       => $topProducts,
                'pendingOrdersList' => $pendingOrdersList,
            ]);
        }

        $userId = $this->getCurrentUserId();

        $orders = Order::where('user_id', $userId)
            ->with(['items', 'payment', 'refunds'])
            ->orderByDesc('created_at')
            ->limit(6)
            ->get()
            ->map(function ($order) {
                $refund = $order->refunds->first();
                $firstItem = $order->items->first();
                return [
                    'order_id'            => $order->order_id,
                    'first_item_name'     => $firstItem?->product_name ?? 'Produk',
                    'created_at'          => $order->created_at->format('d M Y, H:i'),
                    'created_at_raw'      => $order->created_at->toISOString(),
                    'final_amount'        => (float) $order->final_amount,
                    'status'              => $order->status,
                    'items_count'         => $order->items->sum('quantity'),
                    'payment_status'      => $order->payment->payment_status ?? 'pending',
                    'payment_external_id' => $order->payment->external_id ?? null,
                    'refund_status'       => $refund?->status ?? null,
                ];
            });

        return Inertia::render('UserDashboard', [
            'categories' => Category::where('active', true)->get(),
            'products'   => Product::with('category')->where('active', true)->orderByRaw('stock_qty > 0 DESC')->get(),
            'orders'     => $orders,
        ]);
    }
}

