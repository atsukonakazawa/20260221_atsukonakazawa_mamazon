'use client';
import Header from '../../components/Header';
import FooterLogin from "../../components/FooterLogin";
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useUser } from '@/lib/UserContext';
import { fetchProducts } from '@/lib/api/productApi';
import useSWR from 'swr';
import { Product } from '@/types/Product';
import Link from 'next/link';
import ProductCard from "../../components/ProductCard";


export default function MyPage() {
    const { user } = useUser();
    const router = useRouter();

    //５秒ごとに自動再取得
    const fetcher = () => fetchProducts();
    const { data: products, error, isLoading } = useSWR<Product[]>(
        'products',
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
                <h2 className="text-xl mb-4 font-bold">商品一覧</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 justify-items-center">
                    {products.map((product) => (
                    <Link
                        key={product.id}
                        href={`/products/${product.id}`}
                        className="w-full max-w-xs"
                    >
                        <ProductCard product={product} />
                    </Link>
                    ))}
                </div>
            </div>

            <FooterLogin />
        </>
    );
}
