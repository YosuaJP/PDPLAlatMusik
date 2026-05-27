<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Inertia\Inertia;

class AdminUserController extends Controller
{
    public function index(Request $request)
    {
        $role   = $request->input('role', 'all');
        $search = $request->input('search');

        $query = User::orderByDesc('created_at');

        if ($role !== 'all') {
            $query->where('role', $role);
        }

        if ($search) {
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                  ->orWhere('email', 'like', "%{$search}%")
                  ->orWhere('phone_number', 'like', "%{$search}%");
            });
        }

        $users = $query->paginate(15)->withQueryString();

        $mapped = $users->through(fn($u) => [
            'user_id'      => $u->user_id,
            'name'         => $u->name,
            'email'        => $u->email,
            'phone_number' => $u->phone_number,
            'role'         => $u->role,
            'status'       => $u->status,
            'created_at'   => $u->created_at->format('j F Y'),
        ]);

        return Inertia::render('AdminUser', [
            'users'   => $mapped,
            'filters' => [
                'role'   => $role,
                'search' => $search,
            ],
        ]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'name'         => 'required|string|max:255',
            'email'        => 'required|string|email|max:255|unique:users',
            'password'     => 'required|string|min:8',
            'role'         => 'required|string',
            'phone_number' => 'nullable|string|max:20',
            'status'       => 'required|string',
        ]);

        User::create([
            'name'         => $request->name,
            'email'        => $request->email,
            'password'     => bcrypt($request->password),
            'role'         => $request->role,
            'phone_number' => $request->phone_number,
            'status'       => $request->status,
        ]);

        return back()->with('success', 'Pengguna berhasil ditambahkan.');
    }

    public function update(Request $request, $id)
    {
        $user = User::findOrFail($id);

        $request->validate([
            'name'         => 'required|string|max:255',
            'email'        => 'required|string|email|max:255|unique:users,email,' . $user->user_id . ',user_id',
            'role'         => 'required|string',
            'phone_number' => 'nullable|string|max:20',
            'status'       => 'required|string',
            'password'     => 'nullable|string|min:8',
        ]);

        $data = [
            'name'         => $request->name,
            'email'        => $request->email,
            'role'         => $request->role,
            'phone_number' => $request->phone_number,
            'status'       => $request->status,
        ];

        if ($request->filled('password')) {
            $data['password'] = bcrypt($request->password);
        }

        $user->update($data);

        return back()->with('success', 'Data pengguna berhasil diperbarui.');
    }

    public function destroy($id)
    {
        User::findOrFail($id)->delete();
        return back()->with('success', 'Pengguna berhasil dihapus.');
    }
}
