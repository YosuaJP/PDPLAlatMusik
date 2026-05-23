<?php

namespace App\Contracts;

use App\Models\Order;

interface PaymentGatewayInterface
{
    /**
     * Create a payment transaction for an order.
     *
     * @param Order $order
     * @return array [
     *   'external_id'    => string,
     *   'payment_url'    => string,
     *   'gateway_ref'    => ?string,
     *   'payment_status' => string, // pending, paid, failed, expired
     *   'amount'         => float,
     * ]
     */
    public function createPayment(Order $order): array;

    /**
     * Mendapatkan nama gerbang pembayaran.
     *
     * @return string
     */
    public function getGatewayName(): string;
}

