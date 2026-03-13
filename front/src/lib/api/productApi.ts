import { Product } from "@/types/Product";
import { apiFetch } from "./apiClient";

// 商品一覧
export async function fetchProducts(keyword?: string): Promise<Product[]> {

    const query = keyword
        ? `?keyword=${encodeURIComponent(keyword)}`
        : "";

    return apiFetch(`/api/products${query}`);
    }

    // 商品詳細
    export async function fetchProductById(id: string): Promise<Product> {
    return apiFetch(`/api/products/${id}`);
}