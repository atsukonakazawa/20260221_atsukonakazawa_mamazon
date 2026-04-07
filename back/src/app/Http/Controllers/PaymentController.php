<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Stripe\Stripe;
use Stripe\PaymentIntent;
use App\Models\Order;
use App\Models\OrderItem;
use Illuminate\Support\Facades\DB;

class PaymentController extends Controller
{
    public function pay(Request $request)
    {
        Stripe::setApiKey(env('STRIPE_SECRET_KEY'));

        try {
            $paymentIntent = PaymentIntent::create([
                'amount' => $request->amount, // 金額（円）
                'currency' => 'jpy',
                'payment_method' => $request->paymentMethodId,
                'confirmation_method' => 'automatic',
                'confirm' => false,
            ]);

            return response()->json([
                'clientSecret' => $paymentIntent->client_secret
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'error' => $e->getMessage()
            ], 500);
        }
    }

    public function storeOrder(Request $request)
    {
        DB::beginTransaction();

        try {
            $order = Order::create([
                'user_id' => $request->user_id,
                'payment_way_id' => 2, // クレカ（仮）
                'payment_status_id' => 2, // 支払い完了（仮）
                'shipment_status_id' => 1, // 出荷準備中（仮）

                'shipping_postcode' => $request->shipping_postcode,
                'shipping_address' => $request->shipping_address,
                'shipping_name' => $request->shipping_name,
                'sender' => $request->sender,

                'total_price' => $request->total_price,
            ]);

            foreach ($request->items as $item) {
                OrderItem::create([
                    'order_id' => $order->id,
                    'product_id' => $item['product_id'],
                    'number_id' => $item['quantity'], // quantityとして使ってるならOK
                    'price' => $item['price'],
                ]);
            }

            DB::commit();

            return response()->json(['message' => '注文保存成功']);
        } catch (\Exception $e) {
            DB::rollback();

            return response()->json([
                'error' => $e->getMessage()
            ], 500);
        }
    }
}
