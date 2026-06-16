import { apiFetch } from './apiClient';

// 販売者一覧画面用型
export type SellerListItem = {
    id: number;
    seller_name: string;
    postcode: string;
    address: string;
    tel: string;
    is_active: boolean;
    status: string;
    created_at: string;
};

// 販売者詳細画面用型
export type SellerDetail = {
    id: number;
    seller_name: string;
    postcode: string;
    address: string;
    tel: string;
    is_active: boolean;
    status: string;
    created_at: string;
    updated_at: string;
};

// 販売者一覧取得
export async function fetchSellers(
    keyword?: string
): Promise<SellerListItem[]> {
    const query = keyword
        ? `?keyword=${encodeURIComponent(keyword)}`
        : '';

    return apiFetch(`/api/admin/sellers${query}`);
}

// 販売者詳細取得
export async function fetchSellerDetail(
    id: number
): Promise<SellerDetail> {
    return apiFetch(`/api/admin/sellers/${id}`);
}

//販売者 停止/再開
export async function toggleSellerStatus(id: number) {
    return apiFetch(`/api/admin/sellers/${id}/status`, {
        method: 'PATCH',
    });
}

// 販売者削除処理
export async function deleteSeller(id: number) {
    return apiFetch(`/api/admin/sellers/${id}`, {
        method: 'DELETE',
    });
}

// 販売者情報編集画面用型
export type UpdateAdminSellerRequest = {
    seller_name: string;
    postcode: string;
    address: string;
    tel: string;
};

// 販売者情報編集・更新
export async function updateAdminSeller(
    id: number,
    data: UpdateAdminSellerRequest
) {
    return apiFetch(`/api/admin/sellers/${id}`, {
        method: 'PUT',
        body: JSON.stringify(data),
    });
}

// 販売者 新規登録用型
export type CreateSellerRequest = {
    seller_name: string;
    postcode: string;
    address: string;
    tel: string;
};

// 販売者 新規登録
export async function createSeller(
    data: CreateSellerRequest
) {
    return apiFetch('/api/admin/sellers', {
        method: 'POST',
        body: JSON.stringify(data),
    });
}