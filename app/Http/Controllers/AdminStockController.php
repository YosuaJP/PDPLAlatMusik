<?php

namespace App\Http\Controllers;

use App\Models\Product;
use App\Models\StockMovement;
use App\Models\User;
use Illuminate\Http\Request;
use Inertia\Inertia;

class AdminStockController extends Controller
{
    public function index(Request $request)
    {
        $query = StockMovement::with(['product', 'creator', 'order'])
            ->orderByDesc('movement_id');

        if ($request->filled('search')) {
            $search = $request->input('search');
            $query->whereHas('product', fn($q) => $q->where('name', 'like', "%{$search}%")
                ->orWhere('sku', 'like', "%{$search}%"));
        }

        if ($request->filled('type')) {
            $query->where('movement_type', $request->input('type'));
        }

        $movements = $query->paginate(15)->withQueryString();

        return Inertia::render('AdminStock', [
            'movements' => $movements,
            'products'  => Product::where('active', true)->orderBy('name')->get(['product_id', 'name', 'sku', 'stock_qty']),
            'filters'   => $request->only(['search', 'type']),
        ]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'product_id'    => 'required|exists:products,product_id',
            'movement_type' => 'required|in:in,out',
            'quantity'      => 'required|integer|min:1',
            'notes'         => 'nullable|string|max:500',
        ]);

        $user   = auth()->user();
        $userId = $user->user_id ?? $user->id;

        StockMovement::create([
            'product_id'    => $request->product_id,
            'created_by'    => $userId,
            'order_id'      => null,
            'movement_type' => $request->movement_type,
            'quantity'      => $request->movement_type === 'out' ? -abs($request->quantity) : abs($request->quantity),
            'notes'         => $request->notes,
            'created_at'    => now(),
        ]);

        // Update product stock
        $product = Product::findOrFail($request->product_id);
        if ($request->movement_type === 'in') {
            $product->increment('stock_qty', abs($request->quantity));
        } else {
            $product->decrement('stock_qty', abs($request->quantity));
        }

        return back()->with('success', 'Stok berhasil dicatat.');
    }
}
