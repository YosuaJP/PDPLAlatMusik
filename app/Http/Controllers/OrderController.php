<?php

namespace App\Http\Controllers;

use App\Models\Order;
use Illuminate\Http\Request;
use Inertia\Inertia;

class OrderController extends Controller
{
    /**
     * Tampilkan riwayat pesanan pengguna.
     */
    public function index()
    {
        $user = auth()->user();
        $userId = $user->user_id ?? $user->id;

        $orders = Order::where('user_id', $userId)
            ->where('status', '!=', 'pending')
            ->with(['items.product', 'items.review', 'payment', 'refunds'])
            ->orderByDesc('created_at')
            ->get()
            ->map(function ($order) {
                return [
                    'order_id'          => $order->order_id,
                    'created_at'        => $order->created_at->translatedFormat('d F Y \p\u\k\u\l H:i'),
                    'created_at_raw'    => $order->created_at->toISOString(),
                    'final_amount'      => (float) $order->final_amount,
                    'status'            => $order->status,
                    'payment_external_id' => $order->payment->external_id ?? null,
                    'has_refund'        => $order->refunds->count() > 0,
                    'refund_status'     => $order->refunds->first()->status ?? null,
                    'items'             => $order->items->map(fn($item) => [
                        'order_item_id' => $item->order_item_id,
                        'product_id'   => $item->product_id,
                        'product_name' => $item->product_name,
                        'quantity'     => $item->quantity,
                        'price_each'   => (float) $item->price_each,
                        'image_url'    => $item->product->image_url ?? null,
                        'is_reviewed'  => $item->review !== null,
                        'review'       => $item->review ? [
                            'rating'     => $item->review->rating,
                            'comment'    => $item->review->comment,
                            'image_urls' => $item->review->image_urls,
                            'video_url'  => $item->review->video_url,
                        ] : null,
                    ]),
                    'all_reviewed'      => $order->items->every(fn($item) => $item->review !== null),
                ];
            });

        return Inertia::render('UserOrders', [
            'orders' => $orders,
        ]);
    }

    public function markAsReceived($id)
    {
        $user = auth()->user();
        $userId = $user->user_id ?? $user->id;

        $order = Order::where('user_id', $userId)->findOrFail($id);
        if ($order->status !== 'shipped') {
            return back()->withErrors(['message' => 'Hanya pesanan dalam pengiriman yang bisa diterima.']);
        }

        $order->update(['status' => 'delivered']);
        
        \App\Models\OrderStatusHistory::create([
            'order_id'   => $order->order_id,
            'old_status' => 'shipped',
            'new_status' => 'delivered',
            'changed_by' => $userId,
            'changed_at' => now(),
            'note'       => 'Pesanan diterima oleh pelanggan.',
        ]);

        return back()->with('success', 'Pesanan telah diterima.');
    }

    public function submitRefund(Request $request, $id, \App\Services\RefundService $refundService)
    {
        $user = auth()->user();
        $userId = $user->user_id ?? $user->id;

        // Block refund if all items have been reviewed
        $order = Order::with(['items', 'items.review'])->findOrFail($id);
        $allReviewed = $order->items->every(fn($item) => $item->review !== null);
        if ($allReviewed) {
            return back()->withErrors(['message' => 'Refund tidak dapat diajukan karena Anda sudah memberikan ulasan untuk semua barang.']);
        }

        $request->validate([
            'reason'   => 'required|string',
            'images.*' => 'image|max:2048', // max 2MB
            'images'   => 'max:3',
            'video'    => 'mimes:mp4,mov,avi,wmv|max:10240', // max 10MB
        ]);

        try {
            $refundService->submitRefund(
                $id,
                $userId,
                $request->reason,
                $request->file('images') ?: [],
                $request->file('video')
            );

            // Log refund submission to order status history
            \App\Models\OrderStatusHistory::create([
                'order_id'   => $id,
                'old_status' => $order->status,
                'new_status' => 'refund_requested',
                'changed_by' => $userId,
                'changed_at' => now(),
                'note'       => 'Pelanggan mengajukan permintaan refund.',
            ]);
        } catch (\Exception $e) {
            return back()->withErrors(['message' => $e->getMessage()]);
        }

        return back()->with('success', 'Permintaan refund berhasil diajukan.');
    }

    /**
     * Tampilkan detail status pesanan dan timeline.
     */
    public function show($id)
    {
        $user = auth()->user();
        $userId = $user->user_id ?? $user->id;

        // Ambil data order lengkap dengan relasi
        $order = Order::with([
            'items.product',
            'items.review',
            'payment',
            'shipment',
            'refunds',
            'statusHistories' => function($q) {
                $q->orderBy('changed_at', 'asc');
            },
            'statusHistories.changedBy',
            'address'
        ])->findOrFail($id);

        // Keamanan: Pastikan hanya pembuat order atau admin yang bisa mengakses
        if ($order->user_id !== $userId && $user->role !== 'admin') {
            abort(403, 'Anda tidak memiliki hak akses ke pesanan ini.');
        }

        // Format data detail pesanan untuk dilempar ke React
        $orderDetail = [
            'order_id'         => $order->order_id,
            'subtotal_amount'  => (float) $order->subtotal_amount,
            'discount_amount'  => (float) $order->discount_amount,
            'shipping_cost'    => (float) $order->shipping_cost,
            'final_amount'     => (float) $order->final_amount,
            'shipping_address' => $order->shipping_address,
            'courier_code'     => $order->courier_code,
            'status'           => $order->status,
            'notes'            => $order->notes,
            'created_at'       => $order->created_at->format('d M Y, H:i'),
            'items'            => $order->items->map(function ($item) {
                return [
                    'order_item_id' => $item->order_item_id,
                    'product_id'   => $item->product_id,
                    'product_name' => $item->product_name,
                    'quantity'     => $item->quantity,
                    'price_each'   => (float) $item->price_each,
                    'image_url'    => $item->product->image_url ?? null,
                    'is_reviewed'  => $item->review !== null,
                    'review'       => $item->review ? [
                        'rating'     => $item->review->rating,
                        'comment'    => $item->review->comment,
                        'image_urls' => $item->review->image_urls,
                        'video_url'  => $item->review->video_url,
                    ] : null,
                ];
            }),
            'payment'          => $order->payment ? [
                'payment_id'     => $order->payment->payment_id,
                'external_id'    => $order->payment->external_id,
                'payment_url'    => $order->payment->payment_url,
                'payment_status' => $order->payment->payment_status,
                'payment_method' => $order->payment->payment_method,
                'amount'         => (float) $order->payment->amount,
                'paid_at'        => $order->payment->paid_at ? $order->payment->paid_at->format('d M Y, H:i') : null,
            ] : null,
            'shipment'         => $order->shipment ? [
                'shipment_id'    => $order->shipment->shipment_id,
                'courier_name'   => $order->shipment->courier_name,
                'receipt_number' => $order->shipment->receipt_number,
                'status'         => $order->shipment->status,
            ] : null,
            'status_histories' => $order->statusHistories->map(function ($history) {
                return [
                    'id'          => $history->id,
                    'old_status'  => $history->old_status,
                    'new_status'  => $history->new_status,
                    'note'        => $history->note,
                    'changed_at'  => $history->changed_at ? $history->changed_at->format('d M Y, H:i') : '',
                    'changed_by'  => $history->changedBy->name ?? 'Sistem',
                ];
            }),
            'refund'           => $order->refunds->first() ? [
                'refund_id'        => $order->refunds->first()->refund_id,
                'status'           => $order->refunds->first()->status,
                'reason'           => $order->refunds->first()->reason,
                'rejection_reason' => $order->refunds->first()->rejection_reason,
                'created_at'       => $order->refunds->first()->created_at?->format('d M Y, H:i'),
                'updated_at'       => $order->refunds->first()->updated_at?->format('d M Y, H:i'),
            ] : null,
            'all_reviewed'     => $order->items->every(fn($item) => $item->review !== null),
        ];

        return Inertia::render('OrderStatus', [
            'order' => $orderDetail,
        ]);
    }
}
