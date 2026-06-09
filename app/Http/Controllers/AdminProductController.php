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
            'image'       => 'nullable|image|mimes:jpeg,png,jpg,gif,svg,webp|max:4096',
            'active'      => 'boolean',
        ]);

        $imageUrl = null;
        if ($request->hasFile('image')) {
            $dir = public_path('images/products');
            if (!file_exists($dir)) {
                mkdir($dir, 0777, true);
            }
            $file = $request->file('image');
            $filename = time() . '_' . uniqid() . '.' . $file->getClientOriginalExtension();
            $file->move($dir, $filename);
            $imageUrl = '/images/products/' . $filename;
        }

        $product = Product::create([
            'category_id' => $request->category_id,
            'name'        => $request->name,
            'description' => $request->description,
            'price'       => $request->price,
            'stock_qty'   => $request->stock_qty,
            'sku'         => $request->sku,
            'image_url'   => $imageUrl,
            'active'      => $request->boolean('active'),
            'updated_at'  => now(),
        ]);

        if ($product->stock_qty > 0) {
            \App\Models\StockMovement::create([
                'product_id'    => $product->product_id,
                'created_by'    => auth()->id(),
                'order_id'      => null,
                'movement_type' => 'in',
                'quantity'      => $product->stock_qty,
                'notes'         => "Stok awal produk baru",
                'created_at'    => now(),
            ]);
        }

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
            'image'       => 'nullable|image|mimes:jpeg,png,jpg,gif,svg,webp|max:4096',
            'active'      => 'boolean',
        ]);

        $imageUrl = $product->image_url;
        if ($request->hasFile('image')) {
            // Delete old image if it exists and is local
            if ($imageUrl && str_starts_with($imageUrl, '/images/products/')) {
                $oldPath = public_path(substr($imageUrl, 1));
                if (file_exists($oldPath)) {
                    @unlink($oldPath);
                }
            }

            $dir = public_path('images/products');
            if (!file_exists($dir)) {
                mkdir($dir, 0777, true);
            }
            $file = $request->file('image');
            $filename = time() . '_' . uniqid() . '.' . $file->getClientOriginalExtension();
            $file->move($dir, $filename);
            $imageUrl = '/images/products/' . $filename;
        }

        $oldStock = $product->stock_qty;
        $newStock = $request->stock_qty;

        $product->update([
            'category_id' => $request->category_id,
            'name'        => $request->name,
            'description' => $request->description,
            'price'       => $request->price,
            'stock_qty'   => $newStock,
            'sku'         => $request->sku,
            'image_url'   => $imageUrl,
            'active'      => $request->boolean('active'),
            'updated_at'  => now(),
        ]);

        if ($oldStock !== $newStock) {
            $diff = $newStock - $oldStock;
            \App\Models\StockMovement::create([
                'product_id'    => $product->product_id,
                'created_by'    => auth()->id(),
                'order_id'      => null,
                'movement_type' => $diff > 0 ? 'in' : 'out',
                'quantity'      => abs($diff),
                'notes'         => "Update produk (Edit stok dari {$oldStock} ke {$newStock})",
                'created_at'    => now(),
            ]);
        }

        return back()->with('success', 'Produk berhasil diperbarui.');
    }

    public function destroy($id)
    {
        $product = Product::findOrFail($id);
        $product->delete();

        return back()->with('success', 'Produk berhasil dihapus.');
    }
}
