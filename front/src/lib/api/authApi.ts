import { apiFetch } from "./apiClient";

// ユーザー確認
export async function checkUser(emailOrPhone: string) {
    return apiFetch("/api/check-user", {
        method: "POST",
        headers: {
        "Content-Type": "application/json",
        },
        body: JSON.stringify({
        email: emailOrPhone,
        }),
    });
}

// SMS認証コード送信
export async function sendSmsCode(payload: {
    tel: string;
    }): Promise<{ message: string; debug_code?: number }> {
    return apiFetch("/api/sms/send", {
        method: "POST",
        headers: {
        "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
    });
}

// SMS認証コード検証
export async function verifySmsCode(payload: {
    tel: string;
    code: string;
    }): Promise<{ success: boolean }> {
    return apiFetch("/api/sms/verify", {
        method: "POST",
        headers: {
        "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
    });
}

// 登録用payload
type RegisterPayload = {
    email: string;
    tel: string;
    password: string;
    first_name: string;
    last_name: string;
    postcode?: string;
    address?: string;
    date_of_birth?: string;
    placement?: boolean;
    place_of_placement?: string;
};

// ユーザー登録
export async function registerUser(data: RegisterPayload) {
    return apiFetch("/api/register", {
        method: "POST",
        headers: {
        "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
    });
}

// ログイン
export async function loginUser(data: {
    email: string;
    password: string;
    }) {
    return apiFetch("/api/login", {
        method: "POST",
        headers: {
        "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
    });
}