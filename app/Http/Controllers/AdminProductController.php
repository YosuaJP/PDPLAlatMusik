<?php

namespace App\Http\Controllers;

use App\Models\Category;
use App\Models\Product;
use Illuminate\Http\Request;
use Inertia\Inertia;

class AdminProductController extends Controller
{
    public function index(Request $request)
    {
        $search = $request->input('search', '');

        $query = Product::with('category')->orderByDesc('product_id');

        if ($search) {
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                  ->orWhere('sku', 'like', "%{$search}%");
            });
        }

        $products = $query->paginate(10)->withQueryString();

        return Inertia::render('AdminProducts', [
            'products'   => $products,
            'categories' => Category::where('active', true)->get(),
            'filters'    => ['search' => $search],
        ]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'category_id' => 'required|exists:categories,category_id',
            'name'        => 'required|string|max:255',
            'description' => 'nullable|string',
            'price'       => 'required|numeric|min:0',
            'stock_qty'   => 'required|integer|min:0',
            'sku'         => 'nullable|string|max:100',
            'image_url'   => 'nullable|url',
            'active'      => 'boolean',
        ]);

        Product::create([
            'category_id' => $request->category_id,
            'name'        => $request->name,
            'description' => $request->description,
            'price'       => $request->price,
            'stock_qty'   => $request->stock_qty,
            'sku'         => $request->sku,
            'image_url'   => $request->image_url,
            'active'      => $request->boolean('active'),
            'updated_at'  => now(),
        ]);

        return back()->with('success', 'Produk berhasil ditambahkan.');
    }

    public function update(Request $request, $id)
    {
        $product = Product::findOrFail($id);

        $request->validate([
            'category_id' => 'required|exists:categories,category_id',
            'name'        => 'required|string|max:255',
            'description' => 'nullable|string',
            'price'       => 'required|numeric|min:0',
            'stock_qty'   => 'required|integer|min:0',
            'sku'         => 'nullable|string|max:100',
            'image_url'   => 'nullable|url',
            'active'      => 'boolean',
        ]);

        $product->update([
            'category_id' => $request->category_id,
            'name'        => $request->name,
            'description' => $request->description,
            'price'       => $request->price,
            'stock_qty'   => $request->stock_qty,
            'sku'         => $request->sku,
            'image_url'   => $request->image_url,
            'active'      => $request->boolean('active'),
            'updated_at'  => now(),
        ]);

        return back()->with('success', 'Produk berhasil diperbarui.');
    }

    public function destroy($id)
    {
        $product = Product::findOrFail($id);
        $product->delete();

        return back()->with('success', 'Produk berhasil dihapus.');
    }
}
