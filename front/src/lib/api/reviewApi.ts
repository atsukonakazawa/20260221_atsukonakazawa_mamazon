import { apiFetch } from "./apiClient";

// レビュー投稿可否確認
export async function checkReviewPermission(
    productId: number,
    userId: number
) {
    return apiFetch(
        `/api/reviews/create/${productId}?user_id=${userId}`
    );
}

// レビュー投稿
export async function createReview(data: {
    user_id: number;
    product_id: number;
    score: number;
    comment: string;
}) {
    return apiFetch('/api/reviews', {
        method: 'POST',
        body: JSON.stringify(data),
    });
}