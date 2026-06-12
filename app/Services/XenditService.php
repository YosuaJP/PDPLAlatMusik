<?php

namespace App\Services;

use App\Contracts\PaymentGatewayInterface;
use App\Models\Order;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Str;

class XenditService implements PaymentGatewayInterface
{
    protected string $secretKey;
    protected string $callbackToken;
    protected bool $isProduction;
    protected string $baseUrl;

    public function __construct()
    {
        $this->secretKey     = config('services.xendit.secret_key', '');
        $this->callbackToken = config('services.xendit.callback_token', '');
        $this->isProduction  = config('services.xendit.is_production', false);
        $this->baseUrl       = 'https://api.xendit.co';
    }

    /**
     * Membuat Invoice di Xendit API.
     * Jika Secret Key belum diisi, fallback ke simulasi lokal.
     *
     * @param Order $order
     * @return array
     */
    public function createPayment(Order $order): array
    {
        // Jika XENDIT_SECRET_KEY belum diset → gunakan simulasi lokal
        if (empty($this->secretKey)) {
            return $this->createLocalSimulation($order);
        }

        return $this->createXenditInvoice($order);
    }

    /**
     * Panggil Xendit Invoice API (asli/sandbox).
     */
    protected function createXenditInvoice(Order $order): array
    {
        $externalId  = 'INV-' . $order->order_id . '-' . Str::upper(Str::random(6));
        $successUrl  = route('orders.show', $order->order_id);
        $failureUrl  = route('orders.show', $order->order_id);
        $callbackUrl = route('payment.webhook.xendit');

        // Build daftar item untuk Xendit
        $items = $order->items->map(function ($item) {
            return [
                'name'      => $item->product_name,   // snapshot dari order_items
                'quantity'  => $item->quantity,
                'price'     => (float) $item->price_each,  // snapshot harga
                'category'  => 'Alat Musik',
            ];
        })->toArray();

        $payload = [
            'external_id'         => $externalId,
            'amount'              => (float) $order->final_amount,
            'payer_email'         => $order->user->email ?? 'customer@nadakito.com',
            'description'         => "Pembayaran Pesanan NadaKito #{$order->order_id}",
            'success_redirect_url'=> $successUrl,
            'failure_redirect_url'=> $failureUrl,
            'currency'            => 'IDR',
            'items'               => $items,
            'customer'            => [
                'given_names' => $order->user->name ?? 'Customer',
                'email'       => $order->user->email ?? 'customer@nadakito.com',
            ],
            'payment_methods' => [
                'BCA', 'BNI', 'BRI', 'MANDIRI', 'PERMATA',
                'OVO', 'DANA', 'SHOPEEPAY', 'LINKAJA',
                'QRIS', 'ALFAMART', 'INDOMARET',
            ],
            // Xendit akan POST ke URL ini saat pembayaran selesai
            'callback_virtual_account_created' => $callbackUrl,
        ];

        try {
            $response = Http::withBasicAuth($this->secretKey, '')
                ->timeout(15)
                ->post("{$this->baseUrl}/v2/invoices", $payload);

            if ($response->failed()) {
                Log::error('Xendit Invoice API error', [
                    'status'  => $response->status(),
                    'body'    => $response->body(),
                    'payload' => $payload,
                ]);
                // Fallback ke simulasi lokal jika API error
                return $this->createLocalSimulation($order);
            }

            $data = $response->json();

            return [
                'external_id'    => $externalId,
                'payment_url'    => $data['invoice_url'],   // URL Xendit checkout asli
                'gateway_ref'    => $data['id'],             // Xendit invoice ID
                'payment_status' => 'pending',
                'amount'         => (float) $order->final_amount,
            ];

        } catch (\Exception $e) {
            Log::error('Xendit createPayment exception: ' . $e->getMessage());
            return $this->createLocalSimulation($order);
        }
    }

    /**
     * Fallback: Simulasi lokal jika API Key belum diisi.
     */
    protected function createLocalSimulation(Order $order): array
    {
        $externalId = 'INV-' . $order->order_id . '-' . Str::upper(Str::random(6));
        $paymentUrl = route('payment.simulate', ['external_id' => $externalId]);

        return [
            'external_id'    => $externalId,
            'payment_url'    => $paymentUrl,
            'gateway_ref'    => 'xendit_sim_' . Str::lower(Str::random(12)),
            'payment_status' => 'pending',
            'amount'         => (float) $order->final_amount,
        ];
    }

    /**
     * Mendapatkan nama gerbang pembayaran.
     */
    public function getGatewayName(): string
    {
        return 'xendit';
    }

    /**
     * Verifikasi bahwa webhook berasal dari Xendit.
     * Xendit mengirim header X-CALLBACK-TOKEN yang harus dicocokkan.
     */
    public function verifyWebhookToken(string $incomingToken): bool
    {
        if (empty($this->callbackToken)) {
            // Jika token belum diset, bypass validasi (dev mode)
            return true;
        }
        return hash_equals($this->callbackToken, $incomingToken);
    }
}
