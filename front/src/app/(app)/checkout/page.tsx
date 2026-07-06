'use client';

import Header from '../../components/Header';
import FooterLogin from "../../components/FooterLogin";
import { useCart } from '@/lib/context/CartContext';
import { useState, useEffect } from 'react';
import { createPayment, getPaymentMethods } from '@/lib/api/paymentApi';
import { createOrder } from '@/lib/api/orderApi';
import { useUser } from '@/lib/context/UserContext';
import { useRouter } from 'next/navigation';
import PaymentMethodSelector from '../../components/purchase/PaymentMethodSelector';
import { loadStripe } from '@stripe/stripe-js';
import OrderSummary from '../../components/purchase/OrderSummary';
import ShippingInfo from '../../components/purchase/ShippingInfo';
import { useToast } from '@/lib/context/ToastContext';


export default function CheckoutPage() {
    const [paymentError, setPaymentError] = useState('');

    //支払い方法
    const [paymentWays, setPaymentWays] = useState<any[]>([]);
    useEffect(() => {
        const fetchData = async () => {
            const data = await getPaymentMethods();
            setPaymentWays(data);
        };
        fetchData();
    }, []);

    //注文時にpayment_statusを決定するためpayment_wayを取得
    const [selectedPaymentWayId, setSelectedPaymentWayId] = useState<number | null>(null);

    //カード情報保存
    const [paymentMethodId, setPaymentMethodId] = useState<string | null>(null);

    //カートの中身取得
    const { cartItems, clearCart } = useCart();

    //stripeを初期化
    const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_KEY!);

    //paymentApiからデータを受け取り注文確定
    const { user } = useUser();
    const router = useRouter();
    const { showToast } = useToast();

    const handleOrder = async (total: number) => {

        // 前回のStripeエラーを消す
        setPaymentError('');

        if (!selectedPaymentWayId) {
            // エラーメッセージ
            showToast('支払い方法を選択してください', 'error');
            return;
        }

        try {

            // 💳 クレジットカードの場合
            if (paymentWays.find(w => w.id === selectedPaymentWayId)?.payment_way === 'クレジット') {

                if (!paymentMethodId) {
                    // エラーメッセージ
                    showToast('カード情報を入力してください', 'error');
                    return;
                }

                const data = await createPayment(total, paymentMethodId);
                const stripe = await stripePromise;
                const result = await stripe!.confirmCardPayment(data.clientSecret, {
                    payment_method: paymentMethodId,
                });

                if (result.error) {
                    setPaymentError(result.error.message ?? '決済に失敗しました');
                    return;
                }

                if (result.paymentIntent.status !== 'succeeded') {
                    // エラーメッセージ
                    showToast('決済に失敗しました', 'error');
                    return;
                }
            }

            // 🧾 注文作成（クレカでもコンビニでも共通）
            const res = await createOrder({
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
                router.push(`/checkout/complete?orderId=${res.order_id}&number=${res.payment_number}&confirmation=${res.confirmation_number}&limit=${res.payment_limit}`);
            } else {
                router.push('/checkout/complete');
            }


        } catch (error) {
            console.error(error);
            // エラーメッセージ
            showToast('エラーが発生しました', 'error');
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

                    {paymentError && (
                        <p className="mt-3 text-sm text-red-600">
                            {paymentError}
                        </p>
                    )}

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

