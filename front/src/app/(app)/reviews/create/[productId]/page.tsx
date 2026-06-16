'use client';

import { useUser } from '@/lib/context/UserContext';
import { useParams, useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import Header from '../../../../components/Header';
import FooterLogin from '../../../../components/FooterLogin';
import { Product } from '@/types/Product';
import { fetchProductById } from '@/lib/api/productApi';
import {
    checkReviewPermission,
    createReview,
} from '@/lib/api/reviewApi';
import StarRating from '../../../../components/review/StarRating';

export default function ReviewCreatePage() {
    const { user } = useUser();
    const userId = user?.id;
    const params = useParams();
    const router = useRouter();

    //商品情報取得
    const productId = Number(params.productId);
    const [product, setProduct] = useState<Product | null>(null);

    const [score, setScore] = useState(5);
    const [comment, setComment] = useState('');
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');


    // レビュー投稿可否チェック
    useEffect(() => {
        if (!userId) return;

        const verifyPermission = async () => {
            try {
                await checkReviewPermission(productId, userId);
            } catch {
                alert('この商品はお届け後にレビュー可能です。');
                router.push('/orders');
            }
        };

        verifyPermission();

    }, [productId, userId, router]);

    //商品情報を取得
    useEffect(() => {
        const fetchProduct = async () => {
            try {
                const data = await fetchProductById(productId);
                setProduct(data);
            } catch (error) {
                console.error('商品取得エラー:', error);
            }
        };

        if (productId) {
            fetchProduct();
        }
    }, [productId]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!userId) {
            alert('ログインしてください。');
            return;
        }

        if (!product) {
        alert('商品情報を取得中です。');
        return;
    }

        try {
            await createReview({
                user_id: userId,
                product_id: productId,
                score,
                comment,
            });

            const productName = product.product_name;
            const productImage = product.images?.[0]?.image_path ?? '';

            router.push(
                `/reviews/complete?product_name=${encodeURIComponent(productName)}&product_image=${encodeURIComponent(productImage)}&score=${score}&comment=${encodeURIComponent(comment)}`
            );
        } catch {
            alert('レビューの投稿に失敗しました。');
        }
    };

    return (
        <>
            <Header />
            <div className="max-w-2xl mx-auto p-6">
                <h1 className="text-2xl font-bold mb-4">
                    商品レビューを書く
                </h1>

                {message && (
                    <p className="text-green-600 mb-2">{message}</p>
                )}
                {error && (
                    <p className="text-red-600 mb-2">{error}</p>
                )}

                {product && (
                    <div className="flex items-center gap-4 mb-6 border p-4 rounded">
                        <img
                            src={`http://localhost/storage/${product.images?.[0]?.image_path ?? ''}`}
                            alt={product.product_name}
                            className="w-20 h-20 object-contain"
                        />
                        <p className="font-semibold">{product.product_name}</p>
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block font-semibold mb-2">評価</label>
                        <StarRating score={score} setScore={setScore} />
                    </div>

                    <div>
                        <label className="block font-semibold">
                            コメント
                        </label>
                        <textarea
                            value={comment}
                            onChange={(e) => setComment(e.target.value)}
                            className="border p-2 rounded w-full"
                            rows={5}
                            required
                        />
                    </div>

                    <button
                        type="submit"
                        className="bg-yellow-400 px-4 py-2 rounded hover:bg-yellow-500 cursor-pointer"
                    >
                        投稿する
                    </button>
                </form>
            </div>
            <FooterLogin />
        </>
    );
}