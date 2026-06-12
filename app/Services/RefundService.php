<?php

namespace App\Services;

use App\Models\Order;
use App\Models\Product;
use App\Models\Refund;
use App\Models\StockMovement;
use App\Models\OrderStatusHistory;
use Illuminate\Support\Facades\DB;

class RefundService
{
    /**
     * Submit a new refund request.
     *
     * @param int $orderId
     * @param int $userId
     * @param string $reason
     * @param array $images Array of uploaded image files
     * @param \Illuminate\Http\UploadedFile|null $video Uploaded video file
     * @return Refund
     * @throws \Exception
     */
    public function submitRefund(int $orderId, int $userId, string $reason, array $images = [], $video = null): Refund
    {
        $order = Order::where('user_id', $userId)->findOrFail($orderId);

        // Validasi status pesanan
        if (!in_array($order->status, ['shipped', 'delivered', 'completed'])) {
            throw new \Exception('Refund hanya bisa diajukan untuk pesanan yang sedang dikirim atau sudah selesai.');
        }

        if ($order->refunds()->exists()) {
            throw new \Exception('Anda sudah mengajukan refund untuk pesanan ini.');
        }

        $evidenceUrls = [];

        if (!empty($images)) {
            foreach ($images as $img) {
                $path = $img->store('refunds', 'public');
                $evidenceUrls[] = asset('storage/' . $path);
            }
        }

        if ($video) {
            $path = $video->store('refunds', 'public');
            $evidenceUrls[] = asset('storage/' . $path);
        }

        return Refund::create([
            'order_id'      => $order->order_id,
            'reason'        => $reason,
            'evidence_urls' => count($evidenceUrls) > 0 ? $evidenceUrls : null,
            'status'        => 'pending',
        ]);
    }

    /**
     * Process a refund (approve/reject).
     * On approve: restores stock for all order items and records stock movements.
     *
     * @param int $refundId
     * @param string $action 'approve' or 'reject'
     * @param string|null $rejectionReason Required if action is 'reject'
     * @return Refund
     */
    public function processRefund(int $refundId, string $action, ?string $rejectionReason = null): Refund
    {
        $refund  = Refund::with('order.items')->findOrFail($refundId);
        $adminId = auth()->id();
        $refNum  = 'REF-' . str_pad($refund->refund_id, 3, '0', STR_PAD_LEFT);

        if ($action === 'approve') {
            DB::transaction(function () use ($refund, $adminId, $refNum) {
                $refund->update(['status' => 'approved']);

                // ── Kembalikan stok untuk setiap barang dalam pesanan ──
                foreach ($refund->order->items as $item) {
                    $product = Product::lockForUpdate()->find($item->product_id);
                    if (!$product) continue;

                    // Tambah stok kembali
                    $product->increment('stock_qty', $item->quantity);

                    // Catat mutasi stok
                    StockMovement::create([
                        'product_id'    => $product->product_id,
                        'created_by'    => $adminId,
                        'order_id'      => $refund->order_id,
                        'movement_type' => 'refund_return',
                        'quantity'      => $item->quantity,
                        'notes'         => "Pengembalian stok dari {$refNum} — {$product->name} (+{$item->quantity} unit).",
                        'created_at'    => now(),
                    ]);
                }

                // Catat ke riwayat status pesanan
                OrderStatusHistory::create([
                    'order_id'   => $refund->order_id,
                    'old_status' => 'refund_requested',
                    'new_status' => 'refund_approved',
                    'changed_by' => $adminId,
                    'changed_at' => now(),
                    'note'       => "Permintaan refund ({$refNum}) disetujui oleh admin. Stok seluruh produk telah dikembalikan.",
                ]);
            });
        } else {
            DB::transaction(function () use ($refund, $rejectionReason, $adminId, $refNum) {
                $refund->update([
                    'status'           => 'rejected',
                    'rejection_reason' => $rejectionReason,
                ]);

                OrderStatusHistory::create([
                    'order_id'   => $refund->order_id,
                    'old_status' => 'refund_requested',
                    'new_status' => 'refund_rejected',
                    'changed_by' => $adminId,
                    'changed_at' => now(),
                    'note'       => "Permintaan refund ({$refNum}) ditolak oleh admin."
                                 . ($rejectionReason ? ' Alasan: ' . $rejectionReason : ''),
                ]);
            });
        }

        return $refund->fresh();
    }
}
