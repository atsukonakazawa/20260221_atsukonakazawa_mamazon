'use client';
import Header from '../../components/Header';
import FooterLogin from "../../components/FooterLogin";
import { useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useUser } from '@/lib/UserContext';
import { fetchProducts } from '@/lib/api/productApi';
import useSWR from 'swr';
import { Product } from '@/types/Product';
import Link from 'next/link';
import ProductCard from "../../components/ProductCard";


export default function MyPage() {
    const { user } = useUser();
    const router = useRouter();

    //検索ワード取得
    const searchParams = useSearchParams();
    const keyword = searchParams.get("keyword");

    //５秒ごとに自動再取得
    //検索がかかったら検索内容の再取得
    const fetcher = () => fetchProducts(keyword ?? undefined);
    const { data: products, error, isLoading } = useSWR<Product[]>(
        ['products', keyword],
        fetcher,
        { refreshInterval: 5000 }
    );

    //ログインチェック
    useEffect(() => {
        if (!user) {
            router.push('/auth');
        }
    }, [user, router]);

    if (isLoading) return <p>Loading...</p>;
    if (!user) return null;
    if (!products) return <div>読み込み中...</div>;
    if (error) return <p>Error...</p>;

    return (
        <>
            <Header />

            <div className="p-4 sm:p-8">
                <h2 className="text-xl mb-4 font-bold">
                    {keyword ? `「${keyword}」の検索結果` : "商品一覧"}
                </h2>
                {products.length === 0 ? (
                <div className="text-center py-20">
                    <p className="text-xl font-semibold">
                    「{keyword}」の検索結果は見つかりませんでした
                    </p>

                    <p className="text-gray-500 mt-3">
                    別のキーワードを試してください
                    </p>

                    <button
                    onClick={() => router.push("/mypage")}
                    className="mt-6 px-4 py-2 bg-yellow-400 rounded cursor-pointer"
                    >
                    商品一覧に戻る
                    </button>
                </div>
            ) : (
                <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 justify-items-center">
                {products.map((product) => (
                    <Link
                    key={product.id}
                    href={`/products/${product.id}`}
                    className="w-full max-w-xs cursor-pointer hover:opacity-80 active:scale-95 transition"
                    >
                    <ProductCard product={product} />
                    </Link>
                ))}
                </div>
            )}

            </div>

            <FooterLogin />
        </>
    );
}
