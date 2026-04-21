import { apiFetch } from "./apiClient";

// ユーザー情報更新
export async function updateUser(data: {
    user_id: number;
    last_name: string;
    first_name: string;
    postcode: string;
    address: string;
    tel: string;
    placement: boolean;
    place_of_placement: string;
    email: string;
}) {
    return apiFetch('/api/user', {
        method: 'PUT',
        body: JSON.stringify(data),
    });
}