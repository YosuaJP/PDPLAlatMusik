<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Payment extends Model
{
    protected $primaryKey = 'payment_id';
    public $timestamps = false;

    protected $fillable = [
        'order_id',
        'external_id',
        'gateway_ref',
        'payment_url',
        'payment_method',
        'gateway_status',
        'payment_status',
        'amount',
        'paid_amount',
        'gateway_fee',
        'webhook_payload',
        'expired_at',
        'paid_at',
        'created_at',
    ];

    protected function casts(): array
    {
        return [
            'amount'      => 'decimal:2',
            'paid_amount' => 'decimal:2',
            'gateway_fee' => 'decimal:2',
            'expired_at'  => 'datetime',
            'paid_at'     => 'datetime',
            'created_at'  => 'datetime',
        ];
    }

    public function order(): BelongsTo
    {
        return $this->belongsTo(Order::class, 'order_id', 'order_id');
    }
}
