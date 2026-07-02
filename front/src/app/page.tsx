'use client';

import { useSearchParams } from "next/navigation";
import GuestHeader from "@/app/components/GuestHeader";
import FooterLogin from "@/app/components/FooterLogin";
import { useState, useEffect, Suspense } from 'react';
import { useRouter } from 'next/navigation';
import { fetchProducts } from '@/lib/api/productApi';
import useSWR from 'swr';
import { Product } from '@/types/Product';
import Link from 'next/link';
import ProductCard from "@/app/components/products/ProductCard";


export default function Home() {
  return (
    <Suspense fallback={<div>読み込み中...</div>}>
      <HomeContent />
    </Suspense>
  );
}

function HomeContent() {
  const router = useRouter();

  //検索ワード取得
  const searchParams = useSearchParams();
  const keywordFromUrl =
    searchParams.get("keyword") ?? "";
  const [keyword, setKeyword] = useState(keywordFromUrl);

  useEffect(() => {
      setKeyword(keywordFromUrl);
  }, [keywordFromUrl]);

  const fetcher = () => fetchProducts(keywordFromUrl || undefined);

  const { data: products, error, isLoading } = useSWR<Product[]>(
      ['products', keywordFromUrl],
      fetcher,
  );

  if (isLoading) return <p>Loading...</p>;
  if (!products) return <div>読み込み中...</div>;
  if (error) return <p>Error...</p>;

  return (
    <>
      <GuestHeader />

      <div className="p-4 sm:p-8">
        <h2 className="text-xl mb-4 font-bold">
            {keywordFromUrl ? `「${keywordFromUrl}」の検索結果` : "商品一覧"}
        </h2>
        {products.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-xl font-semibold">
              {`「${keywordFromUrl}」の検索結果は見つかりませんでした`}
            </p>

            <p className="text-gray-500 mt-3">
            別のキーワードを試してください
            </p>

            <button
            onClick={() => router.push("/")}
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
              <ProductCard
                product={product}
              />
              </Link>
          ))}
          </div>
        )}
      </div>
      <FooterLogin />
    </>
  );
}
