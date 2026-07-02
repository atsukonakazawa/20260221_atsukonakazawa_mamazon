'use client';

import { Roboto_Condensed } from 'next/font/google';
import { useSearchParams } from "next/navigation";
import FooterLogin from "@/app/components/FooterLogin";
import { useState, useEffect, Suspense } from 'react';
import { useRouter } from 'next/navigation';
import { fetchProducts } from '@/lib/api/productApi';
import useSWR from 'swr';
import { Product } from '@/types/Product';
import Link from 'next/link';
import ProductCard from "@/app/components/products/ProductCard";

const robotoCondensed = Roboto_Condensed({
    subsets: ['latin'],
    weight: ['400', '700'],
});

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

  //検索実行関数
  const handleSearch = () => {
    if (!keyword) return;
    router.push(`/?keyword=${encodeURIComponent(keyword)}`);
  };

  //よく使われるワードで検索(クイック検索)
  const handleQuickSearch = (word: string) => {
    router.push(`/?keyword=${encodeURIComponent(word)}`);
  };

  const quickWords = [
    "ボディクリーム",
    "リラックス",
    "おしゃぶり",
    "オムツ",
    "ミルク",
    "おしりふき",
    "ハーブティー",
    "おやつ",
    "哺乳瓶",
    "エプロン"
  ];

    if (isLoading) return <p>Loading...</p>;
    if (!products) return <div>読み込み中...</div>;
    if (error) return <p>Error...</p>;

  return (
    <>
      <header
        className={`${robotoCondensed.className}  pt-0 p-4 px-0`}
      >
        {/* PC用ヘッダー */}
        <div className="hidden sm:flex flex-col">
          <div className="flex w-full p-3 items-center bg-[#8B82B6] ">

              {/* ロゴ */}
            <Link href="/">
              <h1 className="text-white font-extrabold text-xl sm:text-2xl flex leading-none whitespace-nowrap">
                mamazon
                <span className="ml-1 text-xs sm:text-sm font-normal self-end">
                  .co.jp
                </span>
              </h1>
            </Link>

              {/* 検索フォーム */}
            <div className="ml-5 flex flex-1 mx-2">
              <input
                type="text"
                placeholder="mamazonで検索"
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    handleSearch();
                  }
                }}
                className="w-full px-3 py-2 rounded-l-md bg-white text-black outline-none"
              />
              <button
                onClick={handleSearch}
                className="bg-yellow-400 px-4 rounded-r-md cursor-pointer active:scale-95 transition">
                🔍
              </button>
            </div>

              {/* ログインボタン */}
            <Link href="/auth">
              <div className="ml-5 text-white text-xs sm:text-sm cursor-pointer whitespace-nowrap">
                <div className="font-bold">ログイン・アカウント登録</div>
              </div>
            </Link>

          </div>

          {/* 下段：横スクロール可能エリア */}
          <div className="flex gap-3 m-3 overflow-x-auto whitespace-nowrap no-scrollbar">

            {/* クイックサーチ */}
            <div className="flex gap-3 overflow-x-auto whitespace-nowrap no-scrollbar">
              {quickWords.map((word) => (
                <button
                  key={word}
                  onClick={() => handleQuickSearch(word)}
                  className="px-3 py-1 border rounded-full text-sm cursor-pointer active:scale-95 transition bg-white"
                >
                  {word}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* モバイル用ヘッダー */}
        <div className="sm:hidden px-4 py-2 space-y-2 bg-white">

          {/* 上段：検索フォーム */}
          <div className="flex">
            <input
              type="text"
              placeholder="mamazonで検索"
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  handleSearch();
                }
              }}
              className="w-full px-3 py-2 border rounded-l-md outline-none"
            />
            <button
              onClick={handleSearch}
              className="bg-yellow-400 px-4 rounded-r-md cursor-pointer active:scale-95 transition">
              🔍
            </button>
          </div>

          {/* 下段：横スクロール可能エリア */}
          <div className="flex gap-3 overflow-x-auto whitespace-nowrap no-scrollbar">

            {/* クイックサーチ */}
            <div className="flex gap-3 overflow-x-auto whitespace-nowrap no-scrollbar">
              {quickWords.map((word) => (
                <button
                  key={word}
                  onClick={() => handleQuickSearch(word)}
                  className="px-3 py-1 border rounded-full text-sm cursor-pointer active:scale-95 transition"
                >
                  {word}
                </button>
              ))}
            </div>
          </div>
        </div>
      </header>

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
