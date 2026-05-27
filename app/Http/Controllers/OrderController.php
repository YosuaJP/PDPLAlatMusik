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
            ->with(['items', 'payment'])
            ->orderByDesc('created_at')
            ->get()
            ->map(function ($order) {
                return [
                    'order_id'          => $order->order_id,
                    'created_at'        => $order->created_at->format('d M Y, H:i'),
                    'created_at_raw'    => $order->created_at->toISOString(), // untuk countdown
                    'final_amount'      => (float) $order->final_amount,
                    'status'            => $order->status,
                    'items_count'       => $order->items->sum('quantity'),
                    'payment_status'    => $order->payment->payment_status ?? 'pending',
                    'payment_external_id' => $order->payment->external_id ?? null, // untuk resume payment
                ];
            });

        return Inertia::render('UserDashboard', [
            // Kita bisa bagikan data order ke UserDashboard agar dinamis!
            'orders' => $orders,
        ]);
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
            'payment',
            'shipment',
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
        ];

        return Inertia::render('OrderStatus', [
            'order' => $orderDetail,
        ]);
    }
}
