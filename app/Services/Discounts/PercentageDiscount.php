<?php

namespace App\Services\Discounts;

use App\Contracts\DiscountStrategyInterface;

class PercentageDiscount implements DiscountStrategyInterface
{
    private float $percentage;
    private float $maxCap;

    public function __construct(float $percentage, float $maxCap = 0)
    {
        $this->percentage = $percentage;
        $this->maxCap = $maxCap;
    }

    public function calculate(float $subtotal): float
    {
        $discount = ($subtotal * $this->percentage) / 100;

        if ($this->maxCap > 0) {
            $discount = min($discount, $this->maxCap);
        }

        // Diskon tidak boleh melebihi subtotal
        return min($discount, $subtotal);
    }
}
