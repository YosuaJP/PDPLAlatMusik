<?php

namespace App\Services\Discounts;

use App\Contracts\DiscountStrategyInterface;

class FixedAmountDiscount implements DiscountStrategyInterface
{
    private float $discountAmount;

    public function __construct(float $discountAmount)
    {
        $this->discountAmount = $discountAmount;
    }

    public function calculate(float $subtotal): float
    {
        // Diskon tidak boleh melebihi subtotal
        return min($this->discountAmount, $subtotal);
    }
}
