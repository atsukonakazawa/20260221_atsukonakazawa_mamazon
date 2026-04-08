import { apiFetch } from "./apiClient";

export async function createPayment(amount: number, paymentMethodId: string) {
    return apiFetch('/api/payment', {
        method: 'POST',
        body: JSON.stringify({
            amount,
            paymentMethodId,
        }),
    });
}

export const getPaymentWays = async () => {
    return await apiFetch('/api/payment-ways');
};