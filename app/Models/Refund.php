<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Refund extends Model
{
    protected $table = 'refunds';
    protected $primaryKey = 'refund_id';

    protected $fillable = [
        'order_id',
        'order_item_id',
        'reason',
        'status',
        'rejection_reason',
        'evidence_urls',
    ];

    public function order(): BelongsTo
    {
        return $this->belongsTo(Order::class, 'order_id', 'order_id');
    }

    public function orderItem(): BelongsTo
    {
        return $this->belongsTo(OrderItem::class, 'order_item_id', 'order_item_id');
    }
}
