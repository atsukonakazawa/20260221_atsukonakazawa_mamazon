'use client';

import { Roboto_Condensed } from 'next/font/google';
import { useSearchParams } from "next/navigation";
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState, useEffect, Suspense } from 'react';
import { fetchProducts } from '@/lib/api/productApi';
import useSWR from 'swr';
import { Product } from '@/types/Product';


const robotoCondensed = Roboto_Condensed({
    subsets: ['latin'],
    weight: ['400', '700'],
});

export default function GuestHeader() {
    return (
        <Suspense fallback={<div>読み込み中...</div>}>
        <GuestHeaderContent />
        </Suspense>
    );
}

function GuestHeaderContent() {
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
                    className="max-w-lg px-3 py-2 ml-10 rounded-l-md bg-white text-black outline-none"
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
                    <div>ログイン・アカウント登録</div>
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
        </>
    );
}

