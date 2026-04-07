'use client';

import Header from '../../components/Header';
import FooterLogin from "../../components/FooterLogin";
import { useCart } from '@/lib/context/CartContext';
import { useState } from 'react';
import CheckoutForm from '../../components/CheckoutForm';
import { loadStripe } from '@stripe/stripe-js';
import { Elements } from '@stripe/react-stripe-js';
import { createPayment } from '@/lib/api/paymentApi';
import { createOrder } from '@/lib/api/orderApi';
import { useUser } from '@/lib/context/UserContext';
import { useRouter } from 'next/navigation';


export default function CheckoutPage() {
    const { cartItems } = useCart();

    // 小計
    const subtotal = cartItems.reduce((sum, item) => {
        return sum + item.price * item.quantity;
    }, 0);

    // 配送料（今回は0円）
    const shipping = 0;

    // 合計
    const total = subtotal + shipping;

    //支払い方法
    const [paymentMethod, setPaymentMethod] = useState('credit');

    //Stripe初期化
    const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_KEY!);

    //カード情報保存
    const [paymentMethodId, setPaymentMethodId] = useState<string | null>(null);

    //paymentApiからデータを受け取り注文を確定する
    const { user } = useUser();
    const router = useRouter();

    const handleOrder = async () => {
        console.log(cartItems);
        if (!paymentMethodId) {
            alert('カード情報を入力してください');
            return;
        }

        try {
            const data = await createPayment(total, paymentMethodId);

            const stripe = await stripePromise;

            const result = await stripe!.confirmCardPayment(data.clientSecret, {
                payment_method: paymentMethodId,
            });

            if (result.error) {
                alert(result.error.message);
            } else if (result.paymentIntent.status === 'succeeded') {
                await createOrder({
                    user_id: user ? user.id : null,
                    total_price: total,
                    items: cartItems.map(item => ({
                        product_id: item.product_id,
                        quantity: item.quantity,
                        price: item.price,
                    })),
                    shipping_postcode: user ? user.postcode : "",
                    shipping_address: user ? user.address : "",
                    shipping_name: user ? user.last_name + user.first_name : "",
                    sender: user ? user.last_name + user.first_name : "",
                });

                router.push('/checkout/complete');

            }

        } catch (error) {
            console.error(error);
            alert('決済エラー');
        }
    };

    return (
        <>
            <Header />

            <div className="p-6 max-w-2xl mx-auto">
                <h1 className="text-2xl font-bold mb-6">注文確認</h1>

                {/* 💰 金額エリア */}
                <div className="border p-6 rounded space-y-4">

                    {/* ボタン（次ステップ用） */}
                    <button
                        onClick={handleOrder}
                        className="mt-3 mb-10 w-full bg-yellow-400 hover:bg-yellow-500 py-3 rounded-full font-bold cursor-pointer">
                        注文を確定する
                    </button>

                    <div className="flex justify-between">
                        <span>商品の小計：</span>
                        <span>¥{subtotal.toLocaleString()}円</span>
                    </div>

                    <div className="flex justify-between">
                        <span>配送料・手数料：</span>
                        <span>¥{shipping.toLocaleString()}円</span>
                    </div>

                    <hr />

                    <div className="flex justify-between text-xl font-bold">
                        <span>ご請求額：</span>
                        <span>¥{total.toLocaleString()}円</span>
                    </div>
                </div>

                {/* 💳 支払い方法 */}
                <div className="border p-6 rounded space-y-4 mt-6">
                    <h2 className="text-lg font-bold">支払い方法</h2>

                    <label className="flex items-center gap-3 cursor-pointer">
                        <input
                            type="radio"
                            name="payment"
                            value="credit"
                            checked={paymentMethod === 'credit'}
                            onChange={(e) => setPaymentMethod(e.target.value)}
                        />
                        <span>クレジットカード</span>
                    </label>


                    {/* クレジットカード情報入力欄 */}
                    {paymentMethod === 'credit' && (
                        <Elements stripe={stripePromise}>
                            <CheckoutForm
                                setPaymentMethodId={setPaymentMethodId}
                            />
                        </Elements>
                    )}

                    <label className="flex items-center gap-3 cursor-pointer">
                        <input
                            type="radio"
                            name="payment"
                            value="convenience"
                            checked={paymentMethod === 'convenience'}
                            onChange={(e) => setPaymentMethod(e.target.value)}
                        />
                        <span>コンビニ払い</span>
                    </label>
                    {/* 💳 コンビニ払いの説明 */}
                    <div className="mt-4">

                        {/* コンビニ払い */}
                        {paymentMethod === 'convenience' && (
                            <div className="bg-gray-100 p-4 rounded text-sm leading-relaxed">
                                <p>
                                    ご注文後にお支払い番号が発行されます。
                                </p>
                                <p>
                                    お近くのコンビニでお支払いください。
                                </p>
                                <p>
                                    ※支払い期限を過ぎると自動キャンセルとなります。
                                </p>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            <FooterLogin />
        </>
    );
}

