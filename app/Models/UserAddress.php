<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class UserAddress extends Model
{
    protected $primaryKey = 'address_id';
    public $timestamps = false;

    protected $fillable = [
        'user_id',
        'label',
        'address',
        'city',
        'postal_code',
        'is_default',
        'created_at',
    ];

    protected function casts(): array
    {
        return [
            'is_default' => 'boolean',
        ];
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class, 'user_id', 'user_id');
    }

    public function orders(): HasMany
    {
        return $this->hasMany(Order::class, 'address_id', 'address_id');
    }
}
