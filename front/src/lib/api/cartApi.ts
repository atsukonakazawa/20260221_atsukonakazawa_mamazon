import { apiFetch } from "./apiClient";

// カート追加
export async function addCart(productId: number, userId: number) {
    return apiFetch('/api/cart', {
        method: 'POST',
        body: JSON.stringify({
            product_id: productId,
            user_id: userId,
        }),
    });
}

// カート取得
export async function fetchCart(userId: number) {
    return apiFetch(`/api/cart?user_id=${userId}`);
}

// 数量変更
export async function updateCart(
    cartId: number,
    type: 'increase' | 'decrease',
    userId: number
    ) {
    return apiFetch(`/api/cart/${cartId}`, {
        method: 'PATCH',
        body: JSON.stringify({
            type,
            user_id: userId,
        }),
    });
}

// 削除
export async function deleteCart(cartId: number) {
    return apiFetch(`/api/cart/${cartId}`, {
        method: 'DELETE',
    });
}