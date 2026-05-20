const API_BASE =
    typeof window === "undefined"
        ? process.env.NEXT_PUBLIC_API_BASE_URL
        : process.env.NEXT_PUBLIC_API_URL;

export async function apiFetch(
    path: string,
    options: RequestInit = {}
) {
    const isFormData = options.body instanceof FormData;
    const res = await fetch(`${API_BASE}${path}`, {
        ...options,
        headers: {
            Accept: 'application/json',
            ...(isFormData
                ? {}
                : { 'Content-Type': 'application/json' }),

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