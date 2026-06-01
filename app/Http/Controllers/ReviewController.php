<?php

namespace App\Http\Controllers;

use App\Models\OrderItem;
use App\Models\Review;
use App\Models\OrderStatusHistory;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class ReviewController extends Controller
{
    /**
     * Menyimpan ulasan produk baru.
     */
    public function store(Request $request)
    {
        $user = auth()->user();
        $userId = $user->user_id ?? $user->id;

        $request->validate([
            'order_item_id' => 'required|integer',
            'rating'        => 'required|integer|min:1|max:5',
            'comment'       => 'nullable|string|max:1000',
        ]);

        // 1. Temukan order item dan pastikan milik user yang login
        $orderItem = OrderItem::with('order')->findOrFail($request->order_item_id);

        if ($orderItem->order->user_id !== $userId) {
            return back()->withErrors(['message' => 'Anda tidak memiliki akses untuk mengulas item ini.']);
        }

        // 2. Pastikan status order adalah 'delivered' atau 'completed' (Ulasan Terverifikasi)
        if (!in_array($orderItem->order->status, ['delivered', 'completed'])) {
            return back()->withErrors(['message' => 'Ulasan hanya dapat dikirim jika pesanan sudah diterima (delivered/completed).']);
        }

        // 3. Enforce UNIQUE(order_item_id) di tingkat database / application
        $exists = Review::where('order_item_id', $orderItem->order_item_id)->exists();
        if ($exists) {
            return back()->withErrors(['message' => 'Anda sudah memberikan ulasan untuk item pesanan ini.']);
        }

        DB::transaction(function () use ($orderItem, $request) {
            // 4. Isi product_id langsung dari order item untuk kueri cepat tanpa JOIN (memenuhi Orang 3)
            Review::create([
                'order_item_id' => $orderItem->order_item_id,
                'product_id'    => $orderItem->product_id, // otomatis aman dari tampering
                'rating'        => $request->rating,
                'comment'       => $request->comment,
                'created_at'    => now(),
                'updated_at'    => now(),
            ]);

            // 5. Otomatis ubah status order menjadi 'completed' jika status sebelumnya adalah 'delivered'
            $order = $orderItem->order;
            if ($order->status === 'delivered') {
                $oldStatus = $order->status;
                $order->update(['status' => 'completed']);

                OrderStatusHistory::create([
                    'order_id'   => $order->order_id,
                    'old_status' => $oldStatus,
                    'new_status' => 'completed',
                    'changed_by' => auth()->id() ?? $order->user_id,
                    'changed_at' => now(),
                    'note'       => 'Pesanan otomatis diselesaikan setelah pelanggan menulis ulasan.',
                ]);
            }
        });

        return back()->with('success', 'Terima kasih! Ulasan Anda berhasil disimpan.');
    }
}
