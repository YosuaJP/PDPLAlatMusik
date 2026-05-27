<?php

namespace App\Http\Controllers;

use App\Models\Promo;
use Illuminate\Http\Request;
use Inertia\Inertia;

class AdminPromoController extends Controller
{
    public function index()
    {
        $promos = Promo::orderByDesc('promo_id')->get();

        return Inertia::render('AdminPromo', [
            'promos' => $promos,
        ]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'promo_code'          => 'required|string|max:50|unique:promos,promo_code',
            'promo_name'          => 'required|string|max:255',
            'promo_type'          => 'required|in:fixed,percent',
            'discount_value'      => 'required|numeric|min:0',
            'max_discount_amount' => 'nullable|numeric|min:0',
            'min_purchase'        => 'nullable|numeric|min:0',
            'start_date'          => 'required|date',
            'end_date'            => 'required|date|after_or_equal:start_date',
            'active'              => 'boolean',
        ]);

        Promo::create([
            'promo_code'          => strtoupper($request->promo_code),
            'promo_name'          => $request->promo_name,
            'promo_type'          => $request->promo_type,
            'discount_value'      => $request->discount_value,
            'max_discount_amount' => $request->max_discount_amount ?? 0,
            'min_purchase'        => $request->min_purchase ?? 0,
            'start_date'          => $request->start_date,
            'end_date'            => $request->end_date,
            'active'              => $request->boolean('active', true),
        ]);

        return back()->with('success', 'Promo berhasil ditambahkan.');
    }

    public function update(Request $request, $id)
    {
        $promo = Promo::findOrFail($id);

        $request->validate([
            'promo_code'          => 'required|string|max:50|unique:promos,promo_code,' . $id . ',promo_id',
            'promo_name'          => 'required|string|max:255',
            'promo_type'          => 'required|in:fixed,percent',
            'discount_value'      => 'required|numeric|min:0',
            'max_discount_amount' => 'nullable|numeric|min:0',
            'min_purchase'        => 'nullable|numeric|min:0',
            'start_date'          => 'required|date',
            'end_date'            => 'required|date|after_or_equal:start_date',
            'active'              => 'boolean',
        ]);

        $promo->update([
            'promo_code'          => strtoupper($request->promo_code),
            'promo_name'          => $request->promo_name,
            'promo_type'          => $request->promo_type,
            'discount_value'      => $request->discount_value,
            'max_discount_amount' => $request->max_discount_amount ?? 0,
            'min_purchase'        => $request->min_purchase ?? 0,
            'start_date'          => $request->start_date,
            'end_date'            => $request->end_date,
            'active'              => $request->boolean('active'),
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
