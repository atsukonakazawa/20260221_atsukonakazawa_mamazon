import { apiFetch } from "./apiClient";

//ユーザー一覧画面用
export type UserListItem = {
    id: number;
    first_name: string;
    last_name: string;
    email?: string;
    tel?: string;
    placement: boolean;
    is_active: boolean;
    status: string;
    created_at: string;
};

//ユーザー詳細画面用
export type UserDetail = {
    id: number;
    first_name: string;
    last_name: string;
    email?: string;
    tel?: string;
    postcode?: string;
    address?: string;
    date_of_birth?: string;
    placement: boolean;
    place_of_placement?: string;
    sms_verified_at?: string;
    email_verified_at?: string;
    created_at: string;
    updated_at: string;
    is_active: boolean;
};

//ユーザー一覧取得
export async function fetchUsers(keyword?: string): Promise<UserListItem[]> {
    const query = keyword ? `?keyword=${encodeURIComponent(keyword)}` : '';
    return apiFetch(`/api/admin/users${query}`);
}

//ユーザー詳細取得
export async function fetchUserDetail(id: number): Promise<UserDetail> {
    return apiFetch(`/api/admin/users/${id}`);
}

//ユーザー停止/再開
export async function toggleUserStatus(id: number) {
    return apiFetch(`/api/admin/users/${id}/status`, {
        method: 'PATCH',
    });
}

//ユーザー退会処理
export async function withdrawUser(id: number) {
    return apiFetch(`/api/admin/users/${id}/withdraw`, {
        method: 'PATCH',
    });
}

//ユーザー情報編集画面用
export type UpdateAdminUserRequest = {
    last_name: string;
    first_name: string;
    email?: string;
    tel?: string;
    postcode?: string;
    address?: string;
    date_of_birth?: string;
    placement: boolean;
    place_of_placement?: string;
};

//ユーザー情報編集・更新
export async function updateAdminUser(
    id: number,
    data: UpdateAdminUserRequest
) {
    return apiFetch(`/api/admin/users/${id}`, {
        method: 'PUT',
        body: JSON.stringify(data),
    });
}
