<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Cart;

class CartController extends Controller
{
    // カート一覧取得
    public function index(Request $request)
    {
        $userId = $request->user_id;

        $carts = Cart::with('product', 'product.images')
            ->where('user_id', $userId)
            ->get();

        return response()->json($carts);
    }

    // カート追加
    public function store(Request $request)
    {
        $userId = $request->user_id;

        $cart = Cart::where('user_id', $userId)
            ->where('product_id', $request->product_id)
            ->first();

        if ($cart) {
            $cart->increment('quantity');
        } else {
            $cart = Cart::create([
                'user_id' => $userId,
                'product_id' => $request->product_id,
                'quantity' => 1,
            ]);
        }

        return response()->json($cart);
    }

    // 数量更新（+ / -）
    public function update(Request $request, $id)
    {
        $cart = Cart::where('id', $id)
            ->where('user_id', $request->user_id)
            ->firstOrFail();

        if ($request->type === 'increase') {
            $cart->increment('quantity');
        } elseif ($request->type === 'decrease') {
            $cart->decrement('quantity');

            if ($cart->quantity <= 0) {
                $cart->delete();
                return response()->json(['message' => 'deleted']);
            }
        }

        return response()->json($cart);
    }

    // 削除
    public function destroy(Request $request, $id)
    {
        $cart = Cart::where('id', $id)
            ->where('user_id', $request->user_id)
            ->firstOrFail();
        $cart->delete();

        return response()->json(['message' => 'deleted']);
    }
}
