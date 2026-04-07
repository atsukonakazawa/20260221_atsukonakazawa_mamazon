<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Order;

class OrderController extends Controller
{
    public function index(Request $request)
    {
        $orders = Order::with('items.product.images')
            ->where('user_id', $request->user_id)
            ->latest()
            ->get();

        return response()->json($orders);
    }
}
