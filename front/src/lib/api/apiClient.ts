const API_BASE =
    typeof window === "undefined"
        ? process.env.NEXT_PUBLIC_API_BASE_URL
        : process.env.NEXT_PUBLIC_API_URL;

export async function apiFetch(
    path: string,
    options: RequestInit = {}
) {
    const isFormData = options.body instanceof FormData;

    // 保存したトークンを取得
    const token =
        typeof window !== 'undefined'
            ? localStorage.getItem('token')
            : null;

    const res = await fetch(`${API_BASE}${path}`, {
        ...options,
        headers: {
            Accept: 'application/json',
            ...(isFormData
                ? {}
                : { 'Content-Type': 'application/json' }),

            // トークンがある場合だけ Authorization ヘッダーを付与
            ...(token
                ? { Authorization: `Bearer ${token}` }
                : {}),

            ...(options.headers || {}),
        },
    });

    const data = await res.json();

    if (!res.ok) {
        throw {
            status: res.status,
            message: data.message,
        };
    }

    return data;
}