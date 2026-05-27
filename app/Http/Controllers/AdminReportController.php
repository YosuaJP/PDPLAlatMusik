<?php

namespace App\Http\Controllers;

use App\Models\Order;
use Illuminate\Http\Request;
use Inertia\Inertia;

class AdminReportController extends Controller
{
    public function index(Request $request)
    {
        $startDate = $request->input('start_date', now()->startOfMonth()->format('Y-m-d'));
        $endDate   = $request->input('end_date', now()->format('Y-m-d'));

        $query = Order::with(['user'])
            ->whereIn('status', ['processing', 'shipped', 'delivered', 'completed'])
            ->whereDate('created_at', '>=', $startDate)
            ->whereDate('created_at', '<=', $endDate)
            ->orderByDesc('created_at');

        $orders = $query->get()->map(fn($o) => [
            'order_id'     => $o->order_id,
            'created_at'   => $o->created_at->format('d/m/Y'),
            'customer'     => $o->user?->name ?? '—',
            'status'       => $o->status,
            'final_amount' => (float) $o->final_amount,
        ]);

        $totalRevenue    = $orders->sum('final_amount');
        $totalTransaksi  = $orders->count();

        return Inertia::render('AdminReport', [
            'orders'          => $orders,
            'total_revenue'   => $totalRevenue,
            'total_transaksi' => $totalTransaksi,
            'filters'         => [
                'start_date' => $startDate,
                'end_date'   => $endDate,
            ],
        ]);
    }
}
