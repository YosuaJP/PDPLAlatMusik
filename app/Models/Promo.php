<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Promo extends Model
{
    protected $primaryKey = 'promo_id';

    protected $fillable = [
        'promo_code',
        'promo_name',
        'promo_type',
        'discount_value',
        'max_discount_amount',
        'min_purchase',
        'start_date',
        'end_date',
        'active',
        'scope',
        'scope_category_ids',
        'scope_product_ids',
        'quota',
        'used_quota',
    ];

    protected function casts(): array
    {
        return [
            'active'              => 'boolean',
            'start_date'          => 'datetime',
            'end_date'            => 'datetime',
            'discount_value'      => 'decimal:2',
            'max_discount_amount' => 'decimal:2',
            'min_purchase'        => 'decimal:2',
            'scope_category_ids'  => 'array',
            'scope_product_ids'   => 'array',
            'quota'               => 'integer',
            'used_quota'          => 'integer',
        ];
    }

    public function carts(): HasMany
    {
        return $this->hasMany(Cart::class, 'promo_id', 'promo_id');
    }

    public function orders(): HasMany
    {
        return $this->hasMany(Order::class, 'promo_id', 'promo_id');
    }
}
