<?php

namespace App\Http\Controllers;

use App\Models\Category;
use App\Models\Product;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ShopController extends Controller
{
    public function catalog(Request $request)
    {
        $search = $request->input('search', '');
        $catId  = $request->input('category', '');
        $sort   = $request->input('sort', 'latest');

        $query = Product::with('category')->where('active', true);

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
            case 'price_asc':
                $query->orderBy('price', 'asc');
                break;
            case 'price_desc':
                $query->orderBy('price', 'desc');
                break;
            default:
                $query->orderByDesc('product_id');
                break;
        }

        return Inertia::render('ProductCatalog', [
            'products'   => $query->get(),
            'categories' => Category::where('active', true)->get(),
            'filters'    => [
                'search'   => $search,
                'category' => $catId,
                'sort'     => $sort,
            ],
        ]);
    }

    public function detail($id)
    {
        $product = Product::with(['category', 'reviews.orderItem.order.user'])
            ->findOrFail($id);

        $related = Product::with('category')
            ->where('category_id', $product->category_id)
            ->where('product_id', '!=', $product->product_id)
            ->where('active', true)
            ->inRandomOrder()
            ->limit(4)
            ->get();

        $reviews = $product->reviews()->with('orderItem.order.user')->latest()->get()->map(function ($review) {
            return [
                'review_id' => $review->review_id,
                'rating'    => $review->rating,
                'comment'   => $review->comment,
                'created_at'=> $review->created_at?->format('d M Y') ?? '',
                'user_name' => $review->orderItem?->order?->user?->name ?? 'Pembeli',
            ];
        });

        $avgRating = $reviews->count() > 0 ? round($reviews->avg('rating'), 1) : 0;

        return Inertia::render('ProductDetail', [
            'product'   => $product,
            'related'   => $related,
            'reviews'   => $reviews,
            'avgRating' => $avgRating,
        ]);
    }
}
