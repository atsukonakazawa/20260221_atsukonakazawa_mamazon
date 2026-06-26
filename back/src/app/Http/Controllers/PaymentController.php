<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Stripe\Stripe;
use Stripe\PaymentIntent;
use App\Models\Order;
use App\Models\OrderItem;
use App\Models\PaymentWay;
use App\Models\PaymentStatus;
use App\Models\User;
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

        // 支払い方法取得
        $paymentWay = PaymentWay::find($request->payment_way_id);

        // 支払いステータス決定
        if ($paymentWay->payment_way === 'クレジット') {
            $paymentStatus = PaymentStatus::where('payment_status', '支払い完了')->first();
        } elseif ($paymentWay->payment_way === 'コンビニ払い') {
            $paymentStatus = PaymentStatus::where('payment_status', '支払い待機中')->first();
        } else {
            throw new \Exception('不正な支払い方法です');
        }

        // コンビニ払い関係の値を初期化
        $paymentNumber = null;
        $confirmationNumber = null;
        $limitDate = null;

        // ユーザー情報取得
        $user = User::findOrFail($request->user_id);

        // コンビニのときだけ生成
        if ($paymentWay->payment_way === 'コンビニ払い') {
            //支払い番号(9桁)
            $paymentNumber = str_pad(mt_rand(0, 999999999), 9, '0', STR_PAD_LEFT);

            //支払い期限(3日後の23:59:59)
            $limitDate = now()->addDays(3)->endOfDay();

            // 電話番号から確認番号を生成
            $phoneNumber = $user->tel;

            // 数字以外を削除
            $cleanPhoneNumber = preg_replace('/\D/', '', $phoneNumber);

            // 下6桁を取得
            $confirmationNumber = substr($cleanPhoneNumber, -6);

            // 桁数不足時は0埋め
            if (strlen($confirmationNumber) < 6) {
                $confirmationNumber = str_pad($confirmationNumber, 6, '0', STR_PAD_LEFT);
            }
        }

        try {
            $order = Order::create([
                'user_id' => $request->user_id,
                'payment_way_id' => $paymentWay->id,
                'payment_status_id' => $paymentStatus->id,
                'shipment_status_id' => 1,

                'shipping_postcode' => $request->shipping_postcode,
                'shipping_address' => $request->shipping_address,
                'shipping_name' => $request->shipping_name,
                'sender' => $request->sender,

                'total_price' => $request->total_price,

                'payment_number' => $paymentNumber,
                'confirmation_number' => $confirmationNumber,
                'payment_limit' => $limitDate,
            ]);

            foreach ($request->items as $item) {
                OrderItem::create([
                    'order_id' => $order->id,
                    'product_id' => $item['product_id'],
                    'quantity' => $item['quantity'],
                    'price' => $item['price'],
                ]);
            }

            DB::commit();

            // フロントに返すレスポンス
            return response()->json([
                'message' => '注文保存成功',
                'order_id' => $order->id,
                'payment_number' => $paymentNumber,
                'confirmation_number' => $confirmationNumber,
                'payment_limit' => $limitDate,
            ]);
        } catch (\Exception $e) {
            DB::rollback();

            return response()->json([
                'error' => $e->getMessage()
            ], 500);
        }
    }
}
