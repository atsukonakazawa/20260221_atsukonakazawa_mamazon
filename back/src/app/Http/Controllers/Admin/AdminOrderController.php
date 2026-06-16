<?php

namespace App\Http\Controllers\Admin;

use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use App\Models\Order;

class AdminOrderController extends Controller
{
    public function index(Request $request)
    {
        $query = Order::with([
            'user',
            'paymentStatus',
            'shipmentStatus',
        ]);

        if ($request->keyword) {
            $query->where(function ($q) use ($request) {
                $q->where('id', 'like', "%{$request->keyword}%")
                    ->orWhere('total_price', 'like', "%{$request->keyword}%")
                    ->orWhereHas('user', function ($user) use ($request) {
                        $user->where('last_name', 'like', "%{$request->keyword}%")
                            ->orWhere('first_name', 'like', "%{$request->keyword}%");
                    });
            });
        }

        $orders = $query
            ->latest()
            ->get();

        return response()->json(
            $orders->map(fn ($order) => [
                'id' => $order->id,
                'created_at' => $order->created_at?->format('Y-m-d H:i'),
                'user_name' => $order->user->last_name . ' ' . $order->user->first_name,
                'total_amount' => $order->total_price,
                'payment_status' => $order->paymentStatus->payment_status,
                'shipment_status' => $order->shipmentStatus->shipment_status,
            ])
        );
    }

    public function show(Order $order)
    {
        $order->load([
            'user',
            'paymentWay',
            'paymentStatus',
            'shipmentStatus',
            'items.product',
            'items.number',
        ]);

        return response()->json([
            'id' => $order->id,
            'created_at' => $order->created_at?->format('Y-m-d H:i'),
            'user_name' => $order->user->full_name,

            'payment_way' => $order->paymentWay->name,
            'payment_status' => $order->paymentStatus->name,
            'shipment_status' => $order->shipmentStatus->name,

            'shipping_postcode' => $order->shipping_postcode,
            'shipping_address' => $order->shipping_address,
            'shipping_name' => $order->shipping_name,
            'sender' => $order->sender,

            'total_price' => $order->total_price,

            'items' => $order->items->map(fn ($item) => [
                'product_name' => $item->product->product_name,
                'price' => $item->price,
                'quantity' => $item->number->quantity,
                'subtotal' => $item->price * $item->number->quantity,
            ]),
        ]);
    }
}
