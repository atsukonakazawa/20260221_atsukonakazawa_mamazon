'use client';
// Google Fonts から Montserrat フォントを読み込む
import { Roboto_Condensed } from 'next/font/google';
import { useUser } from '@/lib/UserContext';

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
        className={`${robotoCondensed.className} bg-[#131921] pt-0 py-4 px-8`}
      > {/* Roboto_Condensed フォントを適用 */}
        <div className="flex pt-2 items-center">

          {/* 左：ロゴ */}
          <h1 className="mr-3 text-white font-extrabold text-3xl flex items-end leading-none">
            mamazon
              <span
                className="text-base font-normal ml-1"
              >
                .co.jp
            </span>
          </h1>

          {/* 右：お届け先情報 */}
          <div className="text-white text-sm leading-tight">
            <div>
              お届け先 {user ? user.last_name : 'ゲスト'}さん
            </div>
            <div className="items-center gap-1 text-xs">
              📍{user ? user.postcode : '---'}
            </div>
          </div>

        </div>
      </header>
    </>
  );
}
