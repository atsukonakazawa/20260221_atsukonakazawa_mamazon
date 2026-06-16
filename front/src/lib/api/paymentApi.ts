import { apiFetch } from "./apiClient";

export async function createPayment(amount: number, paymentMethodId: string) {
    return apiFetch('/api/payment', {
        method: 'POST',
        headers: {
        "Content-Type": "application/json",
        },
        body: JSON.stringify({
            amount,
            paymentMethodId,
        }),
    });
}

export const getPaymentMethods = () => {
    return apiFetch('/api/payment-ways');
};