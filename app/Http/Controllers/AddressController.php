<?php

namespace App\Http\Controllers;

use App\Models\UserAddress;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class AddressController extends Controller
{
    public function store(Request $request)
    {
        $validated = $request->validate([
            'label' => 'required|string|max:100',
            'address' => 'required|string',
            'city' => 'required|string|max:100',
            'postal_code' => 'required|string|max:20',
            'is_default' => 'boolean',
        ]);

        $user = Auth::user();
        $userId = $user->user_id ?? $user->id;

        if ($validated['is_default'] ?? false) {
            UserAddress::where('user_id', $userId)->update(['is_default' => false]);
        }

        UserAddress::create([
            'user_id' => $userId,
            'label' => $validated['label'],
            'address' => $validated['address'],
            'city' => $validated['city'],
            'postal_code' => $validated['postal_code'],
            'is_default' => $validated['is_default'] ?? false,
            'created_at' => now(),
        ]);

        return back()->with('success', 'Alamat berhasil ditambahkan.');
    }

    public function update(Request $request, $id)
    {
        $validated = $request->validate([
            'label' => 'required|string|max:100',
            'address' => 'required|string',
            'city' => 'required|string|max:100',
            'postal_code' => 'required|string|max:20',
            'is_default' => 'boolean',
        ]);

        $user = Auth::user();
        $userId = $user->user_id ?? $user->id;

        $address = UserAddress::where('user_id', $userId)->where('address_id', $id)->firstOrFail();

        if ($validated['is_default'] ?? false) {
            UserAddress::where('user_id', $userId)->update(['is_default' => false]);
        }

        $address->update([
            'label' => $validated['label'],
            'address' => $validated['address'],
            'city' => $validated['city'],
            'postal_code' => $validated['postal_code'],
            'is_default' => $validated['is_default'] ?? false,
        ]);

        return back()->with('success', 'Alamat berhasil diperbarui.');
    }
}
