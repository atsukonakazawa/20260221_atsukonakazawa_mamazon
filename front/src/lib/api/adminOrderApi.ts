import { apiFetch } from "./apiClient";

// 注文一覧画面用型
export type OrderListItem = {
    id: number;
    created_at: string;
    user_name: string;
    total_amount: number;
    payment_status: string;
    shipment_status: string;
};

// 注文一覧 取得
export async function fetchOrders(
    keyword?: string
): Promise<OrderListItem[]> {

    const query = keyword
        ? `?keyword=${encodeURIComponent(keyword)}`
        : '';

    return apiFetch(`/api/admin/orders${query}`);
}

// 注文詳細画面用型
export type OrderDetail = {
    id: number;
    created_at: string;
    user_name: string;
    payment_way: string;
    payment_status: string;
    shipment_status: string;
    shipping_postcode: string;
    shipping_address: string;
    shipping_name: string;
    sender: string;
    total_price: number;
    items: {
        product_name: string;
        price: number;
        quantity: number;
        subtotal: number;
    }[];
};

// 注文詳細 取得
export async function fetchOrderDetail(
    id: number
): Promise<OrderDetail> {
    return apiFetch(`/api/admin/orders/${id}`);
}
