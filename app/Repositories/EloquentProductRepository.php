<?php

namespace App\Repositories;

use App\Contracts\ProductRepositoryInterface;
use App\Models\Product;
use App\Models\StockMovement;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Pagination\LengthAwarePaginator;

class EloquentProductRepository implements ProductRepositoryInterface
{
    public function __construct(protected Product $model) {}

    /**
     * Ambil semua produk dengan filter opsional.
     * Filter: category_id, active, search, per_page
     */
    public function getAll(array $filters = []): LengthAwarePaginator
    {
        $query = $this->model->with('category')->orderBy('name');

        if (!empty($filters['category_id'])) {
            $query->where('category_id', $filters['category_id']);
        }

        if (isset($filters['active'])) {
            $query->where('active', $filters['active']);
        }

        if (!empty($filters['search'])) {
            $query->where(function ($q) use ($filters) {
                $q->where('name', 'like', '%' . $filters['search'] . '%')
                  ->orWhere('sku', 'like', '%' . $filters['search'] . '%');
            });
        }

        $perPage = $filters['per_page'] ?? 15;

        return $query->paginate($perPage);
    }

    /**
     * Cari produk berdasarkan ID (dengan soft delete aman).
     */
    public function findById(int $id): ?Product
    {
        return $this->model->with(['category', 'reviews'])->find($id);
    }

    /**
     * Cari produk berdasarkan SKU.
     */
    public function findBySku(string $sku): ?Product
    {
        return $this->model->where('sku', $sku)->first();
    }

    /**
     * Buat produk baru.
     */
    public function create(array $data): Product
    {
        return $this->model->create($data);
    }

    /**
     * Update data produk.
     */
    public function update(int $id, array $data): bool
    {
        return $this->model->where('product_id', $id)->update($data);
    }

    /**
     * Soft delete produk.
     */
    public function delete(int $id): bool
    {
        return (bool) $this->model->where('product_id', $id)->delete();
    }

    /**
     * Ambil produk berdasarkan kategori.
     */
    public function getByCategory(int $categoryId): Collection
    {
        return $this->model
            ->where('category_id', $categoryId)
            ->where('active', true)
            ->orderBy('name')
            ->get();
    }

    /**
     * Ambil produk dengan stok rendah.
     */
    public function getLowStock(int $threshold = 5): Collection
    {
        return $this->model
            ->where('stock_qty', '<=', $threshold)
            ->where('active', true)
            ->orderBy('stock_qty')
            ->get();
    }

    /**
     * Pencarian produk berdasarkan nama atau SKU.
     */
    public function search(string $keyword): Collection
    {
        return $this->model
            ->where('active', true)
            ->where(function ($q) use ($keyword) {
                $q->where('name', 'like', '%' . $keyword . '%')
                  ->orWhere('sku', 'like', '%' . $keyword . '%')
                  ->orWhere('description', 'like', '%' . $keyword . '%');
            })
            ->with('category')
            ->limit(20)
            ->get();
    }

    /**
     * Update stok produk dan catat ke stock_movements.
     *
     * @param string $type 'in' | 'out' | 'adjustment'
     */
    public function updateStock(int $productId, int $quantity, string $type = 'out'): bool
    {
        $product = $this->findById($productId);

        if (!$product) {
            return false;
        }

        if ($type === 'out') {
            $product->decrement('stock_qty', abs($quantity));
        } elseif ($type === 'in') {
            $product->increment('stock_qty', abs($quantity));
        } else {
            // adjustment: langsung set ke nilai qty
            $product->update(['stock_qty' => $quantity]);
        }

        return true;
    }
}
