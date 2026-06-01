<?php

namespace App\Observers;

use App\Models\Order;
use App\Models\OrderStatusHistory;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Storage;

class OrderObserver
{
    /**
     * Handle the Order "created" event.
     */
    public function created(Order $order): void
    {
        Log::info("OrderObserver: Pesanan baru #{$order->order_id} berhasil dibuat untuk User #{$order->user_id}.");
    }

    /**
     * Handle the Order "updated" event.
     */
    public function updated(Order $order): void
    {
        if ($order->isDirty('status')) {
            $oldStatus = $order->getOriginal('status');
            $newStatus = $order->status;

            Log::info("OrderObserver: Status Pesanan #{$order->order_id} berubah dari '{$oldStatus}' menjadi '{$newStatus}'.");

            // 1. Notifikasi server-side saat order confirmed (status berubah ke 'processing')
            if ($newStatus === 'processing') {
                $amount = floatval($order->final_amount);
                $message = "NOTIFIKASI SERVER: Pesanan #ORD-" . str_pad($order->order_id, 8, '0', STR_PAD_LEFT) . " senilai Rp " . number_format($amount, 0, ',', '.') . " TELAH DIKONFIRMASI (Lunas).";
                
                Log::info($message);

                // Simpan notifikasi server-side ke dalam JSON file agar bisa ditampilkan di dashboard admin
                $notificationsFile = 'server_notifications.json';
                $notifications = [];
                
                if (Storage::exists($notificationsFile)) {
                    try {
                        $notifications = json_decode(Storage::get($notificationsFile), true) ?: [];
                    } catch (\Exception $e) {
                        $notifications = [];
                    }
                }

                array_unshift($notifications, [
                    'id' => uniqid(),
                    'order_id' => $order->order_id,
                    'message' => $message,
                    'created_at' => now()->toIso8601String(),
                    'read' => false
                ]);

                // Batasi maksimal 20 notifikasi terbaru
                $notifications = array_slice($notifications, 0, 20);
                Storage::put($notificationsFile, json_encode($notifications, JSON_PRETTY_PRINT));
            }

            // 2. Buka akses ulasan saat status 'delivered'
            if ($newStatus === 'delivered') {
                Log::info("OrderObserver: Akses ulasan dibuka untuk Pesanan #{$order->order_id} karena status telah berubah menjadi 'delivered'.");
            }
        }
    }
}
