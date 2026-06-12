<?php

namespace App\Http\Controllers;

use App\Models\Category;
use App\Models\Product;
use App\Models\Promo;
use Illuminate\Http\Request;
use Inertia\Inertia;

class AdminPromoController extends Controller
{
    public function index()
    {
        $promos = Promo::orderByDesc('promo_id')->get();

        return Inertia::render('AdminPromo', [
            'promos'     => $promos,
            'categories' => Category::where('active', true)->orderBy('category_name')->get(['category_id', 'category_name']),
            'products'   => Product::where('active', true)->orderBy('name')->get(['product_id', 'name']),
        ]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'promo_code'          => 'required|string|max:50|unique:promos,promo_code',
            'promo_name'          => 'required|string|max:255',
            'promo_type'          => 'required|in:fixed,percent,free_shipping',
            'discount_value'      => 'required_unless:promo_type,free_shipping|numeric|min:0|nullable',
            'max_discount_amount' => 'nullable|numeric|min:0',
            'min_purchase'        => 'nullable|numeric|min:0',
            'start_date'          => 'required|date',
            'end_date'            => 'required|date|after_or_equal:start_date',
            'active'              => 'boolean',
            'scope'               => 'required|in:global,category,product',
            'scope_category_ids'  => 'nullable|array',
            'scope_product_ids'   => 'nullable|array',
            'quota'               => 'nullable|integer|min:1',
        ]);

        Promo::create([
            'promo_code'          => strtoupper($request->promo_code),
            'promo_name'          => $request->promo_name,
            'promo_type'          => $request->promo_type,
            'discount_value'      => $request->promo_type === 'free_shipping' ? 0 : $request->discount_value,
            'max_discount_amount' => $request->max_discount_amount ?? 0,
            'min_purchase'        => $request->min_purchase ?? 0,
            'start_date'          => $request->start_date,
            'end_date'            => $request->end_date,
            'active'              => $request->boolean('active', true),
            'scope'               => $request->scope ?? 'global',
            'scope_category_ids'  => $request->scope === 'category' ? $request->scope_category_ids : null,
            'scope_product_ids'   => $request->scope === 'product'  ? $request->scope_product_ids  : null,
            'quota'               => $request->quota,
        ]);

        return back()->with('success', 'Promo berhasil ditambahkan.');
    }

    public function update(Request $request, $id)
    {
        $promo = Promo::findOrFail($id);

        $request->validate([
            'promo_code'          => 'required|string|max:50|unique:promos,promo_code,' . $id . ',promo_id',
            'promo_name'          => 'required|string|max:255',
            'promo_type'          => 'required|in:fixed,percent,free_shipping',
            'discount_value'      => 'required_unless:promo_type,free_shipping|numeric|min:0|nullable',
            'max_discount_amount' => 'nullable|numeric|min:0',
            'min_purchase'        => 'nullable|numeric|min:0',
            'start_date'          => 'required|date',
            'end_date'            => 'required|date|after_or_equal:start_date',
            'active'              => 'boolean',
            'scope'               => 'required|in:global,category,product',
            'scope_category_ids'  => 'nullable|array',
            'scope_product_ids'   => 'nullable|array',
            'quota'               => 'nullable|integer|min:1',
        ]);

        $promo->update([
            'promo_code'          => strtoupper($request->promo_code),
            'promo_name'          => $request->promo_name,
            'promo_type'          => $request->promo_type,
            'discount_value'      => $request->promo_type === 'free_shipping' ? 0 : $request->discount_value,
            'max_discount_amount' => $request->max_discount_amount ?? 0,
            'min_purchase'        => $request->min_purchase ?? 0,
            'start_date'          => $request->start_date,
            'end_date'            => $request->end_date,
            'active'              => $request->boolean('active'),
            'scope'               => $request->scope ?? 'global',
            'scope_category_ids'  => $request->scope === 'category' ? $request->scope_category_ids : null,
            'scope_product_ids'   => $request->scope === 'product'  ? $request->scope_product_ids  : null,
            'quota'               => $request->quota,
        ]);

        return back()->with('success', 'Promo berhasil diperbarui.');
    }

    public function toggleActive($id)
    {
        $promo = Promo::findOrFail($id);
        $promo->update(['active' => !$promo->active]);

        return back()->with('success', 'Status promo diperbarui.');
    }

    public function destroy($id)
    {
        Promo::findOrFail($id)->delete();

        return back()->with('success', 'Promo berhasil dihapus.');
    }
}
