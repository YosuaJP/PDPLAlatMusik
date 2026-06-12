<?php
/**
 * @codecite
 * generator: Antigravity by Google DeepMind
 * project: NadaKito E-Commerce
 * frameworks: Laravel 11.x
 * description: Implementation of Strategy Pattern for promo discount calculations.
 */

namespace App\Services;

use App\Models\Promo;
use App\Services\Discounts\FixedAmountDiscount;
use App\Services\Discounts\PercentageDiscount;
use Illuminate\Support\Carbon;

class PromoService
{
    /**
     * Memvalidasi apakah promo bisa digunakan dan mengembalikan subtotal yang relevan (Opsi B).
     * $cartItems: array of ['product_id' => int, 'category_id' => int|null, 'price_each' => float, 'quantity' => int]
     *
     * @param string $promoCode
     * @param float $totalSubtotal  — total seluruh cart (untuk min_purchase global)
     * @param array $cartItems      — item-item di cart, untuk scope & min_purchase per-item
     * @return array [promo, applicable_subtotal]
     * @throws \Exception
     */
    public function validatePromo(string $promoCode, float $totalSubtotal, array $cartItems = []): array
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

        if (!is_null($promo->quota) && $promo->used_quota >= $promo->quota) {
            throw new \Exception('Kuota penggunaan promo ini sudah habis.');
        }

        $scope = $promo->scope ?? 'global';

        // --- Hitung applicable_subtotal berdasarkan scope (Opsi B) ---
        $applicableSubtotal = $totalSubtotal; // default: global

        if ($scope === 'category' && !empty($promo->scope_category_ids) && !empty($cartItems)) {
            $targetCategoryIds = $promo->scope_category_ids;
            $matchingItems = array_filter($cartItems, fn($item) =>
                in_array($item['category_id'] ?? null, $targetCategoryIds)
            );

            if (empty($matchingItems)) {
                throw new \Exception('Promo ini hanya berlaku untuk kategori tertentu yang tidak ada di keranjang Anda.');
            }

            // Opsi B: hitung subtotal hanya dari item yang sesuai kategori
            $applicableSubtotal = array_reduce($matchingItems, fn($sum, $item) =>
                $sum + ($item['price_each'] * $item['quantity']), 0
            );

        } elseif ($scope === 'product' && !empty($promo->scope_product_ids) && !empty($cartItems)) {
            $targetProductIds = $promo->scope_product_ids;
            $matchingItems = array_filter($cartItems, fn($item) =>
                in_array($item['product_id'] ?? null, $targetProductIds)
            );

            if (empty($matchingItems)) {
                throw new \Exception('Promo ini hanya berlaku untuk produk tertentu yang tidak ada di keranjang Anda.');
            }

            // Opsi B: hitung subtotal hanya dari item produk yang sesuai
            $applicableSubtotal = array_reduce($matchingItems, fn($sum, $item) =>
                $sum + ($item['price_each'] * $item['quantity']), 0
            );
        }

        // --- Cek min_purchase terhadap applicable_subtotal ---
        if ($promo->min_purchase > 0 && $applicableSubtotal < $promo->min_purchase) {
            $scope_label = match($scope) {
                'category' => ' dari kategori yang berlaku',
                'product'  => ' dari produk yang berlaku',
                default    => '',
            };
            throw new \Exception(
                'Total belanja Anda' . $scope_label . ' belum mencapai minimum (Rp ' .
                number_format($promo->min_purchase, 0, ',', '.') . ') untuk promo ini.'
            );
        }

        return [$promo, $applicableSubtotal];
    }

    /**
     * Menerapkan diskon berdasarkan tipe promo menggunakan Strategy Pattern.
     * Diskon dihitung dari $applicableSubtotal (Opsi B).
     */
    public function applyDiscount(Promo $promo, float $applicableSubtotal): float
    {
        if ($promo->promo_type === 'free_shipping') {
            return 0; // Discount applied to shipping cost elsewhere
        } elseif ($promo->promo_type === 'percent') {
            $strategy = new PercentageDiscount((float)$promo->discount_value, (float)$promo->max_discount_amount);
        } else {
            $strategy = new FixedAmountDiscount((float)$promo->discount_value);
        }

        return $strategy->calculate($applicableSubtotal);
    }

    /**
     * Preview estimasi promo untuk Cart/Checkout.
     *
     * @param string $promoCode
     * @param float $subtotal          — total seluruh cart
     * @param array $cartItems         — detail item di cart (product_id, category_id, price_each, quantity)
     * @return array [success, message, discount_amount, final_amount, promo_id, promo_name, promo_code]
     */
    public function applyPromoPreview(string $promoCode, float $subtotal, array $cartItems = []): array
    {
        try {
            [$promo, $applicableSubtotal] = $this->validatePromo($promoCode, $subtotal, $cartItems);
            $discountAmount = $this->applyDiscount($promo, $applicableSubtotal);
            $finalAmount = max(0, $subtotal - $discountAmount);

            return [
                'success'         => true,
                'message'         => 'Promo berhasil diterapkan.',
                'promo_id'        => $promo->promo_id,
                'promo_code'      => $promo->promo_code,
                'promo_name'      => $promo->promo_name,
                'scope'           => $promo->scope,
                'discount_amount' => $discountAmount,
                'final_amount'    => $finalAmount,
            ];
        } catch (\Exception $e) {
            return [
                'success'         => false,
                'message'         => $e->getMessage(),
                'promo_id'        => null,
                'promo_code'      => null,
                'promo_name'      => null,
                'scope'           => null,
                'discount_amount' => 0,
                'final_amount'    => $subtotal,
            ];
        }
    }
}
