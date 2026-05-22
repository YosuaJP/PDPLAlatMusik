<?php

namespace App\Http\Controllers;

use App\Models\Category;
use Illuminate\Http\Request;
use Inertia\Inertia;

class AdminCategoryController extends Controller
{
    public function index()
    {
        return Inertia::render('AdminCategories', [
            'categories' => Category::withCount('products')->orderByDesc('created_at')->paginate(10),
        ]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'category_name' => 'required|string|max:255',
            'description'   => 'nullable|string',
            'active'        => 'boolean',
        ]);

        Category::create([
            'category_name' => $request->category_name,
            'description'   => $request->description,
            'active'        => $request->boolean('active'),
            'created_at'    => now(),
        ]);

        return back()->with('success', 'Kategori berhasil ditambahkan.');
    }

    public function update(Request $request, $id)
    {
        $category = Category::findOrFail($id);

        $request->validate([
            'category_name' => 'required|string|max:255',
            'description'   => 'nullable|string',
            'active'        => 'boolean',
        ]);

        $category->update([
            'category_name' => $request->category_name,
            'description'   => $request->description,
            'active'        => $request->boolean('active'),
        ]);

        return back()->with('success', 'Kategori berhasil diperbarui.');
    }

    public function destroy($id)
    {
        $category = Category::findOrFail($id);
        $category->delete();

        return back()->with('success', 'Kategori berhasil dihapus.');
    }
}
