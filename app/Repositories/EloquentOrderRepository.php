<?php

namespace App\Repositories;

use App\Contracts\OrderRepositoryInterface;
use App\Models\Order;
use App\Models\OrderStatusHistory;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Pagination\LengthAwarePaginator;

class EloquentOrderRepository implements OrderRepositoryInterface
{
    public function __construct(protected Order $model) {}

    /**
     * Ambil semua order dengan filter opsional.
     * Filter: status, user_id, start_date, end_date, per_page
     */
    public function getAll(array $filters = []): LengthAwarePaginator
    {
        $query = $this->model
            ->with(['user', 'items', 'payment'])
            ->orderByDesc('created_at');

        if (!empty($filters['status'])) {
            $query->where('status', $filters['status']);
        }

        if (!empty($filters['user_id'])) {
            $query->where('user_id', $filters['user_id']);
        }

        if (!empty($filters['start_date'])) {
            $query->whereDate('created_at', '>=', $filters['start_date']);
        }

        if (!empty($filters['end_date'])) {
            $query->whereDate('created_at', '<=', $filters['end_date']);
        }

        $perPage = $filters['per_page'] ?? 15;

        return $query->paginate($perPage);
    }

    /**
     * Cari order berdasarkan ID beserta relasi lengkap.
     */
    public function findById(int $id): ?Order
    {
        return $this->model->with([
            'user',
            'address',
            'promo',
            'items.product',
            'payment',
            'shipment',
            'statusHistories.changedBy',
        ])->find($id);
    }

    /**
     * Ambil semua order milik seorang user.
     */
    public function findByUserId(int $userId): Collection
    {
        return $this->model
            ->where('user_id', $userId)
            ->with(['items', 'payment', 'shipment'])
            ->orderByDesc('created_at')
            ->get();
    }

    /**
     * Buat order baru.
     */
    public function create(array $data): Order
    {
        return $this->model->create($data);
    }

    /**
     * Update status order & catat ke order_status_histories.
     */
    public function updateStatus(int $orderId, string $status, int $changedBy, string $note = null): bool
    {
        $order = $this->model->find($orderId);

        if (!$order) {
            return false;
        }

        $oldStatus = $order->status;

        $order->update(['status' => $status]);

        OrderStatusHistory::create([
            'order_id'   => $orderId,
            'changed_by' => $changedBy,
            'old_status' => $oldStatus,
            'new_status' => $status,
            'note'       => $note ?? "Status diperbarui ke {$status}",
            'changed_at' => now(),
        ]);

        return true;
    }

    /**
     * Batalkan order (shortcut ke updateStatus 'cancelled').
     */
    public function cancel(int $orderId, int $changedBy, string $reason = null): bool
    {
        return $this->updateStatus($orderId, 'cancelled', $changedBy, $reason ?? 'Order dibatalkan.');
    }

    /**
     * Ambil order beserta semua item-nya.
     */
    public function getWithItems(int $orderId): ?Order
    {
        return $this->model->with([
            'items.product.category',
            'payment',
            'shipment',
            'promo',
        ])->find($orderId);
    }

    /**
     * Ambil semua order dengan status 'pending'.
     */
    public function getPendingOrders(): Collection
    {
        return $this->model
            ->where('status', 'pending')
            ->with(['user', 'items', 'payment'])
            ->orderBy('created_at')
            ->get();
    }

    /**
     * Ambil order berdasarkan status tertentu.
     */
    public function getOrdersByStatus(string $status): Collection
    {
        return $this->model
            ->where('status', $status)
            ->with(['user', 'items'])
            ->orderByDesc('created_at')
            ->get();
    }

    /**
     * Ringkasan penjualan dalam rentang tanggal.
     * Return: total_orders, total_revenue, total_items_sold
     */
    public function getSalesSummary(string $startDate, string $endDate): array
    {
        $orders = $this->model
            ->whereIn('status', ['processing', 'shipped', 'delivered'])
            ->whereDate('created_at', '>=', $startDate)
            ->whereDate('created_at', '<=', $endDate)
            ->with('items')
            ->get();

        $totalRevenue   = $orders->sum('final_amount');
        $totalOrders    = $orders->count();
        $totalItemsSold = $orders->flatMap->items->sum('quantity');

        return [
            'total_orders'     => $totalOrders,
            'total_revenue'    => $totalRevenue,
            'total_items_sold' => $totalItemsSold,
            'start_date'       => $startDate,
            'end_date'         => $endDate,
        ];
    }
}
