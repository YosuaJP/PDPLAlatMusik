<?php

namespace App\Services;

use App\Models\Order;
use App\Models\Category;
use App\Models\Review;
use App\Models\OrderItem;
use Illuminate\Support\Facades\DB;

class ReportService
{
    /**
     * Mengambil ringkasan keuangan dan data rekonsiliasi.
     */
    public function getFinancialSummary($startDate = null, $endDate = null)
    {
        $query = Order::with('payment')
            ->whereIn('status', ['processing', 'shipped', 'delivered', 'completed']);

        if ($startDate) {
            $query->whereDate('created_at', '>=', $startDate);
        }
        if ($endDate) {
            $query->whereDate('created_at', '<=', $endDate);
        }

        $orders = $query->get();

        $totalRevenue = 0;
        $totalGatewayFee = 0;
        $totalTransaksi = $orders->count();

        // Breakdown per metode pembayaran
        $methodBreakdown = [];

        foreach ($orders as $order) {
            $totalRevenue += floatval($order->final_amount);
            
            $fee = 0;
            $method = 'Lainnya';
            
            if ($order->payment) {
                $fee = floatval($order->payment->gateway_fee ?? 0);
                $method = $order->payment->payment_method ?: 'Lainnya';
            }
            
            $totalGatewayFee += $fee;

            $methodClean = strtoupper($method);
            if (!isset($methodBreakdown[$methodClean])) {
                $methodBreakdown[$methodClean] = [
                    'count' => 0,
                    'revenue' => 0,
                    'fee' => 0
                ];
            }
            $methodBreakdown[$methodClean]['count']++;
            $methodBreakdown[$methodClean]['revenue'] += floatval($order->final_amount);
            $methodBreakdown[$methodClean]['fee'] += $fee;
        }

        $netRevenue = $totalRevenue - $totalGatewayFee;

        // Mendapatkan data harian untuk grafik Pendapatan vs Gateway Fee
        $dailyQuery = Order::select(
                DB::raw('DATE(orders.created_at) as date'),
                DB::raw('SUM(orders.final_amount) as revenue'),
                DB::raw('SUM(payments.gateway_fee) as gateway_fee')
            )
            ->join('payments', 'orders.order_id', '=', 'payments.order_id')
            ->whereIn('orders.status', ['processing', 'shipped', 'delivered', 'completed'])
            ->groupBy(DB::raw('DATE(orders.created_at)'))
            ->orderBy('date', 'asc');

        if ($startDate) {
            $dailyQuery->whereDate('orders.created_at', '>=', $startDate);
        }
        if ($endDate) {
            $dailyQuery->whereDate('orders.created_at', '<=', $endDate);
        }

        $dailyData = $dailyQuery->get()->map(fn($row) => [
            'date' => date('d/m', strtotime($row->date)),
            'revenue' => floatval($row->revenue),
            'gateway_fee' => floatval($row->gateway_fee ?: 0)
        ])->values()->all();

        return [
            'total_revenue' => $totalRevenue,
            'total_gateway_fee' => $totalGatewayFee,
            'net_revenue' => $netRevenue,
            'total_transaksi' => $totalTransaksi,
            'method_breakdown' => $methodBreakdown,
            'daily_data' => $dailyData
        ];
    }

    /**
     * Mengambil laporan performa per kategori produk beserta agregasi rating ulasan.
     */
    public function getCategoryPerformance($startDate = null, $endDate = null)
    {
        $categories = Category::all();
        $performance = [];

        foreach ($categories as $cat) {
            // Hitung unit terjual & omzet per kategori
            $itemQuery = OrderItem::join('orders', 'order_items.order_id', '=', 'orders.order_id')
                ->join('products', 'order_items.product_id', '=', 'products.product_id')
                ->where('products.category_id', $cat->category_id)
                ->whereIn('orders.status', ['processing', 'shipped', 'delivered', 'completed']);

            if ($startDate) {
                $itemQuery->whereDate('orders.created_at', '>=', $startDate);
            }
            if ($endDate) {
                $itemQuery->whereDate('orders.created_at', '<=', $endDate);
            }

            $stats = $itemQuery->select(
                DB::raw('SUM(order_items.quantity) as total_sold'),
                DB::raw('SUM(order_items.quantity * order_items.price_each) as total_revenue')
            )->first();

            // Hitung rata-rata rating ulasan kategori langsung dari tabel reviews (tanpa join order_items)
            // Memanfaatkan kolom product_id di reviews (memenuhi Orang 3)
            $ratingQuery = Review::join('products', 'reviews.product_id', '=', 'products.product_id')
                ->where('products.category_id', $cat->category_id);

            if ($startDate) {
                $ratingQuery->whereDate('reviews.created_at', '>=', $startDate);
            }
            if ($endDate) {
                $ratingQuery->whereDate('reviews.created_at', '<=', $endDate);
            }

            $avgRating = $ratingQuery->avg('reviews.rating');

            $performance[] = [
                'category_id' => $cat->category_id,
                'category_name' => $cat->category_name,
                'total_sold' => intval($stats->total_sold ?? 0),
                'total_revenue' => floatval($stats->total_revenue ?? 0),
                'avg_rating' => $avgRating ? round(floatval($avgRating), 1) : 0.0
            ];
        }

        // Urutkan berdasarkan total_revenue terbesar
        usort($performance, fn($a, $b) => $b['total_revenue'] <=> $a['total_revenue']);

        return $performance;
    }
}
