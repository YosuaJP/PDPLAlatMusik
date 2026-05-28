<?php

namespace App\Services;

use App\Models\Order;
use App\Models\Refund;

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
        if (!in_array($order->status, ['delivered', 'completed'])) {
            throw new \Exception('Refund hanya bisa diajukan untuk pesanan yang sudah selesai (completed/delivered).');
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
     *
     * @param int $refundId
     * @param string $action 'approve' or 'reject'
     * @param string|null $rejectionReason Required if action is 'reject'
     * @return Refund
     */
    public function processRefund(int $refundId, string $action, ?string $rejectionReason = null): Refund
    {
        $refund = Refund::findOrFail($refundId);

        if ($action === 'approve') {
            $refund->update(['status' => 'approved']);
            // Opsional: Integrasi payment gateway refund atau pengembalian stok bisa dilakukan di sini
        } else {
            $refund->update([
                'status' => 'rejected',
                'rejection_reason' => $rejectionReason,
            ]);
        }

        return $refund;
    }
}
