<?php

namespace App\Facades;

use Illuminate\Support\Facades\Facade;

/**
 * @method static array createPayment(\App\Models\Order $order)
 * @method static string getGatewayName()
 *
 * @see \App\Contracts\PaymentGatewayInterface
 */
class PaymentGateway extends Facade
{
    /**
     * Get the registered name of the component.
     *
     * @return string
     */
    protected static function getFacadeAccessor()
    {
        return \App\Contracts\PaymentGatewayInterface::class;
    }
}
