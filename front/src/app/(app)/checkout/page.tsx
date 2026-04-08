'use client';

import Header from '../../components/Header';
import FooterLogin from "../../components/FooterLogin";
import { useCart } from '@/lib/context/CartContext';
import { useState, useEffect } from 'react';
import CheckoutForm from '../../components/CheckoutForm';
import { loadStripe } from '@stripe/stripe-js';
import { Elements } from '@stripe/react-stripe-js';
import { createPayment, getPaymentWays } from '@/lib/api/paymentApi';
import { createOrder } from '@/lib/api/orderApi';
import { useUser } from '@/lib/context/UserContext';
import { useRouter } from 'next/navigation';


export default function CheckoutPage() {
    const { cartItems, clearCart } = useCart();

    // 小計
    const subtotal = cartItems.reduce((sum, item) => {
        return sum + item.price * item.quantity;
    }, 0);

    // 配送料（今回は0円）
    const shipping = 0;

    // 合計
    const total = subtotal + shipping;

    //支払い方法
    const [paymentWays, setPaymentWays] = useState<any[]>([]);
    useEffect(() => {
        const fetchData = async () => {
            const data = await getPaymentWays();
            setPaymentWays(data);
        };
        fetchData();
    }, []);

    //注文時にpayment_statusを決定するためpayment_wayを取得
    const [selectedPaymentWayId, setSelectedPaymentWayId] = useState<number | null>(null);

    //Stripe初期化
    const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_KEY!);

    //カード情報保存
    const [paymentMethodId, setPaymentMethodId] = useState<string | null>(null);

    //paymentApiからデータを受け取り注文を確定する
    const { user } = useUser();
    const router = useRouter();

    const handleOrder = async () => {

        if (!selectedPaymentWayId) {
            alert('支払い方法を選択してください');
            return;
        }

        try {

            // 💳 クレジットカードの場合
            if (paymentWays.find(w => w.id === selectedPaymentWayId)?.payment_way === 'クレジット') {

                if (!paymentMethodId) {
                    alert('カード情報を入力してください');
                    return;
                }

                const data = await createPayment(total, paymentMethodId);

                const stripe = await stripePromise;

                const result = await stripe!.confirmCardPayment(data.clientSecret, {
                    payment_method: paymentMethodId,
                });

                if (result.error) {
                    alert(result.error.message);
                    return;
                }

                if (result.paymentIntent.status !== 'succeeded') {
                    alert('決済に失敗しました');
                    return;
                }
            }

            // 🧾 注文作成（クレカでもコンビニでも共通）
            const res = await createOrder({
                user_id: user ? user.id : null,
                payment_way_id: selectedPaymentWayId,
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

            await clearCart();

            const selectedWay = paymentWays.find(w => w.id === selectedPaymentWayId);

            if (selectedWay?.payment_way === 'コンビニ払い') {
                router.push(`/checkout/complete?number=${res.payment_number}&limit=${res.payment_limit}`);
            } else {
                router.push('/checkout/complete');
            }


        } catch (error) {
            console.error(error);
            alert('エラーが発生しました');
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

                    {paymentWays.map((way) => (
                        <div key={way.id}>
                            <label className="flex items-center gap-3 cursor-pointer">
                                <input
                                    type="radio"
                                    name="payment"
                                    value={way.id}
                                    checked={selectedPaymentWayId === way.id}
                                    onChange={() => setSelectedPaymentWayId(way.id)}
                                />
                                <span>{way.payment_way}</span>
                            </label>

                            {/* クレカ */}
                                {selectedPaymentWayId === way.id && way.payment_way === 'クレジット' && (
                                    <Elements stripe={stripePromise}>
                                        <CheckoutForm setPaymentMethodId={setPaymentMethodId} />
                                    </Elements>
                                )}

                                {/* コンビニ */}
                                {selectedPaymentWayId === way.id && way.payment_way === 'コンビニ払い' && (
                                    <div className="bg-gray-100 p-4 rounded text-sm">
                                    コンビニでお支払いください。
                                    お支払い確認後に商品発送となります。
                                    </div>
                                )}
                        </div>
                    ))}
                </div>
            </div>

            <FooterLogin />
        </>
    );
}

