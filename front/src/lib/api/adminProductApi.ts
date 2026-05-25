import { apiFetch } from "./apiClient";

// 商品一覧画面用の型
export type ProductList = {
    id: number;
    category?: {
        id: number;
        category_name: string;
    };
    shipmentDate?: {
        id: number;
        shipment_date: string;
    };
    seller?: {
        id: number;
        seller_name: string;
    };
    product_name: string;
    product_price: string;
    is_active: boolean;
    status: string;
    updated_at: string;
};

// 商品詳細画面用の型
export type ProductDetail = {
    id: number;
    category_id: string;
    shipment_date_id: string;
    seller_id: string;
    color_id?: string;
    size_id?: string;
    category?: {
        id: number;
        category_name: string;
    };
    shipmentDate?: {
        id: number;
        shipment_date: string;
    };
    seller?: {
        id: number;
        seller_name: string;
    };
    product_name: string;
    product_price: string;
    color?: {
        id: number;
        color_name: string;
    };
    size?: {
        id: number;
        size_name: string;
    };
    product_description?: string;
    is_active: boolean;
    status: string;
    created_at: string;
    updated_at: string;
    images?: {
        id: number;
        image_path: string;
        sort_order: number;
    }[];
};

// 商品一覧 取得
export async function fetchProducts(
    keyword?: string
): Promise<ProductList[]> {
    const query = keyword
        ? `?keyword=${encodeURIComponent(keyword)}`
        : '';
    return apiFetch(`/api/admin/products${query}`);
}

//商品詳細 取得
export async function fetchProductDetail(
    id: number
): Promise<ProductDetail> {
    return apiFetch(`/api/admin/products/${id}`);
}

//商品 停止/再開
export async function toggleProductStatus(id: number) {
    return apiFetch(`/api/admin/products/${id}/status`, {
        method: 'PATCH',
    });
}

// 商品 削除処理
export async function deleteProduct(id: number) {
    return apiFetch(`/api/admin/products/${id}`, {
        method: 'DELETE',
    });
}

// 商品情報 編集画面用の型
export type UpdateAdminProductRequest = {
    category_id: number;
    color_id?: number;
    shipment_date_id: number;
    size_id?: number;
    seller_id: number;
    product_name: string;
    product_price: string;
    product_description?: string;
    images?: {
        id: number;
        image_path: string;
        sort_order: number;
    }[];
};

// 商品 情報編集時のセレクト候補取得用
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
    colors: {
        id: number;
        color_name: string;
    }[];
    sizes: {
        id: number;
        size_name: string;
    }[];
};

// 商品 情報編集時のセレクト候補取得
export async function fetchProductFormOptions(): Promise<ProductFormOptions> {
    return apiFetch('/api/admin/products/form-options');
}

// 商品 情報編集・更新
export async function updateAdminProduct(
    id: number,
    data: FormData
) {
    return apiFetch(`/api/admin/products/${id}`, {
        method: 'POST',
        body: data,
    });
}

// 新規作成
export async function createAdminProduct(
    data: UpdateAdminProductRequest
) {
    return apiFetch('/api/admin/products', {
        method: 'POST',
        body: JSON.stringify(data),
    });
}



