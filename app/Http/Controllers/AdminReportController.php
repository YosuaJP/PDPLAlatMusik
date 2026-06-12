<?php

namespace App\Http\Controllers;

use App\Models\Order;
use App\Services\ReportService;
use Illuminate\Http\Request;
use Inertia\Inertia;

class AdminReportController extends Controller
{
    protected ReportService $reportService;

    public function __construct(ReportService $reportService)
    {
        $this->reportService = $reportService;
    }

    public function index(Request $request)
    {
        $startDate = $request->input('start_date', now()->startOfMonth()->format('Y-m-d'));
        $endDate   = $request->input('end_date', now()->format('Y-m-d'));

        // 1. Ambil data transaksi dasar untuk tabel
        $query = Order::with(['user', 'payment'])
            ->whereIn('status', ['processing', 'shipped', 'delivered', 'completed'])
            ->whereDate('created_at', '>=', $startDate)
            ->whereDate('created_at', '<=', $endDate)
            ->orderByDesc('created_at');

        $orders = $query->get()->map(fn($o) => [
            'order_id'       => $o->order_id,
            'created_at'     => $o->created_at->format('d/m/Y'),
            'customer'       => $o->user?->name ?? '—',
            'status'         => $o->status,
            'final_amount'   => (float) $o->final_amount,
            'payment_method' => $o->payment->payment_method ?? '—',
            'gateway_fee'    => $o->payment ? (float) ($o->payment->gateway_fee ?? 0) : 0,
            'net_amount'     => $o->payment ? (float) ($o->final_amount - ($o->payment->gateway_fee ?? 0)) : (float) $o->final_amount,
        ]);

        // 2. Ambil ringkasan keuangan dan data grafik dari ReportService (Orang 1 & 2)
        $summary = $this->reportService->getFinancialSummary($startDate, $endDate);

        // Ambil server-side notifications jika ada (Orang 1)
        $notifications = [];
        $notificationsFile = 'server_notifications.json';
        if (\Illuminate\Support\Facades\Storage::exists($notificationsFile)) {
            try {
                $notifications = json_decode(\Illuminate\Support\Facades\Storage::get($notificationsFile), true) ?: [];
            } catch (\Exception $e) {
                $notifications = [];
            }
        }

        return Inertia::render('AdminReport', [
            'orders'             => $orders,
            'total_revenue'      => $summary['total_revenue'],
            'total_gateway_fee'  => $summary['total_gateway_fee'],
            'net_revenue'        => $summary['net_revenue'],
            'total_transaksi'    => $summary['total_transaksi'],
            'method_breakdown'   => $summary['method_breakdown'],
            'daily_data'         => $summary['daily_data'],
            'server_notifications' => $notifications,
            'filters'            => [
                'start_date' => $startDate,
                'end_date'   => $endDate,
            ],
        ]);
    }
}
