<?php

namespace App\Http\Controllers;

use App\Models\Category;
use App\Models\OrderItem;
use App\Models\Product;
use App\Services\ReportService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class AdminPerformanceController extends Controller
{
    protected ReportService $reportService;

    public function __construct(ReportService $reportService)
    {
        $this->reportService = $reportService;
    }

    public function index(Request $request)
    {
        $startDate  = $request->input('start_date');
        $endDate    = $request->input('end_date');
        $categoryId = $request->input('category_id');
        $search     = $request->input('search');

        // 1. Ambil data performa produk individual
        $itemQuery = OrderItem::select(
                'product_id',
                'product_name',
                DB::raw('SUM(quantity) as total_sold'),
                DB::raw('SUM(quantity * price_each) as total_revenue')
            )
            ->groupBy('product_id', 'product_name');

        if ($startDate) {
            $itemQuery->whereHas('order', fn($q) => $q->whereDate('created_at', '>=', $startDate));
        }
        if ($endDate) {
            $itemQuery->whereHas('order', fn($q) => $q->whereDate('created_at', '<=', $endDate));
        }

        $soldData = $itemQuery->get()->keyBy('product_id');

        $productQuery = Product::with('category')->orderByDesc('product_id');

        if ($categoryId) {
            $productQuery->where('category_id', $categoryId);
        }
        if ($search) {
            $productQuery->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                  ->orWhere('sku', 'like', "%{$search}%");
            });
        }

        $products = $productQuery->get()->map(function ($product) use ($soldData) {
            $data = $soldData->get($product->product_id);
            
            // Ambil rating ulasan rata-rata produk secara langsung (memenuhi Orang 3)
            $avgRating = \App\Models\Review::where('product_id', $product->product_id)->avg('rating');

            return [
                'product_id'    => $product->product_id,
                'name'          => $product->name,
                'sku'           => $product->sku,
                'price'         => (float) $product->price,
                'image_url'     => $product->image_url,
                'category_name' => $product->category?->category_name ?? '—',
                'total_sold'    => $data ? (int) $data->total_sold : 0,
                'total_revenue' => $data ? (float) $data->total_revenue : 0,
                'avg_rating'    => $avgRating ? round((float) $avgRating, 1) : 0,
            ];
        })->sortByDesc('total_sold')->values();

        $totalSold    = $products->sum('total_sold');
        $totalRevenue = $products->sum('total_revenue');

        // 2. Ambil data performa kategori produk dari ReportService (Orang 2)
        $categoryPerformance = $this->reportService->getCategoryPerformance($startDate, $endDate);

        return Inertia::render('AdminPerformance', [
            'products'             => $products,
            'categories'           => Category::where('active', true)->get(['category_id', 'category_name']),
            'category_performance' => $categoryPerformance,
            'stats'                => [
                'total_products' => $products->count(),
                'total_sold'     => $totalSold,
                'total_revenue'  => $totalRevenue,
            ],
            'filters'              => $request->only(['start_date', 'end_date', 'category_id', 'search']),
        ]);
    }
}
