import { apiFetch } from "./apiClient";

export async function createOrder(data: any) {
    return apiFetch('/api/order', {
        method: 'POST',
        body: JSON.stringify(data),
    });
}

export async function fetchOrders(userId: number) {
    return apiFetch(`/api/orders?user_id=${userId}`);
}