'use client';

import { Roboto_Condensed } from 'next/font/google';
import { useUser } from '@/lib/context/UserContext';
import Link from 'next/link';
import { ShoppingCart } from "lucide-react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useCart } from '@/lib/context/CartContext';

// Montserrat フォントの設定
// subsets: 文字セット（日本語は含まれないが英字のみなので問題なし）
// weight: 使いたい太さを配列で指定（400=通常、700=太字、800=さらに太字）
const robotoCondensed = Roboto_Condensed({
    subsets: ['latin'],
    weight: ['400', '700'],
});

export default function Header() {
  const { user } = useUser();

  //検索状態
  const [keyword, setKeyword] = useState("");
  const router = useRouter();

  //検索実行関数
  const handleSearch = () => {
    if (!keyword) return;
    router.push(`/mypage?keyword=${encodeURIComponent(keyword)}`);
  };

  //よく使われるワードで検索(クイック検索)
  const handleQuickSearch = (word: string) => {
    router.push(`/mypage?keyword=${encodeURIComponent(word)}`);
  };
  const quickWords = [
    "ネットスーパー",
    "リラックス",
    "Prime Video",
    "おむつ",
    "ミルク",
    "クリーム",
    "ハーブティー",
    "おやつ",
    "おしりふき",
    "哺乳瓶",
    "おしゃぶり"
  ];

  //カート
  const { cartItems } = useCart();
  const totalQuantity = cartItems.reduce(
    (sum, item) => sum + item.quantity,
    0
  );

  return (
    <>
      <header
        className={`${robotoCondensed.className}  pt-0 p-4 px-0`}
      >
        {/* PC用ヘッダー */}
        <div className="hidden sm:flex flex-col">
          <div className="flex w-full p-3 items-center bg-[#8B82B6] ">

              {/* ロゴ */}
            <Link href="/mypage">
              <h1 className="text-white font-extrabold text-xl sm:text-2xl flex leading-none whitespace-nowrap">
                mamazon
                <span className="ml-1 text-xs sm:text-sm font-normal self-end">
                  .co.jp
                </span>
              </h1>
            </Link>

              {/* お届け先 */}
            <div className="ml-5 text-white text-xs sm:text-sm leading-tight whitespace-nowrap">
              <div>
                お届け先 {user ? user.last_name : ''}
                {user ? user.first_name : ''}さん
              </div>
              <div className="text-[10px] sm:text-xs">
                📍{user
                  ? user.postcode.replace(/(\d{3})(\d{4})/, '$1-$2')
                  : '---'}
              </div>
            </div>

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

              {/* アカウント＆リスト */}
            <Link href="/mypage/account">
              <div className="ml-5 text-white text-xs sm:text-sm cursor-pointer whitespace-nowrap">
                <div>
                  {user ? user.last_name : ''}
                  {user ? user.first_name : ''}さん
                </div>
                <div className="font-bold">アカウント＆リスト</div>
              </div>
            </Link>

              {/* 注文履歴 */}
            <Link href="/mypage/orders">
              <div className="ml-5 text-white text-xs sm:text-sm cursor-pointer whitespace-nowrap">
                <div>返品もこちら</div>
                <div className="font-bold">注文履歴</div>
              </div>
            </Link>

            {/* カート */}
            <Link href="/cart">
              <div className="ml-5 relative text-white cursor-pointer whitespace-nowrap">
                <ShoppingCart size={28} strokeWidth={2} />
                {totalQuantity > 0 && (
                  <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs w-5 h-5 flex items-center justify-center rounded-full">
                    {totalQuantity}
                  </span>
                )}
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
