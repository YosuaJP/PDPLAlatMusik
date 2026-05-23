<?php

namespace Tests\Feature;

use App\Contracts\PaymentGatewayInterface;
use App\Models\Order;
use App\Models\OrderItem;
use App\Models\Payment;
use App\Models\Product;
use App\Models\User;
use App\Services\MidtransService;
use App\Services\XenditService;
use App\Facades\PaymentGateway;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class PaymentGatewayTest extends TestCase
{
    use RefreshDatabase;

    // -------------------------------------------------------------------------
    // Helper: Buat user minimal sesuai skema tabel users proyek ini
    // -------------------------------------------------------------------------
    private function makeUser(): User
    {
        return User::create([
            'name'     => 'Test User',
            'email'    => 'test' . rand(1000, 9999) . '@example.com',
            'password' => bcrypt('password'),
            'role'     => 'customer',
            'status'   => 'active',
        ]);
    }

    // -------------------------------------------------------------------------
    // Helper: Buat kategori dummy (required by products FK)
    // -------------------------------------------------------------------------
    private function makeCategory(): int
    {
        return \DB::table('categories')->insertGetId([
            'category_name' => 'Test Category',
            'description'   => null,
            'active'        => 1,
        ]);
    }

    // -------------------------------------------------------------------------
    // Helper: Buat product dengan semua field yang wajib diisi
    // -------------------------------------------------------------------------
    private function makeProduct(int $categoryId, int $stock = 10): Product
    {
        return Product::create([
            'category_id' => $categoryId,
            'name'        => 'Alat Musik Test ' . rand(100, 999),
            'price'       => 3000000.00,
            'stock_qty'   => $stock,
            'sku'         => 'SKU-TEST-' . rand(10000, 99999),
            'active'      => true,
        ]);
    }

    // -------------------------------------------------------------------------
    // Helper: Buat order + payment yang siap diuji
    // -------------------------------------------------------------------------
    private function makeOrderWithPayment(User $user, string $gateway = 'midtrans'): array
    {
        $order = Order::create([
            'user_id'          => $user->user_id,
            'subtotal_amount'  => 3000000.00,
            'discount_amount'  => 0.00,
            'shipping_cost'    => 20000.00,
            'final_amount'     => 3020000.00,
            'shipping_address' => 'Jl. Merdeka No. 10',
            'courier_code'     => 'JNE',
            'status'           => 'pending',
        ]);

        $externalId = 'INV-TEST-' . $order->order_id . '-' . strtoupper(substr(md5((string)rand()), 0, 6));

        $payment = Payment::create([
            'order_id'       => $order->order_id,
            'external_id'    => $externalId,
            'gateway_ref'    => $gateway . '_ref_' . rand(1000, 9999),
            'payment_url'    => 'http://localhost/payment/simulate/' . $externalId,
            'payment_method' => $gateway,
            'gateway_status' => 'pending',
            'payment_status' => 'pending',
            'amount'         => 3020000.00,
        ]);

        return [$order, $payment];
    }

    // =========================================================================
    // TEST 1: Resolusi binding dinamis gateway dari service container
    // =========================================================================
    public function test_dynamic_payment_gateway_binding(): void
    {
        // Test langsung membuat instance kedua service dan memverifikasi nama gateway
        $xenditService = app(XenditService::class);
        $this->assertInstanceOf(XenditService::class, $xenditService);
        $this->assertEquals('xendit', $xenditService->getGatewayName());

        $midtransService = app(MidtransService::class);
        $this->assertInstanceOf(MidtransService::class, $midtransService);
        $this->assertEquals('midtrans', $midtransService->getGatewayName());

        // Test binding dinamis via container berdasarkan env runtime
        // Rebind kontainer ke XenditService untuk test
        app()->bind(PaymentGatewayInterface::class, XenditService::class);
        $gatewayXendit = app(PaymentGatewayInterface::class);
        $this->assertInstanceOf(XenditService::class, $gatewayXendit);
        $this->assertEquals('xendit', $gatewayXendit->getGatewayName());
        // Verifikasi juga via Facade
        $this->assertEquals('xendit', PaymentGateway::getGatewayName());

        // Hapus instance ter-resolve agar memicu pencarian ulang dari service container
        PaymentGateway::clearResolvedInstances();

        // Rebind kontainer ke MidtransService untuk test
        app()->bind(PaymentGatewayInterface::class, MidtransService::class);
        $gatewayMidtrans = app(PaymentGatewayInterface::class);
        $this->assertInstanceOf(MidtransService::class, $gatewayMidtrans);
        $this->assertEquals('midtrans', $gatewayMidtrans->getGatewayName());
        // Verifikasi juga via Facade
        $this->assertEquals('midtrans', PaymentGateway::getGatewayName());
    }

    // =========================================================================
    // TEST 2: Webhook Midtrans berhasil (settlement) → status paid & processing
    // =========================================================================
    public function test_midtrans_webhook_success_updates_payment_and_order(): void
    {
        $user = $this->makeUser();
        [$order, $payment] = $this->makeOrderWithPayment($user, 'midtrans');

        // Kirim payload webhook settlement ke rute webhook Midtrans
        $payload = [
            'order_id'           => $payment->external_id,
            'transaction_status' => 'settlement',
            'payment_type'       => 'qris',
            'gross_amount'       => '3020000.00',
        ];

        $response = $this->postJson(route('payment.webhook.midtrans'), $payload);

        $response->assertStatus(200);
        $response->assertJsonFragment(['message' => 'Callback processed successfully']);

        // Verifikasi pembaruan database
        $payment->refresh();
        $order->refresh();

        $this->assertEquals('paid', $payment->payment_status);
        $this->assertEquals('SUCCESS', $payment->gateway_status);
        $this->assertEquals(3020000.00, (float) $payment->paid_amount);
        $this->assertNotNull($payment->paid_at);
        $this->assertEquals('processing', $order->status);
    }

    // =========================================================================
    // TEST 3: Webhook Midtrans gagal (expire) → status failed, stok dikembalikan
    // =========================================================================
    public function test_midtrans_webhook_failure_cancels_order_and_restores_stock(): void
    {
        $user       = $this->makeUser();
        $categoryId = $this->makeCategory();
        $product    = $this->makeProduct($categoryId, stock: 10);

        // Simulasikan pengurangan stok saat checkout (seakan 2 unit telah dibeli)
        $product->decrement('stock_qty', 2);
        $this->assertEquals(8, $product->fresh()->stock_qty);

        [$order, $payment] = $this->makeOrderWithPayment($user, 'midtrans');

        // Buat order item agar pengembalian stok bisa diproses
        OrderItem::create([
            'order_id'     => $order->order_id,
            'product_id'   => $product->product_id,
            'product_name' => $product->name,
            'quantity'     => 2,
            'price_each'   => 3000000.00,
        ]);

        // Update amount sesuai order item (opsional, sudah ada di payment)
        // Kirim payload webhook expire ke rute webhook Midtrans
        $payload = [
            'order_id'           => $payment->external_id,
            'transaction_status' => 'expire',
            'payment_type'       => 'bank_transfer',
            'gross_amount'       => '3020000.00',
        ];

        $response = $this->postJson(route('payment.webhook.midtrans'), $payload);

        $response->assertStatus(200);

        // Verifikasi pembaruan database
        $payment->refresh();
        $order->refresh();
        $product->refresh();

        $this->assertEquals('failed', $payment->payment_status);
        $this->assertEquals('FAILED', $payment->gateway_status);
        $this->assertEquals('cancelled', $order->status);

        // Stok harus dikembalikan: 8 + 2 = 10
        $this->assertEquals(10, $product->stock_qty);
    }

    // =========================================================================
    // TEST 4: Webhook duplikat (payment sudah diproses) tidak mengubah data
    // =========================================================================
    public function test_midtrans_webhook_duplicate_does_not_reprocess(): void
    {
        $user = $this->makeUser();
        [$order, $payment] = $this->makeOrderWithPayment($user, 'midtrans');

        // Tandai payment sudah dibayar terlebih dahulu
        $payment->update(['payment_status' => 'paid']);

        $payload = [
            'order_id'           => $payment->external_id,
            'transaction_status' => 'settlement',
            'payment_type'       => 'qris',
            'gross_amount'       => '3020000.00',
        ];

        $response = $this->postJson(route('payment.webhook.midtrans'), $payload);

        $response->assertStatus(200);
        $response->assertJsonFragment(['message' => 'Payment already processed']);

        // Status tidak boleh berubah
        $this->assertEquals('paid', $payment->fresh()->payment_status);
        $this->assertEquals('pending', $order->fresh()->status);
    }

    // =========================================================================
    // TEST 5: Webhook dengan external_id tidak valid mengembalikan 404
    // =========================================================================
    public function test_midtrans_webhook_with_unknown_external_id_returns_404(): void
    {
        $payload = [
            'order_id'           => 'INV-TIDAK-ADA-SAMA-SEKALI',
            'transaction_status' => 'settlement',
        ];

        $response = $this->postJson(route('payment.webhook.midtrans'), $payload);
        $response->assertStatus(404);
    }

    // =========================================================================
    // TEST 6: Webhook tanpa order_id mengembalikan 400
    // =========================================================================
    public function test_midtrans_webhook_without_order_id_returns_400(): void
    {
        $payload = [
            'transaction_status' => 'settlement',
        ];

        $response = $this->postJson(route('payment.webhook.midtrans'), $payload);
        $response->assertStatus(400);
    }

    // =========================================================================
    // TEST 7: Pembuatan transaksi Midtrans saat Server Key kosong (Fallback)
    // =========================================================================
    public function test_midtrans_create_payment_with_empty_key_falls_back(): void
    {
        // Pastikan server key kosong
        config(['services.midtrans.server_key' => '']);

        $user = $this->makeUser();
        $categoryId = $this->makeCategory();
        $product = $this->makeProduct($categoryId);
        [$order, $payment] = $this->makeOrderWithPayment($user, 'midtrans');

        // Tambah order item ke order
        $orderItem = OrderItem::create([
            'order_id'     => $order->order_id,
            'product_id'   => $product->product_id,
            'product_name' => $product->name,
            'quantity'     => 1,
            'price_each'   => $product->price,
        ]);

        $service = new MidtransService();
        $result = $service->createPayment($order);

        $this->assertStringContainsString('payment/simulate', $result['payment_url']);
        $this->assertStringContainsString('midtrans_fallback_', $result['gateway_ref']);
        $this->assertArrayHasKey('error', $result);
        $this->assertStringContainsString('Server Key belum diatur', $result['error']);
    }

    // =========================================================================
    // TEST 8: Pembuatan transaksi Midtrans berhasil dengan Mock API Snap
    // =========================================================================
    public function test_midtrans_create_payment_success_with_fake_api(): void
    {
        // Atur server key sandbox dummy
        config(['services.midtrans.server_key' => 'SB-Mid-server-12345']);

        $user = $this->makeUser();
        $categoryId = $this->makeCategory();
        $product = $this->makeProduct($categoryId);
        [$order, $payment] = $this->makeOrderWithPayment($user, 'midtrans');

        OrderItem::create([
            'order_id'     => $order->order_id,
            'product_id'   => $product->product_id,
            'product_name' => $product->name,
            'quantity'     => 1,
            'price_each'   => $product->price,
        ]);

        // Fake response dari Snap API Midtrans
        \Illuminate\Support\Facades\Http::fake([
            'https://app.sandbox.midtrans.com/snap/v1/transactions' => \Illuminate\Support\Facades\Http::response([
                'token'        => 'snap-token-abc-123',
                'redirect_url' => 'https://app.sandbox.midtrans.com/snap/v2/vtweb/snap-token-abc-123'
            ], 200)
        ]);

        $service = new MidtransService();
        $result = $service->createPayment($order);

        $this->assertEquals('snap-token-abc-123', $result['gateway_ref']);
        $this->assertEquals('https://app.sandbox.midtrans.com/snap/v2/vtweb/snap-token-abc-123', $result['payment_url']);
        $this->assertArrayNotHasKey('error', $result);
    }

    // =========================================================================
    // TEST 9: Webhook Midtrans dengan signature_key tidak valid mengembalikan 403
    // =========================================================================
    public function test_midtrans_webhook_with_invalid_signature_returns_403(): void
    {
        config(['services.midtrans.server_key' => 'SB-Mid-server-12345']);

        $user = $this->makeUser();
        [$order, $payment] = $this->makeOrderWithPayment($user, 'midtrans');

        $payload = [
            'order_id'           => $payment->external_id,
            'transaction_status' => 'settlement',
            'status_code'        => '200',
            'gross_amount'       => '3020000.00',
            'signature_key'      => 'wrong-signature-key-1234567890'
        ];

        $response = $this->postJson(route('payment.webhook.midtrans'), $payload);
        $response->assertStatus(403);
        $response->assertJsonFragment(['message' => 'Signature key tidak valid.']);
    }
}
