
// メール
export const isValidEmail = (input: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(input);
};

// 電話番号（ハイフン・全角対応込み）
export const normalizePhone = (input: string) => {
    return input
        .replace(/[０-９]/g, (s) =>
        String.fromCharCode(s.charCodeAt(0) - 0xFEE0)
        )
        .replace(/-/g, "")
        .replace(/\s/g, "");
};

export const isValidPhone = (input: string) => {
    const phone = normalizePhone(input);
    return /^[0-9]{10,11}$/.test(phone);
};

// パスワード
export const isValidPassword = (input: string) => {
    return input.length >= 8;
};

// 郵便番号
export const isValidPostcode = (input: string) => {
    return /^[0-9]{7}$/.test(input);
};