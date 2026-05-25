import { apiFetch } from './apiClient';

// 型定義
export type ProductFormOptions = {
    categories: {
        id: number;
        category_name: string;
    }[];

    shipment_dates: {
        id: number;
        shipment_date: string;
    }[];

    sellers: {
        id: number;
        seller_name: string;
    }[];
};

// 商品仮登録用型
export type ProductSubmissionRequest = {
    category_id: string;
    shipment_date_id: string;
    seller_id: string;

    product_name: string;
    product_price: string;
    product_description?: string;

    created_by: string;

    image: File;
};

// 商品仮登録時のオプション取得
export async function fetchProductSubmissionOptions():
    Promise<ProductFormOptions> {

    return apiFetch('/api/admin/products/form-options');
}

// 商品仮登録
export async function submitProduct(
    data: FormData
) {
    return apiFetch('/api/product-submissions', {
        method: 'POST',
        body: data,
    });
}