'use client';

import CheckoutForm from './CheckoutForm';
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';

//Stripe初期化
const stripePromise = loadStripe(
    process.env.NEXT_PUBLIC_STRIPE_KEY!
);

type PaymentWay = {
    id: number;
    payment_way: string;
};

type Props = {
    paymentWays: PaymentWay[];
    selectedPaymentWayId: number | null;
    setSelectedPaymentWayId: (id: number) => void;
    setPaymentMethodId: (id: string | null) => void;
};

export default function PaymentMethodSelector({
    paymentWays,
    selectedPaymentWayId,
    setSelectedPaymentWayId,
    setPaymentMethodId,
}: Props) {
    return (
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
                            onChange={() =>
                                setSelectedPaymentWayId(way.id)
                            }
                        />
                        <span>{way.payment_way}</span>
                    </label>

                    {/* クレジットカード */}
                    {selectedPaymentWayId === way.id &&
                        way.payment_way === 'クレジット' && (
                            <Elements stripe={stripePromise}>
                                <CheckoutForm
                                    setPaymentMethodId={
                                        setPaymentMethodId
                                    }
                                />
                            </Elements>
                        )}

                    {/* コンビニ払い */}
                    {selectedPaymentWayId === way.id &&
                        way.payment_way === 'コンビニ払い' && (
                            <div className="bg-gray-100 p-4 rounded text-sm">
                            注文履歴からお支払い番号をご確認の上、コンビニでお支払いください。<br/>
                                お支払い確認後に商品発送となります。
                            </div>
                        )}
                </div>
            ))}
        </div>
    );
}