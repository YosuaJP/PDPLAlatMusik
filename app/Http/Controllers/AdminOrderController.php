<?php

namespace App\Http\Controllers;

use App\Models\Order;
use App\Models\Refund;
use App\Models\Shipment;
use App\Models\OrderStatusHistory;
use Illuminate\Http\Request;
use Inertia\Inertia;

class AdminOrderController extends Controller
{
    public function index(Request $request)
    {
        $status = $request->input('status', 'all');
        $page   = $request->input('page', 1);

        $query = Order::with(['user', 'shipment', 'refunds', 'items.product'])
            ->orderByDesc('created_at');

        if ($status !== 'all') {
            if ($status === 'refund') {
                $query->whereHas('refunds');
            } else {
                $query->where('status', $status);
            }
        }

        $orders = $query->paginate(10)->withQueryString();

        $mapped = $orders->through(fn($o) => [
            'order_id'        => $o->order_id,
            'created_at'      => $o->created_at->format('d/n/Y'),
            'customer_name'   => $o->user?->name ?? '—',
            'customer_address'=> $o->shipping_address ?? '—',
            'final_amount'    => (float) $o->final_amount,
            'status'          => $o->status,
            'tracking_number' => $o->shipment?->tracking_number ?? null,
            'courier_code'    => strtoupper($o->courier_code ?? 'Kurir'),
            'has_refund'      => $o->refunds->isNotEmpty(),
            'refund_status'   => $o->refunds->first()?->status ?? null,
            'items'           => $o->items->map(fn($item) => [
                'product_name' => $item->product?->name ?? 'Produk Dihapus',
                'quantity'     => $item->quantity,
                'price'        => (float) $item->price,
                'image_url'    => $item->product?->image_url,
            ]),
        ]);

        return Inertia::render('AdminOrders', [
            'orders'  => $mapped,
            'filters' => ['status' => $status],
            'counts'  => [
                'all'        => Order::count(),
                'pending'    => Order::where('status', 'pending')->count(),
                'processing' => Order::where('status', 'processing')->count(),
                'shipped'    => Order::where('status', 'shipped')->count(),
                'delivered'  => Order::where('status', 'delivered')->count(),
                'completed'  => Order::where('status', 'completed')->count(),
                'refund'     => Refund::distinct('order_id')->count('order_id'),
            ],
        ]);
    }

    public function process(Request $request, $id)
    {
        $order = Order::findOrFail($id);

        $request->validate([
            'tracking_number' => 'required|string|max:100',
        ]);

        $oldStatus = $order->status;
        $order->update(['status' => 'shipped']);

        // Create or update shipment
        Shipment::updateOrCreate(
            ['order_id' => $order->order_id],
            [
                'tracking_number' => $request->tracking_number,
                'status'          => 'shipped',
            ]
        );

        // Log status history
        $user   = auth()->user();
        $userId = $user->user_id ?? $user->id;
        OrderStatusHistory::create([
            'order_id'   => $order->order_id,
            'old_status' => $oldStatus,
            'new_status' => 'shipped',
            'changed_by' => $userId,
            'changed_at' => now(),
            'note'       => 'Pesanan diproses dan dikirim. Resi: ' . $request->tracking_number,
        ]);

        return back()->with('success', 'Pesanan berhasil diproses.');
    }
}
