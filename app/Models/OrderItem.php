<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasOne;

class OrderItem extends Model
{
    protected $table = 'order_items';
    protected $primaryKey = 'order_item_id';
    public $timestamps = false;

    protected $fillable = [
        'order_id',
        'product_id',
        'product_name',
        'quantity',
        'price_each',
    ];

    protected function casts(): array
    {
        return [
            'price_each' => 'decimal:2',
        ];
    }

    public function order(): BelongsTo
    {
        return $this->belongsTo(Order::class, 'order_id', 'order_id');
    }

    public function product(): BelongsTo
    {
        return $this->belongsTo(Product::class, 'product_id', 'product_id');
    }

    public function review(): HasOne
    {
        return $this->hasOne(Review::class, 'order_item_id', 'order_item_id');
    }

    public function refund(): HasOne
    {
        return $this->hasOne(Refund::class, 'order_item_id', 'order_item_id');
    }
}
