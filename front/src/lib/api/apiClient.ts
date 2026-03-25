const API_BASE =
    typeof window === "undefined"
        ? process.env.NEXT_PUBLIC_API_BASE_URL
        : process.env.NEXT_PUBLIC_API_URL;

    export async function apiFetch(
        path: string,
        options: RequestInit = {}
    ) {
    const res = await fetch(`${API_BASE}${path}`, {
        ...options,
        headers: {
            'Content-Type': 'application/json', // 👈 これ追加
            ...(options.headers || {}),
        },
    });

    if (!res.ok) {
        throw new Error("API Error");
    }

    return res.json();
}