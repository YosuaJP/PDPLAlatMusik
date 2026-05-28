<?php

namespace App\Services;

use App\Models\Promo;
use App\Services\Discounts\FixedAmountDiscount;
use App\Services\Discounts\PercentageDiscount;
use Illuminate\Support\Carbon;

class PromoService
{
    /**
     * Memvalidasi apakah promo bisa digunakan berdasarkan kode dan subtotal.
     *
     * @param string $promoCode
     * @param float $subtotal
     * @return Promo
     * @throws \Exception
     */
    public function validatePromo(string $promoCode, float $subtotal): Promo
    {
        $promo = Promo::where('promo_code', strtoupper($promoCode))->first();

        if (!$promo) {
            throw new \Exception('Kode promo tidak ditemukan.');
        }

        if (!$promo->active) {
            throw new \Exception('Kode promo ini sudah tidak aktif.');
        }

        $now = Carbon::now();
        if ($promo->start_date && $now->lt($promo->start_date)) {
            throw new \Exception('Kode promo ini belum mulai berlaku.');
        }

        if ($promo->end_date && $now->gt($promo->end_date)) {
            throw new \Exception('Kode promo ini sudah kadaluarsa.');
        }

        if ($promo->min_purchase > 0 && $subtotal < $promo->min_purchase) {
            throw new \Exception('Total belanja Anda belum mencapai minimum (Rp ' . number_format($promo->min_purchase, 0, ',', '.') . ') untuk promo ini.');
        }

        return $promo;
    }

    /**
     * Menerapkan diskon berdasarkan tipe promo menggunakan Strategy Pattern.
     *
     * @param Promo $promo
     * @param float $subtotal
     * @return float Nilai diskon yang didapat
     */
    public function applyDiscount(Promo $promo, float $subtotal): float
    {
        if ($promo->promo_type === 'percent') {
            $strategy = new PercentageDiscount((float)$promo->discount_value, (float)$promo->max_discount_amount);
        } else {
            $strategy = new FixedAmountDiscount((float)$promo->discount_value);
        }

        return $strategy->calculate($subtotal);
    }

    /**
     * Menghitung preview estimasi promo untuk ditampilkan ke user (Cart/Checkout).
     *
     * @param string $promoCode
     * @param float $subtotal
     * @return array [success, message, discount_amount, final_amount, promo_id, promo_name, promo_code]
     */
    public function applyPromoPreview(string $promoCode, float $subtotal): array
    {
        try {
            $promo = $this->validatePromo($promoCode, $subtotal);
            $discountAmount = $this->applyDiscount($promo, $subtotal);
            $finalAmount = max(0, $subtotal - $discountAmount);

            return [
                'success' => true,
                'message' => 'Promo berhasil diterapkan.',
                'promo_id' => $promo->promo_id,
                'promo_code' => $promo->promo_code,
                'promo_name' => $promo->promo_name,
                'discount_amount' => $discountAmount,
                'final_amount' => $finalAmount,
            ];
        } catch (\Exception $e) {
            return [
                'success' => false,
                'message' => $e->getMessage(),
                'promo_id' => null,
                'promo_code' => null,
                'promo_name' => null,
                'discount_amount' => 0,
                'final_amount' => $subtotal,
            ];
        }
    }
}
