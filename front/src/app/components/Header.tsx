'use client';

import { Roboto_Condensed } from 'next/font/google';
import { useUser } from '@/lib/UserContext';
import Link from 'next/link';
import { ShoppingCart } from "lucide-react";

// Montserrat フォントの設定
// subsets: 文字セット（日本語は含まれないが英字のみなので問題なし）
// weight: 使いたい太さを配列で指定（400=通常、700=太字、800=さらに太字）
const robotoCondensed = Roboto_Condensed({
    subsets: ['latin'],
    weight: ['400', '700'],
});

export default function Header() {
  const { user } = useUser();

  return (
    <>
      <header
        className={`${robotoCondensed.className}  pt-0 py-4 px-0`}
      >
        {/* PC用ヘッダー */}
        <div className="hidden sm:flex bg-[#131921] py-3 px-5">
          <div className="flex w-full pt-2 items-center">

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
                お届け先 {user ? user.last_name : 'ゲスト'}
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
                className="w-full px-3 py-2 rounded-l-md bg-white text-black outline-none"
              />
              <button className="bg-yellow-400 px-4 rounded-r-md">
                🔍
              </button>
            </div>

              {/* アカウント＆リスト */}
            <div className="ml-5 text-white text-xs sm:text-sm cursor-pointer whitespace-nowrap">
              <div>こんにちは,</div>
              <div className="font-bold">アカウント＆リスト</div>
            </div>

              {/* 注文履歴 */}
            <div className="ml-5 text-white text-xs sm:text-sm cursor-pointer whitespace-nowrap">
              <div>返品もこちら</div>
              <div className="font-bold">注文履歴</div>
            </div>

              {/* カート */}
            <div className="ml-5 relative text-white cursor-pointer whitespace-nowrap">
              <ShoppingCart size={28} strokeWidth={2} />
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
              className="w-full px-3 py-2 border rounded-l-md outline-none"
            />
            <button className="bg-yellow-400 px-4 rounded-r-md">
              🔍
            </button>
          </div>

          {/* 下段：横スクロール可能エリア */}
          <div className="flex gap-3 overflow-x-auto whitespace-nowrap no-scrollbar">

            {/* 郵便番号ボタン */}
            <button className="px-3 py-1 border rounded-full text-sm">
              📍 123-4567
            </button>

            <button className="px-3 py-1 border rounded-full text-sm">
              ネットスーパー
            </button>

            <button className="px-3 py-1 border rounded-full text-sm">
              プライム
            </button>

            <button className="px-3 py-1 border rounded-full text-sm">
              Prime Video
            </button>

            <button className="px-3 py-1 border rounded-full text-sm">
              ああああああああああああaaaaaaaaaaaaaaaa
            </button>

          </div>
        </div>
      </header>
    </>
  );
}
