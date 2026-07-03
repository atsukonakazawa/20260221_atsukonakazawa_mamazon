import { apiFetch } from "./apiClient";

// カート追加
export async function addCart(productId: number) {
    return apiFetch('/api/cart', {
        method: 'POST',
        body: JSON.stringify({
            product_id: productId,
        }),
    });
}

// カート取得
export async function fetchCart() {
    return apiFetch(`/api/cart`);
}

// 数量変更
export async function updateCart(
    cartId: number,
    type: 'increase' | 'decrease',
    ) {
    return apiFetch(`/api/cart/${cartId}`, {
        method: 'PATCH',
        body: JSON.stringify({
            type,
        }),
    });
}

// カート削除
export async function clearCartApi() {
    return apiFetch('/api/cart/clear', {
        method: 'DELETE',
    });
}