'use client';

import { CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { useToast } from '@/lib/context/ToastContext';

export default function CheckoutForm({ setPaymentMethodId }: any) {
    const stripe = useStripe();
    const elements = useElements();
    const { showToast } = useToast();

    const handleSaveCard = async () => {
        if (!stripe || !elements) return;

        const cardElement = elements.getElement(CardElement);

        const { error, paymentMethod } = await stripe.createPaymentMethod({
            type: 'card',
            card: cardElement!,
        });

        if (error) {
            //エラーメッセージ
            showToast(error.message ?? 'カード情報の保存に失敗しました', 'error');

        } else {
            //成功メッセージ
            showToast('カード情報を保存しました', 'success');

            setPaymentMethodId(paymentMethod.id); // ← 親に渡す🔥
        }
    };

    return (
        <div className="space-y-4">
            <CardElement
                options={{ hidePostalCode: true }}
                className="border p-4 rounded"
            />

            <button
                onClick={handleSaveCard}
                className="bg-yellow-400 p-3 rounded-full cursor-pointer"
            >
                このお支払い方法を使用
            </button>
        </div>
    );
}