<?php

namespace App\Http\Middleware;

use Illuminate\Http\Request;
use Inertia\Middleware;

class HandleInertiaRequests extends Middleware
{
    /**
     * The root template that is loaded on the first page visit.
     *
     * @var string
     */
    protected $rootView = 'app';

    /**
     * Determine the current asset version.
     */
    public function version(Request $request): ?string
    {
        return parent::version($request);
    }

    /**
     * Define the props that are shared by default.
     *
     * @return array<string, mixed>
     */
    public function share(Request $request): array
    {
        return [
            ...parent::share($request),
            'auth' => [
                'user' => $request->user(),
            ],
            'cartCount' => function () use ($request) {
                $user = $request->user();
                if (!$user) {
                    return 0;
                }
                
                $userId = $user->user_id ?? $user->id;
                
                $cart = \App\Models\Cart::where('user_id', $userId)
                    ->where('status', 'active')
                    ->first();
                    
                if (!$cart) {
                    return 0;
                }
                
                return (int) $cart->items()->sum('quantity');
            },
        ];
    }
}
