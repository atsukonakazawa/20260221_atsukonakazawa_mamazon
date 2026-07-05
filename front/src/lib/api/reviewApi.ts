import { apiFetch } from "./apiClient";

// レビュー投稿可否確認
export async function checkReviewPermission(
    productId: number,
) {
    return apiFetch(
        `/api/reviews/create/${productId}`
    );
}

// レビュー投稿
export async function createReview(data: {
    product_id: number;
    score: number;
    comment: string;
}) {
    return apiFetch('/api/reviews', {
        method: 'POST',
        body: JSON.stringify(data),
    });
}

// レビュー一覧取得
export async function fetchReviews(productId: number) {
    return apiFetch(`/api/products/${productId}/reviews`);
}