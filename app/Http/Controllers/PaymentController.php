<?php

namespace App\Http\Controllers;

use App\Models\Order;
use App\Models\OrderStatusHistory;
use App\Models\Payment;
use App\Models\StockMovement;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class PaymentController extends Controller
{
    /**
     * Tampilkan halaman simulasi pembayaran.
     */
    public function simulate($external_id)
    {
        $payment = Payment::where('external_id', $external_id)
            ->with(['order.user', 'order.items.product'])
            ->firstOrFail();

        return Inertia::render('SimulatePayment', [
            'payment' => [
                'payment_id'     => $payment->payment_id,
                'external_id'    => $payment->external_id,
                'amount'         => (float) $payment->amount,
                'payment_status' => $payment->payment_status,
                'order'          => [
                    'order_id'        => $payment->order->order_id,
                    'subtotal_amount' => (float) $payment->order->subtotal_amount,
                    'discount_amount' => (float) $payment->order->discount_amount,
                    'shipping_cost'   => (float) $payment->order->shipping_cost,
                    'final_amount'    => (float) $payment->order->final_amount,
                    'shipping_address'=> $payment->order->shipping_address,
                    'notes'           => $payment->order->notes,
                    'user_name'       => $payment->order->user->name ?? 'Pembeli',
                    'items'           => $payment->order->items->map(function ($item) {
                        return [
                            'product_name' => $item->product_name,
                            'quantity'     => $item->quantity,
                            'price_each'   => (float) $item->price_each,
                        ];
                    }),
                ],
            ],
        ]);
    }

    /**
     * Proses eksekusi simulasi pembayaran (Sukses / Gagal).
     */
    public function processSimulate(Request $request, $external_id)
    {
        $request->validate([
            'status' => 'required|in:paid,failed',
        ]);

        $payment = Payment::where('external_id', $external_id)
            ->with(['order.items.product'])
            ->firstOrFail();

        if ($payment->payment_status !== 'pending') {
            return redirect()->route('orders.show', $payment->order_id)
                ->with('error', 'Pembayaran ini sudah diproses sebelumnya.');
        }

        DB::transaction(function () use ($payment, $request) {
            $order = $payment->order;
            $oldOrderStatus = $order->status;
            $status = $request->status;

            if ($status === 'paid') {
                // 1. Update status Pembayaran
                $payment->update([
                    'payment_status' => 'paid',
                    'gateway_status' => 'SUCCESS',
                    'paid_amount'    => $payment->amount,
                    'gateway_fee'    => 2500.00, // Simulasi fee Xendit
                    'paid_at'        => now(),
                ]);

                // 2. Update status Pesanan ke processing
                $order->update([
                    'status' => 'processing',
                ]);

                // 3. Catat riwayat status
                OrderStatusHistory::create([
                    'order_id'   => $order->order_id,
                    'changed_by' => auth()->id() ?? $order->user_id,
                    'old_status' => $oldOrderStatus,
                    'new_status' => 'processing',
                    'note'       => 'Pembayaran lunas dikonfirmasi otomatis melalui Simulasi Xendit.',
                    'changed_at' => now(),
                ]);

            } else {
                // Status: failed / expired
                // 1. Update status Pembayaran
                $payment->update([
                    'payment_status' => 'failed',
                    'gateway_status' => 'FAILED',
                    'paid_amount'    => 0.00,
                ]);

                // 2. Update status Pesanan ke cancelled
                $order->update([
                    'status' => 'cancelled',
                ]);

                // 3. Catat riwayat status
                OrderStatusHistory::create([
                    'order_id'   => $order->order_id,
                    'changed_by' => auth()->id() ?? $order->user_id,
                    'old_status' => $oldOrderStatus,
                    'new_status' => 'cancelled',
                    'note'       => 'Pembayaran gagal atau kedaluwarsa melalui Simulasi Xendit.',
                    'changed_at' => now(),
                ]);

                // 4. KEMBALIKAN STOK yang sempat dipotong
                foreach ($order->items as $item) {
                    $product = $item->product;
                    $product->increment('stock_qty', $item->quantity);

                    // Catat mutasi penambahan stok kembali (Adjustment / Cancel)
                    StockMovement::create([
                        'product_id'    => $product->product_id,
                        'created_by'    => auth()->id() ?? $order->user_id,
                        'order_id'      => $order->order_id,
                        'movement_type' => 'in',
                        'quantity'      => $item->quantity,
                        'notes'         => "Pengembalian stok karena kegagalan pembayaran pesanan #{$order->order_id}",
                        'created_at'    => now(),
                    ]);
                }
            }
        });

        $message = $request->status === 'paid' 
            ? 'Pembayaran berhasil disimulasikan!' 
            : 'Pembayaran disimulasikan Gagal. Pesanan dibatalkan dan stok dikembalikan.';

        return redirect()->route('orders.show', $payment->order_id)
            ->with($request->status === 'paid' ? 'success' : 'error', $message);
    }
}
