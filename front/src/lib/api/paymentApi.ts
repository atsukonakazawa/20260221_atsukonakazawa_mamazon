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