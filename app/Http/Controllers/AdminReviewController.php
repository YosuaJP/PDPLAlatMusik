<?php

namespace App\Http\Controllers;

use App\Models\Review;
use Illuminate\Http\Request;
use Inertia\Inertia;

class AdminReviewController extends Controller
{
    public function index(Request $request)
    {
        $search  = $request->input('search', '');
        $rating  = $request->input('rating', '');
        $perPage = 20;

        $query = Review::with(['product', 'orderItem.order.user'])
            ->orderByDesc('created_at');

        if ($search) {
            $query->whereHas('product', function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%");
            })->orWhereHas('orderItem.order.user', function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%");
            });
        }

        if ($rating) {
            $query->where('rating', $rating);
        }

        $reviews = $query->paginate($perPage)->through(function ($review) {
            return [
                'review_id'    => $review->review_id,
                'rating'       => $review->rating,
                'comment'      => $review->comment,
                'created_at'   => $review->created_at?->format('d/m/Y H:i') ?? '—',
                'product_name' => $review->product?->name ?? '—',
                'product_image'=> $review->product?->image_url ?? null,
                'customer_name'=> $review->orderItem?->order?->user?->name ?? 'Pelanggan',
                'order_id'     => $review->orderItem?->order_id,
            ];
        });

        // Statistik ringkasan
        $stats = [
            'total'      => Review::count(),
            'avg_rating' => round((float) Review::avg('rating'), 1),
            'rating_5'   => Review::where('rating', 5)->count(),
            'rating_1'   => Review::where('rating', 1)->count(),
        ];

        return Inertia::render('AdminReviews', [
            'reviews' => $reviews,
            'stats'   => $stats,
            'filters' => ['search' => $search, 'rating' => $rating],
        ]);
    }
}
