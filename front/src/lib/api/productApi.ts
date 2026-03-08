import { Product } from "@/types/Product";
import { apiFetch } from "./apiClient";

// 商品一覧
export async function fetchProducts(): Promise<Product[]> {
    return apiFetch("/api/products");
    }

    // 商品詳細
    export async function fetchProductById(id: string): Promise<Product> {
    return apiFetch(`/api/products/${id}`);
}