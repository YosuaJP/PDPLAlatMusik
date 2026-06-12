<?php
/**
 * @codecite
 * generator: Antigravity by Google DeepMind
 * project: NadaKito E-Commerce
 * frameworks: Laravel 11.x
 * description: Simulated Payment Gateway logic and Webhook handlers (Mocking Midtrans/Xendit).
 */

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
     * Halaman intermediate "Complete Your Payment" sebelum membuka Midtrans Snap.
     */
    public function checkoutPage($external_id)
    {
        $user = auth()->user();
        $userId = $user->user_id ?? $user->id;

        $payment = Payment::where('external_id', $external_id)
            ->with(['order.user', 'order.items.product'])
            ->firstOrFail();

        // Pastikan hanya pemilik order yang bisa akses
        if ($payment->order->user_id !== $userId) {
            abort(403, 'Anda tidak memiliki akses ke halaman ini.');
        }

        return Inertia::render('CheckoutPayment', [
            'payment' => [
                'payment_id'     => $payment->payment_id,
                'external_id'    => $payment->external_id,
                'amount'         => (float) $payment->amount,
                'payment_status' => $payment->payment_status,
                'payment_method' => $payment->payment_method,
                'snap_token'     => $payment->gateway_ref, // Snap Token dari Midtrans
                'payment_url'    => $payment->payment_url,
                'created_at'     => \Carbon\Carbon::parse($payment->created_at)->toISOString(),
                'order'          => [
                    'order_id'        => $payment->order->order_id,
                    'final_amount'    => (float) $payment->order->final_amount,
                    'shipping_address'=> $payment->order->shipping_address,
                    'user_name'       => $payment->order->user->name ?? 'Pembeli',
                    'items'           => $payment->order->items->map(function ($item) {
                        return [
                            'product_name' => $item->product_name,
                            'quantity'     => $item->quantity,
                            'price_each'   => (float) $item->price_each,
                            'image_url'    => $item->product->image_url ?? null,
                        ];
                    }),
                ],
            ],
            'clientKey' => config('services.midtrans.client_key'),
            'isSandbox'  => !config('services.midtrans.is_production', false),
        ]);
    }

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
                'payment_method' => $payment->payment_method,
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
            $gatewayName = ucfirst($payment->payment_method ?? 'gateway');

            if ($status === 'paid') {
                // 1. Update status Pembayaran
                $payment->update([
                    'payment_status' => 'paid',
                    'gateway_status' => 'SUCCESS',
                    'paid_amount'    => $payment->amount,
                    'gateway_fee'    => $payment->payment_method === 'midtrans' ? 4000.00 : 2500.00,
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
                    'note'       => "Pembayaran lunas dikonfirmasi otomatis melalui Simulasi {$gatewayName}.",
                    'changed_at' => now(),
                ]);

                // 4. Potong stok & catat mutasi setelah pembayaran dikonfirmasi
                foreach ($order->items as $item) {
                    $product = \App\Models\Product::lockForUpdate()->find($item->product_id);
                    if (!$product) continue;

                    $product->decrement('stock_qty', $item->quantity);

                    StockMovement::create([
                        'product_id'    => $product->product_id,
                        'created_by'    => auth()->id() ?? $order->user_id,
                        'order_id'      => $order->order_id,
                        'movement_type' => 'out',
                        'quantity'      => $item->quantity,
                        'notes'         => "Stok keluar: pembayaran pesanan ORD-" . str_pad($order->order_id, 8, '0', STR_PAD_LEFT) . " dikonfirmasi lunas.",
                        'created_at'    => now(),
                    ]);
                }

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
                    'note'       => "Pembayaran gagal atau kedaluwarsa melalui Simulasi {$gatewayName}. Pesanan dibatalkan.",
                    'changed_at' => now(),
                ]);
                // Stok tidak perlu dikembalikan karena belum pernah dipotong saat order dibuat.
            }
        });

        $message = $request->status === 'paid' 
            ? 'Pembayaran berhasil disimulasikan!' 
            : 'Pembayaran disimulasikan Gagal. Pesanan dibatalkan dan stok dikembalikan.';

        return redirect()->route('orders.show', $payment->order_id)
            ->with($request->status === 'paid' ? 'success' : 'error', $message);
    }

    /**
     * Menangani webhook respons dari Midtrans Sandbox/Production.
     */
    public function handleWebhook(Request $request)
    {
        $payload = $request->all();
        $externalId = $payload['order_id'] ?? null;
        if (!$externalId) {
            return response()->json(['message' => 'Invalid payload'], 400);
        }

        $payment = Payment::where('external_id', $externalId)
            ->with(['order.items.product'])
            ->first();

        if (!$payment) {
            return response()->json(['message' => 'Payment not found'], 404);
        }

        // Validasi signature key dari Midtrans
        $statusCode = $payload['status_code'] ?? '';
        $grossAmount = $payload['gross_amount'] ?? '';
        $signatureKey = $payload['signature_key'] ?? '';
        $serverKey = config('services.midtrans.server_key');

        // Bypass validasi pada testing atau local environment (untuk fitur Cheat Mock Webhook)
        $bypassSignature = (app()->environment('testing') || app()->isLocal()) && empty($signatureKey);

        if (!$bypassSignature && !empty($serverKey)) {
            $expectedSignature = hash('sha512', $externalId . $statusCode . $grossAmount . $serverKey);
            if ($signatureKey !== $expectedSignature) {
                return response()->json(['message' => 'Signature key tidak valid.'], 403);
            }
        }

        if ($payment->payment_status !== 'pending') {
            return response()->json(['message' => 'Payment already processed'], 200);
        }

        $transactionStatus = $payload['transaction_status'] ?? '';
        $fraudStatus = $payload['fraud_status'] ?? '';

        $paymentStatus = 'pending';
        $gatewayStatus = 'PENDING';

        if ($transactionStatus == 'capture') {
            if ($fraudStatus == 'challenge') {
                $paymentStatus = 'pending';
                $gatewayStatus = 'CHALLENGE';
            } else if ($fraudStatus == 'accept') {
                $paymentStatus = 'paid';
                $gatewayStatus = 'SUCCESS';
            }
        } else if ($transactionStatus == 'settlement') {
            $paymentStatus = 'paid';
            $gatewayStatus = 'SUCCESS';
        } else if (in_array($transactionStatus, ['cancel', 'deny', 'expire'])) {
            $paymentStatus = 'failed';
            $gatewayStatus = 'FAILED';
        } else if ($transactionStatus == 'pending') {
            $paymentStatus = 'pending';
            $gatewayStatus = 'PENDING';
        }

        if ($paymentStatus !== 'pending') {
            DB::transaction(function () use ($payment, $paymentStatus, $gatewayStatus, $payload) {
                $order = $payment->order;
                $oldOrderStatus = $order->status;

                if ($paymentStatus === 'paid') {
                    $payment->update([
                        'payment_status' => 'paid',
                        'gateway_status' => $gatewayStatus,
                        'paid_amount'    => $payment->amount,
                        'gateway_fee'    => 4000.00,
                        'paid_at'        => now(),
                        'webhook_payload'=> json_encode($payload),
                    ]);

                    $order->update(['status' => 'processing']);

                    OrderStatusHistory::create([
                        'order_id'   => $order->order_id,
                        'changed_by' => $order->user_id,
                        'old_status' => $oldOrderStatus,
                        'new_status' => 'processing',
                        'note'       => 'Pembayaran lunas dikonfirmasi otomatis melalui Webhook Midtrans.',
                        'changed_at' => now(),
                    ]);

                    // Potong stok & catat mutasi setelah pembayaran dikonfirmasi
                    foreach ($order->items as $item) {
                        $product = \App\Models\Product::lockForUpdate()->find($item->product_id);
                        if (!$product) continue;

                        $product->decrement('stock_qty', $item->quantity);

                        StockMovement::create([
                            'product_id'    => $product->product_id,
                            'created_by'    => $order->user_id,
                            'order_id'      => $order->order_id,
                            'movement_type' => 'out',
                            'quantity'      => $item->quantity,
                            'notes'         => "Stok keluar: pembayaran pesanan ORD-" . str_pad($order->order_id, 8, '0', STR_PAD_LEFT) . " dikonfirmasi lunas via Midtrans.",
                            'created_at'    => now(),
                        ]);
                    }
                } else {
                    $payment->update([
                        'payment_status' => 'failed',
                        'gateway_status' => $gatewayStatus,
                        'paid_amount'    => 0.00,
                        'webhook_payload'=> json_encode($payload),
                    ]);

                    $order->update(['status' => 'cancelled']);

                    OrderStatusHistory::create([
                        'order_id'   => $order->order_id,
                        'changed_by' => $order->user_id,
                        'old_status' => $oldOrderStatus,
                        'new_status' => 'cancelled',
                        'note'       => 'Pembayaran gagal/dibatalkan melalui Webhook Midtrans. Pesanan dibatalkan.',
                        'changed_at' => now(),
                    ]);
                    // Stok tidak perlu dikembalikan karena belum pernah dipotong saat order dibuat.
                }
            });
        }

        return response()->json(['message' => 'Callback processed successfully']);
    }

    /**
     * Menangani webhook/callback dari Xendit (Invoice API).
     * Xendit mengirim POST ke endpoint ini saat status pembayaran berubah.
     */
    public function handleXenditWebhook(Request $request)
    {
        // 1. Verifikasi X-CALLBACK-TOKEN dari header
        $incomingToken = $request->header('x-callback-token', '');
        $callbackToken = config('services.xendit.callback_token', '');

        // Jika token sudah diset, wajib cocok
        if (!empty($callbackToken) && !hash_equals($callbackToken, $incomingToken)) {
            return response()->json(['message' => 'Unauthorized: Invalid callback token.'], 403);
        }

        $payload = $request->all();

        // 2. Ambil external_id dari payload Xendit
        $externalId = $payload['external_id'] ?? null;
        if (!$externalId) {
            return response()->json(['message' => 'Invalid payload: missing external_id.'], 400);
        }

        // 3. Cari data payment di database
        $payment = Payment::where('external_id', $externalId)
            ->with(['order.items.product'])
            ->first();

        if (!$payment) {
            return response()->json(['message' => 'Payment not found.'], 404);
        }

        if ($payment->payment_status !== 'pending') {
            return response()->json(['message' => 'Payment already processed.'], 200);
        }

        // 4. Map status Xendit → status internal
        // Xendit status: PAID, SETTLED, EXPIRED
        $xenditStatus   = strtoupper($payload['status'] ?? '');
        $paymentStatus  = 'pending';
        $gatewayStatus  = 'PENDING';

        if (in_array($xenditStatus, ['PAID', 'SETTLED'])) {
            $paymentStatus = 'paid';
            $gatewayStatus = 'SUCCESS';
        } elseif ($xenditStatus === 'EXPIRED') {
            $paymentStatus = 'failed';
            $gatewayStatus = 'EXPIRED';
        }

        // 5. Proses update jika status sudah final
        if ($paymentStatus !== 'pending') {
            DB::transaction(function () use ($payment, $paymentStatus, $gatewayStatus, $payload) {
                $order         = $payment->order;
                $oldOrderStatus = $order->status;

                if ($paymentStatus === 'paid') {
                    $payment->update([
                        'payment_status'  => 'paid',
                        'gateway_status'  => $gatewayStatus,
                        'paid_amount'     => $payment->amount,
                        'gateway_fee'     => $payload['fees_paid_amount'] ?? 0,
                        'paid_at'         => now(),
                        'webhook_payload' => json_encode($payload),
                    ]);

                    $order->update(['status' => 'processing']);

                    OrderStatusHistory::create([
                        'order_id'   => $order->order_id,
                        'changed_by' => $order->user_id,
                        'old_status' => $oldOrderStatus,
                        'new_status' => 'processing',
                        'note'       => 'Pembayaran lunas dikonfirmasi otomatis melalui Webhook Xendit (Status: ' . $payload['status'] . ').',
                        'changed_at' => now(),
                    ]);

                    // Potong stok & catat mutasi setelah pembayaran dikonfirmasi
                    foreach ($order->items as $item) {
                        $product = \App\Models\Product::lockForUpdate()->find($item->product_id);
                        if (!$product) continue;

                        $product->decrement('stock_qty', $item->quantity);

                        StockMovement::create([
                            'product_id'    => $product->product_id,
                            'created_by'    => $order->user_id,
                            'order_id'      => $order->order_id,
                            'movement_type' => 'out',
                            'quantity'      => $item->quantity,
                            'notes'         => "Stok keluar: pembayaran pesanan ORD-" . str_pad($order->order_id, 8, '0', STR_PAD_LEFT) . " dikonfirmasi lunas via Xendit.",
                            'created_at'    => now(),
                        ]);
                    }

                } else {
                    $payment->update([
                        'payment_status'  => 'failed',
                        'gateway_status'  => $gatewayStatus,
                        'paid_amount'     => 0.00,
                        'webhook_payload' => json_encode($payload),
                    ]);

                    $order->update(['status' => 'cancelled']);

                    OrderStatusHistory::create([
                        'order_id'   => $order->order_id,
                        'changed_by' => $order->user_id,
                        'old_status' => $oldOrderStatus,
                        'new_status' => 'cancelled',
                        'note'       => 'Invoice Xendit kedaluwarsa (EXPIRED). Pesanan otomatis dibatalkan.',
                        'changed_at' => now(),
                    ]);
                    // Stok tidak perlu dikembalikan karena belum pernah dipotong saat order dibuat.
                }
            });
        }

        return response()->json(['message' => 'Xendit webhook processed successfully.'], 200);
    }
}
