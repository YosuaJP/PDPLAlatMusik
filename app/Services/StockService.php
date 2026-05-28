<?php

namespace App\Services;

use App\Models\StockMovement;

class StockService
{
    /**
     * Mencatat pergerakan stok (in/out) untuk suatu produk.
     *
     * @param int $productId
     * @param int $createdBy
     * @param int|null $orderId
     * @param string $movementType 'in' or 'out'
     * @param int $quantity
     * @param string|null $notes
     * @return StockMovement
     */
    public function recordMovement(int $productId, int $createdBy, ?int $orderId, string $movementType, int $quantity, ?string $notes = null): StockMovement
    {
        return StockMovement::create([
            'product_id'    => $productId,
            'created_by'    => $createdBy,
            'order_id'      => $orderId,
            'movement_type' => $movementType,
            'quantity'      => $quantity,
            'notes'         => $notes,
            'created_at'    => now(),
        ]);
    }
}
