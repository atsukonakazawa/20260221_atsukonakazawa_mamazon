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
import { useToast } from '@/lib/context/ToastContext';

export default function ReviewCreatePage() {
    //商品情報取得
    const [product, setProduct] = useState<Product | null>(null);

    const [score, setScore] = useState(5);
    const [comment, setComment] = useState('');

    const { user } = useUser();
    const params = useParams();
    const router = useRouter();
    const { showToast } = useToast();
    const productId = Number(params.productId);


    // レビュー投稿可否チェック
    useEffect(() => {
        if (!user) return;

        const verifyPermission = async () => {
            try {
                await checkReviewPermission(productId);
            } catch {

                //エラーメッセージ
                showToast('この商品はお届け後にレビュー可能です。', 'error');
                //少し待ってから画面遷移
                setTimeout(() => {
                    router.push('/orders');
                }, 200);

            }
        };

        verifyPermission();

    }, [productId, user, router, showToast]);

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

        if (!user) {
            //エラーメッセージ
            showToast('ログインしてください。', 'error');
            return;
        }

        if (!product) {
            return;
        }

        try {
            await createReview({
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
            //エラーメッセージ
            showToast('レビューの投稿に失敗しました。', 'error');
        }
    };

    return (
        <>
            <Header />
            <div className="max-w-2xl mx-auto p-6">
                <h1 className="text-2xl font-bold mb-4">
                    商品レビューを書く
                </h1>

                {product && (
                    <div className="flex items-center gap-4 mb-6 border p-4 rounded">
                        <img
                            src={product.images?.[0]?.image_path || "/no-image.png"}
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