<?php

namespace App\Services;

use App\Contracts\PaymentGatewayInterface;
use App\Models\Order;
use Illuminate\Support\Str;

class XenditService implements PaymentGatewayInterface
{
    /**
     * Simulasikan pembuatan invoice/pembayaran di Xendit.
     *
     * @param Order $order
     * @return array
     */
    public function createPayment(Order $order): array
    {
        // Format external ID yang unik untuk invoice
        $externalId = 'INV-' . $order->order_id . '-' . Str::upper(Str::random(6));

        // Rute untuk simulasi halaman pembayaran tiruan
        $paymentUrl = route('payment.simulate', ['external_id' => $externalId]);

        return [
            'external_id'    => $externalId,
            'payment_url'    => $paymentUrl,
            'gateway_ref'    => 'xendit_ref_' . Str::lower(Str::random(12)),
            'payment_status' => 'pending',
            'amount'         => (float) $order->final_amount,
        ];
    }

    /**
     * Mendapatkan nama gerbang pembayaran.
     *
     * @return string
     */
    public function getGatewayName(): string
    {
        return 'xendit';
    }
}

