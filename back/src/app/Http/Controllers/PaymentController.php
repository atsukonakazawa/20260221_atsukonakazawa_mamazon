<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Stripe\Stripe;
use Stripe\PaymentIntent;
use App\Models\Order;
use App\Models\OrderItem;
use App\Models\PaymentWay;
use App\Models\PaymentStatus;
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

    public function getPaymentWays()
    {
        return response()->json(
            PaymentWay::where('is_active', true)->get()
        );
    }

    public function storeOrder(Request $request)
    {
        DB::beginTransaction();

        //支払い方法取得
        $paymentWay = PaymentWay::find($request->payment_way_id);

        //支払い方法による分岐条件でpayment_statusを決定
        if ($paymentWay->payment_way === 'クレジット') {
            $paymentStatus = PaymentStatus::where('payment_status', '支払い完了')->first();
        } elseif ($paymentWay->payment_way === 'コンビニ払い') {
            $paymentStatus = PaymentStatus::where('payment_status', '支払い待機中')->first();
        } else {
            throw new \Exception('不正な支払い方法です');
        }

        try {
            $order = Order::create([
                'user_id' => $request->user_id,
                'payment_way_id' => $paymentWay->id,
                'payment_status_id' => $paymentStatus->id,
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
                    'number_id' => $item['quantity'],
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
