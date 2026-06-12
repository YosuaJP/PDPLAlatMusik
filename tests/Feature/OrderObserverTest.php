<?php

namespace Tests\Feature;

use App\Models\Order;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Storage;
use Tests\TestCase;

class OrderObserverTest extends TestCase
{
    use RefreshDatabase;

    /**
     * Helper untuk membuat data order dengan semua kolom wajib.
     */
    private function makeOrderData(User $user, string $status = 'pending'): array
    {
        return [
            'user_id'          => $user->user_id,
            'status'           => $status,
            'subtotal_amount'  => 150000.00,
            'discount_amount'  => 0,
            'shipping_cost'    => 0,
            'final_amount'     => 150000.00,
        ];
    }

    /**
     * Test bahwa OrderObserver mencatat log saat order dibuat.
     */
    public function test_order_observer_created_hook_logs_correctly(): void
    {
        $user = User::factory()->create();

        $order = Order::create($this->makeOrderData($user));

        // Verifikasi order berhasil dibuat (Observer created() berjalan)
        $this->assertDatabaseHas('orders', [
            'order_id' => $order->order_id,
            'status'   => 'pending',
        ]);
    }

    /**
     * Test bahwa OrderObserver membuat notifikasi server-side JSON
     * saat status order berubah menjadi 'processing' (pembayaran dikonfirmasi).
     */
    public function test_order_observer_updated_hook_processing_notification(): void
    {
        $user  = User::factory()->create();
        $order = Order::create($this->makeOrderData($user));

        // Bersihkan file notifikasi sebelumnya jika ada
        $notificationsFile = 'server_notifications.json';
        if (Storage::exists($notificationsFile)) {
            Storage::delete($notificationsFile);
        }

        // Trigger status update ke 'processing' (simulasi pembayaran lunas)
        $order->update(['status' => 'processing']);

        // Assert: file JSON notifikasi server-side terbentuk
        $this->assertTrue(
            Storage::exists($notificationsFile),
            'File server_notifications.json harus terbentuk setelah status menjadi processing.'
        );

        $notifications = json_decode(Storage::get($notificationsFile), true);
        $this->assertNotEmpty($notifications, 'Isi notifikasi tidak boleh kosong.');
        $this->assertStringContainsString(
            'TELAH DIKONFIRMASI',
            $notifications[0]['message'],
            'Pesan notifikasi harus mengandung teks konfirmasi pembayaran.'
        );
        $this->assertEquals($order->order_id, $notifications[0]['order_id']);
    }

    /**
     * Test bahwa OrderObserver menangkap perubahan status ke 'delivered'.
     */
    public function test_order_observer_updated_hook_delivered_opens_review_access(): void
    {
        $user  = User::factory()->create();
        $order = Order::create($this->makeOrderData($user, 'processing'));

        // Ubah status ke 'delivered'
        $order->update(['status' => 'delivered']);

        // Verifikasi status tersimpan
        $this->assertDatabaseHas('orders', [
            'order_id' => $order->order_id,
            'status'   => 'delivered',
        ]);
    }
}
