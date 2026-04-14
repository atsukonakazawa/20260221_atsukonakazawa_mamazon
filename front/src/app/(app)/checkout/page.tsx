'use client';

import Header from '../../components/Header';
import FooterLogin from "../../components/FooterLogin";
import { useCart } from '@/lib/context/CartContext';
import { useState, useEffect } from 'react';
import { createPayment, getPaymentWays } from '@/lib/api/paymentApi';
import { createOrder } from '@/lib/api/orderApi';
import { useUser } from '@/lib/context/UserContext';
import { useRouter } from 'next/navigation';
import PaymentMethodSelector from '../../components/purchase/PaymentMethodSelector';
import { loadStripe } from '@stripe/stripe-js';
import OrderSummary from '../../components/purchase/OrderSummary';
import ShippingInfo from '../../components/purchase/ShippingInfo';


export default function CheckoutPage() {
    //カートの中身取得
    const { cartItems, clearCart } = useCart();

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

    //カード情報保存
    const [paymentMethodId, setPaymentMethodId] = useState<string | null>(null);

    //stripeを初期化
    const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_KEY!);

    //paymentApiからデータを受け取り注文確定
    const { user } = useUser();
    const router = useRouter();
    const handleOrder = async (total: number) => {

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
                shipping_postcode: shippingInfo.shipping_postcode,
                shipping_address: shippingInfo.shipping_address,
                shipping_name: shippingInfo.shipping_name,
                sender: shippingInfo.sender,
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

    const [shippingInfo, setShippingInfo] = useState({
        shipping_postcode: '',
        shipping_address: '',
        shipping_name: '',
        sender: '',
    });

    return (
        <>
            <Header />

            <div className="p-6 max-w-2xl mx-auto">
                <h1 className="text-2xl font-bold mb-6">注文確認</h1>

                {/* 💰 金額エリアと確定ボタン */}
                <OrderSummary
                    cartItems={cartItems}
                    onOrder={handleOrder}
                />

                {/* 💳 支払い方法 */}
                <PaymentMethodSelector
                    paymentWays={paymentWays}
                    selectedPaymentWayId={selectedPaymentWayId}
                    setSelectedPaymentWayId={setSelectedPaymentWayId}
                    setPaymentMethodId={setPaymentMethodId}
                />

                {/* 📮 配送情報 */}
                <ShippingInfo
                    initialPostcode={user?.postcode || ''}
                    initialAddress={user?.address || ''}
                    initialShippingName={
                        user ? `${user.last_name}${user.first_name}` : ''
                    }
                    initialSender={
                        user ? `${user.last_name}${user.first_name}` : ''
                    }
                    onChange={setShippingInfo}
                />
            </div>
            <FooterLogin />
        </>
    );
}

