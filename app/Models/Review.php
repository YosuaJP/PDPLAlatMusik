<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Review extends Model
{
    protected $primaryKey = 'review_id';

    protected $fillable = [
        'order_item_id',
        'product_id',
        'rating',
        'comment',
        'image_urls',
        'video_url',
    ];

    protected function casts(): array
    {
        return [
            'image_urls' => 'array',
        ];
    }

    public function orderItem(): BelongsTo
    {
        return $this->belongsTo(OrderItem::class, 'order_item_id', 'order_item_id');
    }

    public function product(): BelongsTo
    {
        return $this->belongsTo(Product::class, 'product_id', 'product_id');
    }
}
