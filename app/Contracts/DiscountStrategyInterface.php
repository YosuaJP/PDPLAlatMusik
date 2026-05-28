<?php

namespace App\Contracts;

interface DiscountStrategyInterface
{
    /**
     * Menghitung nilai diskon berdasarkan subtotal.
     *
     * @param float $subtotal Total harga sebelum diskon.
     * @return float Nilai potongan (diskon).
     */
    public function calculate(float $subtotal): float;
}
