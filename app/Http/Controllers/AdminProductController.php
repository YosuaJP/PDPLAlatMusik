<?php

namespace App\Http\Controllers;

use App\Models\Product;
use App\Models\Category;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;

class AdminProductController extends Controller
{
    public function index()
    {
        return Inertia::render('AdminProducts', [
            'products' => Product::with('category')->orderBy('product_id', 'desc')->get(),
            'categories' => Category::all()
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'category_id' => 'required|exists:categories,category_id',
            'stock_qty' => 'required|integer|min:0',
            'active' => 'required|boolean',
            'price' => 'required|numeric|min:0',
            'description' => 'nullable|string',
            'image' => 'nullable|image|max:2048', // max 2MB
        ]);

        $imageUrl = null;
        if ($request->hasFile('image')) {
            $path = $request->file('image')->store('products', 'public');
            $imageUrl = '/storage/' . $path;
        }

        // Generate simple SKU
        $sku = 'PRD-' . strtoupper(substr(uniqid(), -5));

        Product::create([
            'name' => $validated['name'],
            'category_id' => $validated['category_id'],
            'stock_qty' => $validated['stock_qty'],
            'active' => $validated['active'],
            'price' => $validated['price'],
            'description' => $validated['description'],
            'image_url' => $imageUrl,
            'sku' => $sku,
            'updated_at' => now(),
        ]);

        return redirect()->back()->with('success', 'Produk berhasil ditambahkan.');
    }

    public function update(Request $request, $id)
    {
        $product = Product::findOrFail($id);

        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'category_id' => 'required|exists:categories,category_id',
            'stock_qty' => 'required|integer|min:0',
            'active' => 'required|boolean',
            'price' => 'required|numeric|min:0',
            'description' => 'nullable|string',
            'image' => 'nullable|image|max:2048',
        ]);

        $imageUrl = $product->image_url;
        if ($request->hasFile('image')) {
            // Delete old image if exists
            if ($imageUrl && str_starts_with($imageUrl, '/storage/')) {
                Storage::disk('public')->delete(str_replace('/storage/', '', $imageUrl));
            }
            $path = $request->file('image')->store('products', 'public');
            $imageUrl = '/storage/' . $path;
        }

        $product->update([
            'name' => $validated['name'],
            'category_id' => $validated['category_id'],
            'stock_qty' => $validated['stock_qty'],
            'active' => $validated['active'],
            'price' => $validated['price'],
            'description' => $validated['description'],
            'image_url' => $imageUrl,
            'updated_at' => now(),
        ]);

        return redirect()->back()->with('success', 'Produk berhasil diperbarui.');
    }

    public function destroy($id)
    {
        $product = Product::findOrFail($id);
        
        // Soft delete
        $product->delete();

        return redirect()->back()->with('success', 'Produk berhasil dihapus.');
    }
}
