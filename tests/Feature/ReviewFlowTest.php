<?php

namespace Tests\Feature;

use App\Models\Category;
use App\Models\Order;
use App\Models\OrderItem;
use App\Models\Product;
use App\Models\Review;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class ReviewFlowTest extends TestCase
{
    use RefreshDatabase;

    /**
     * Helper untuk membuat order dengan semua kolom wajib.
     */
    private function createOrder(User $user, string $status = 'pending', float $amount = 1500000.00): Order
    {
        return Order::create([
            'user_id'         => $user->user_id,
            'status'          => $status,
            'subtotal_amount' => $amount,
            'discount_amount' => 0,
            'shipping_cost'   => 0,
            'final_amount'    => $amount,
        ]);
    }

    /**
     * Helper untuk membuat product beserta kategorinya.
     */
    private function createProduct(string $catName, string $productName, float $price, string $sku): Product
    {
        $cat = Category::create(['category_name' => $catName, 'active' => true]);

        return Product::create([
            'category_id' => $cat->category_id,
            'name'        => $productName,
            'price'       => $price,
            'stock_qty'   => 10,
            'sku'         => $sku,
            'active'      => true,
        ]);
    }

    /**
     * Test: pelanggan tidak bisa memberikan ulasan pada pesanan
     * yang belum berstatus delivered/completed.
     */
    public function test_cannot_review_non_delivered_order(): void
    {
        $user    = User::factory()->create();
        $product = $this->createProduct('Gitar', 'Gitar Akustik Yamaha', 1500000, 'GTR-YMH');
        $order   = $this->createOrder($user, 'pending', 1500000);

        $orderItem = OrderItem::create([
            'order_id'     => $order->order_id,
            'product_id'   => $product->product_id,
            'product_name' => $product->name,
            'quantity'     => 1,
            'price_each'   => 1500000.00,
        ]);

        $response = $this->actingAs($user)->post(route('reviews.store'), [
            'order_item_id' => $orderItem->order_item_id,
            'rating'        => 5,
            'comment'       => 'Bagus sekali!',
        ]);

        // Harus gagal karena status masih 'pending'
        $response->assertSessionHasErrors();
        $this->assertDatabaseMissing('reviews', [
            'order_item_id' => $orderItem->order_item_id,
        ]);
    }

    /**
     * Test: alur ulasan berhasil untuk pesanan berstatus delivered.
     * - Ulasan tersimpan dengan product_id langsung (tanpa JOIN)
     * - Status order otomatis berubah menjadi 'completed'
     */
    public function test_can_review_delivered_order_and_transitions_to_completed(): void
    {
        $user    = User::factory()->create();
        $product = $this->createProduct('Piano', 'Grand Piano Roland', 2500000, 'PNO-RLD');
        $order   = $this->createOrder($user, 'delivered', 2500000);

        $orderItem = OrderItem::create([
            'order_id'     => $order->order_id,
            'product_id'   => $product->product_id,
            'product_name' => $product->name,
            'quantity'     => 1,
            'price_each'   => 2500000.00,
        ]);

        $response = $this->actingAs($user)->post(route('reviews.store'), [
            'order_item_id' => $orderItem->order_item_id,
            'rating'        => 5,
            'comment'       => 'Sangat premium! Kualitas suaranya luar biasa.',
        ]);

        $response->assertSessionHasNoErrors();

        // Verifikasi ulasan tersimpan di database dengan product_id langsung
        $this->assertDatabaseHas('reviews', [
            'order_item_id' => $orderItem->order_item_id,
            'product_id'    => $product->product_id, // product_id disimpan langsung (Orang 3)
            'rating'        => 5,
        ]);

        // Verifikasi status order otomatis berubah ke 'completed' (Orang 2)
        $this->assertEquals('completed', $order->fresh()->status);
    }

    /**
     * Test: rating constraint (hanya 1-5 yang valid).
     */
    public function test_rating_must_be_between_1_and_5(): void
    {
        $user    = User::factory()->create();
        $product = $this->createProduct('Drum', 'Pearl Drum Set', 5000000, 'DRM-PRL');
        $order   = $this->createOrder($user, 'delivered', 5000000);

        $orderItem = OrderItem::create([
            'order_id'     => $order->order_id,
            'product_id'   => $product->product_id,
            'product_name' => $product->name,
            'quantity'     => 1,
            'price_each'   => 5000000.00,
        ]);

        // Rating 6 harus ditolak (melebihi batas max)
        $response = $this->actingAs($user)->post(route('reviews.store'), [
            'order_item_id' => $orderItem->order_item_id,
            'rating'        => 6,
            'comment'       => 'Coba rating di luar batas.',
        ]);

        $response->assertSessionHasErrors('rating');
        $this->assertDatabaseMissing('reviews', [
            'order_item_id' => $orderItem->order_item_id,
        ]);
    }

    /**
     * Test: mencegah ulasan ganda pada item yang sama (UNIQUE order_item_id).
     */
    public function test_cannot_submit_duplicate_review(): void
    {
        $user    = User::factory()->create();
        $product = $this->createProduct('Biola', 'Violin Yamaha V5', 3000000, 'VLN-YMH');
        $order   = $this->createOrder($user, 'delivered', 3000000);

        $orderItem = OrderItem::create([
            'order_id'     => $order->order_id,
            'product_id'   => $product->product_id,
            'product_name' => $product->name,
            'quantity'     => 1,
            'price_each'   => 3000000.00,
        ]);

        // Kirim ulasan pertama
        $this->actingAs($user)->post(route('reviews.store'), [
            'order_item_id' => $orderItem->order_item_id,
            'rating'        => 4,
            'comment'       => 'Ulasan pertama.',
        ]);

        // Kirim ulasan kedua — harus ditolak
        $response = $this->actingAs($user)->post(route('reviews.store'), [
            'order_item_id' => $orderItem->order_item_id,
            'rating'        => 3,
            'comment'       => 'Ulasan duplikat.',
        ]);

        $response->assertSessionHasErrors();

        // Pastikan hanya ada 1 ulasan di database
        $this->assertEquals(1, Review::where('order_item_id', $orderItem->order_item_id)->count());
    }
}
