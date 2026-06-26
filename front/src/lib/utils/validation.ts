
// メール
export const isValidEmail = (input: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(input);
};

// 電話番号（ハイフン除去・全角対応）
export const normalizePhone = (input: string) => {
    return input
        .replace(/[０-９]/g, (s) =>
        String.fromCharCode(s.charCodeAt(0) - 0xFEE0)
        )
        .replace(/[-－−ー―‐ｰ]/g, "")
        .replace(/\s/g, "");
};

//　電話番号（10~11桁の数字になっているかチェック)
export const isValidPhone = (input: string) => {
    const phone = normalizePhone(input);
    return /^[0-9]{10,11}$/.test(phone);
};

// パスワード
export const isValidPassword = (input: string) => {
    return input.length >= 8;
};

// 郵便番号の正規化
export const normalizePostcode = (input: string) => {
    return input
        .replace(/[０-９]/g, (s) =>
            String.fromCharCode(s.charCodeAt(0) - 0xFEE0)
        )
        .replace(/[-－−ー―‐ｰ]/g, '')
        .replace(/\s/g, '');
};

// 郵便番号バリデーション
export const isValidPostcode = (input: string) => {
    const postcode = normalizePostcode(input);

    return /^[0-9]{7}$/.test(postcode);
};

//エラーメッセージ
export const validateUserForm = (data: {
    first_name: string;
    last_name: string;
    email: string;
    tel: string;
    password?: string;
    password_confirm?: string;
    postcode: string;
    address: string;
    date_of_birth?: string;
}) => {

    if (!data.first_name || !data.last_name) {
        return "名前を入力してください";
    }

    if (!data.tel) {
        return "電話番号を入力してください";
    }

    if (!data.email) {
        return "メールアドレスを入力してください";
    }

    if (!data.postcode) {
        return "郵便番号を入力してください";
    }

    if (!data.address) {
        return "住所を入力してください";
    }

    if (
        data.date_of_birth !== undefined &&
        data.date_of_birth.trim() === ""
    ) {
        return "生年月日を入力してください";
    }

    if (!isValidEmail(data.email)) {
        return "正しいメールアドレス形式で入力してください";
    }

    if (!isValidPhone(data.tel)) {
        return "電話番号は10〜11桁の数字で入力してください";
    }

    if (!isValidPostcode(data.postcode)) {
        return "郵便番号は7桁の半角数字(ハイフンなし)で入力してください";
    }

    // パスワードは「ある時だけチェック」
    if (data.password) {
        if (!isValidPassword(data.password)) {
        return "パスワードは8文字以上で入力してください";
        }

        if (data.password !== data.password_confirm) {
        return "パスワードが一致しません";
        }
    }

    return null; // OK
};

// 管理画面用バリデーション（販売者）
export const validateSellerForm = (data: {
    seller_name: string;
    email?: string;
    tel: string;
    postcode: string;
    address: string;
}) => {
    if (!data.seller_name) {
        return "販売者名を入力してください";
    }

    if (!data.tel) {
        return "電話番号を入力してください";
    }

    if (!data.postcode) {
        return "郵便番号を入力してください";
    }

    if (!data.address) {
        return "住所を入力してください";
    }

    // email がある場合だけチェック
    if (data.email && !isValidEmail(data.email)) {
        return "正しいメールアドレス形式で入力してください";
    }

    if (!isValidPhone(data.tel)) {
        return "電話番号は10〜11桁の数字で入力してください";
    }

    if (!isValidPostcode(data.postcode)) {
        return "郵便番号は7桁の半角数字(ハイフンなし)で入力してください";
    }

    return null;
};

// 管理画面用バリデーション（商品）
export const validateProductForm = (data: {
    category_id: string;
    color_id?: string;
    shipment_date_id: string;
    size_id?: string;
    seller_id: string;
    product_name: string;
    product_price: string;
    product_description?: string;
    created_by: string;
    images?: File[];
    requireImage?: boolean;
}) => {
    if (!data.product_name) {
        return "商品名を入力してください";
    }

    if (!data.product_price) {
        return "価格を入力してください";
    }

    if (!data.category_id) {
        return "カテゴリーを入力してください";
    }

    if (!data.seller_id) {
        return "販売会社を入力してください";
    }

    if (!data.shipment_date_id) {
        return "出荷予定日を入力してください";
    }

    if (!data.created_by) {
        return "登録担当者を入力してください";
    }

    if (data.requireImage && (!data.images || data.images.length === 0)) {
        return "画像を追加してください";
    }
    return null;
};


