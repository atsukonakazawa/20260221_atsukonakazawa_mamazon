<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Order;

class OrderController extends Controller
{
    public function index(Request $request)
    {
        /** @var \App\Models\User $user */
        $user = $request->user();

        $orders = Order::with([
            'items.product.images',
            'shipmentStatus',
            'paymentStatus',
            'paymentWay'
        ])
            ->where('user_id', $user->id)
            ->latest()
            ->get();

        return response()->json($orders);
    }
}
