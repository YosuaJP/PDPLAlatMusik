<?php

namespace Tests\Feature;

use App\Models\Promo;
use App\Services\PromoService;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class PromoServiceTest extends TestCase
{
    use RefreshDatabase;

    protected PromoService $promoService;

    protected function setUp(): void
    {
        parent::setUp();
        $this->promoService = new PromoService();
    }

    public function test_validate_promo_fails_if_inactive()
    {
        $promo = Promo::create([
            'promo_code' => 'INACTIVE',
            'promo_name' => 'Inactive Promo',
            'promo_type' => 'percent',
            'discount_value' => 10,
            'active' => false,
            'start_date' => now()->subDay(),
            'end_date' => now()->addDay(),
        ]);

        $this->expectException(\Exception::class);
        $this->expectExceptionMessage('Kode promo ini sudah tidak aktif.');

        $this->promoService->validatePromo('INACTIVE', 100000);
    }

    public function test_validate_promo_fails_if_min_purchase_not_met()
    {
        $promo = Promo::create([
            'promo_code' => 'MINPURCHASE',
            'promo_name' => 'Min Purchase',
            'promo_type' => 'fixed',
            'discount_value' => 10000,
            'min_purchase' => 50000,
            'active' => true,
            'start_date' => now()->subDay(),
            'end_date' => now()->addDay(),
        ]);

        $this->expectException(\Exception::class);
        $this->expectExceptionMessage('Total belanja Anda belum mencapai minimum');

        $this->promoService->validatePromo('MINPURCHASE', 40000);
    }

    public function test_apply_discount_percentage_without_max_cap()
    {
        $promo = Promo::create([
            'promo_code' => 'PERCENT20',
            'promo_name' => 'Discount 20%',
            'promo_type' => 'percent',
            'discount_value' => 20,
            'max_discount_amount' => 0,
            'active' => true,
            'start_date' => now()->subDay(),
            'end_date' => now()->addDay(),
        ]);

        $discount = $this->promoService->applyDiscount($promo, 100000);
        
        $this->assertEquals(20000, $discount);
    }

    public function test_apply_discount_percentage_with_max_cap()
    {
        $promo = Promo::create([
            'promo_code' => 'MAXCAP',
            'promo_name' => 'Discount 50% max 20rb',
            'promo_type' => 'percent',
            'discount_value' => 50,
            'max_discount_amount' => 20000,
            'active' => true,
            'start_date' => now()->subDay(),
            'end_date' => now()->addDay(),
        ]);

        // 50% of 100,000 is 50,000, but max cap is 20,000
        $discount = $this->promoService->applyDiscount($promo, 100000);
        
        $this->assertEquals(20000, $discount);
    }

    public function test_apply_discount_fixed_amount()
    {
        $promo = Promo::create([
            'promo_code' => 'FIXED50',
            'promo_name' => 'Potongan 50rb',
            'promo_type' => 'fixed',
            'discount_value' => 50000,
            'active' => true,
            'start_date' => now()->subDay(),
            'end_date' => now()->addDay(),
        ]);

        $discount = $this->promoService->applyDiscount($promo, 200000);
        
        $this->assertEquals(50000, $discount);
    }

    public function test_apply_discount_does_not_exceed_subtotal()
    {
        $promo = Promo::create([
            'promo_code' => 'FIXED50B',
            'promo_name' => 'Potongan 50rb',
            'promo_type' => 'fixed',
            'discount_value' => 50000,
            'active' => true,
            'start_date' => now()->subDay(),
            'end_date' => now()->addDay(),
        ]);

        // Subtotal is only 30,000, discount should not exceed subtotal
        $discount = $this->promoService->applyDiscount($promo, 30000);
        
        $this->assertEquals(30000, $discount);
    }
}
