<?php

namespace App\Http\Controllers;

use App\Models\Refund;
use Illuminate\Http\Request;
use Inertia\Inertia;

class AdminRefundController extends Controller
{
    public function index(Request $request)
    {
        $status = $request->input('status', 'all');

        $query = Refund::with(['order.user', 'orderItem.product'])->orderByDesc('created_at');

        if ($status !== 'all') {
            $query->where('status', $status);
        }

        $refunds = $query->paginate(10)->withQueryString();

        $mapped = $refunds->through(fn($r) => [
            'refund_id'      => $r->refund_id,
            'order_id'       => $r->order_id,
            'customer_name'  => $r->order->user->name ?? '—',
            'customer_email' => $r->order->user->email ?? '—',
            'evidence_urls'  => $r->evidence_urls,
            'total'          => (float) $r->order->final_amount,
            'reason'         => $r->reason,
            'status'         => $r->status,
        ]);

        return Inertia::render('AdminRefund', [
            'refunds' => $mapped,
            'filters' => ['status' => $status],
        ]);
    }

    public function process(Request $request, $id, \App\Services\RefundService $refundService)
    {
        $request->validate([
            'action' => 'required|in:approve,reject',
            'reason' => 'required_if:action,reject|nullable|string|max:255',
        ]);

        $refundService->processRefund($id, $request->action, $request->reason);

        return back()->with('success', 'Status refund berhasil diperbarui.');
    }
}
