import { apiFetch } from "./apiClient";

export type UpdateUserRequest = {
    last_name: string;
    first_name: string;
    postcode: string;
    address: string;
    tel: string;
    placement: boolean;
    place_of_placement: string;
    email: string;
    password?: string;
};

// ユーザー情報更新
export async function updateUser(data: UpdateUserRequest) {
    return apiFetch('/api/user', {
        method: 'PUT',
        body: JSON.stringify(data),
    });
}