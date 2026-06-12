<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\SoftDeletes;

class Product extends Model
{
    use SoftDeletes;

    protected $primaryKey = 'product_id';
    public $timestamps = false;

    protected $fillable = [
        'category_id',
        'name',
        'description',
        'price',
        'stock_qty',
        'sku',
        'image_url',
        'active',
        'updated_at',
    ];

    protected function casts(): array
    {
        return [
            'price'  => 'decimal:2',
            'active' => 'boolean',
        ];
    }

    protected $appends = ['avg_rating', 'total_sold'];

    public function getAvgRatingAttribute()
    {
        if (array_key_exists('reviews_avg_rating', $this->attributes)) {
            return (float) ($this->attributes['reviews_avg_rating'] ?? 0);
        }
        return (float) ($this->reviews()->where('rating', '>', 3)->avg('rating') ?? 0);
    }

    public function getTotalSoldAttribute()
    {
        if (array_key_exists('order_items_sum_quantity', $this->attributes)) {
            return (int) ($this->attributes['order_items_sum_quantity'] ?? 0);
        }
        return (int) ($this->orderItems()->whereHas('order.payment', function ($q) {
            $q->where('payment_status', 'paid');
        })->sum('quantity') ?? 0);
    }

    public function category(): BelongsTo
    {
        return $this->belongsTo(Category::class, 'category_id', 'category_id');
    }

    public function stockMovements(): HasMany
    {
        return $this->hasMany(StockMovement::class, 'product_id', 'product_id');
    }

    public function cartItems(): HasMany
    {
        return $this->hasMany(CartItem::class, 'product_id', 'product_id');
    }

    public function orderItems(): HasMany
    {
        return $this->hasMany(OrderItem::class, 'product_id', 'product_id');
    }

    public function reviews(): HasMany
    {
        return $this->hasMany(Review::class, 'product_id', 'product_id');
    }
}
