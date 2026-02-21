// Google Fonts から Montserrat フォントを読み込む
import { Roboto_Condensed } from 'next/font/google';


// Montserrat フォントの設定
// subsets: 文字セット（日本語は含まれないが英字のみなので問題なし）
// weight: 使いたい太さを配列で指定（400=通常、700=太字、800=さらに太字）
const robotoCondensed = Roboto_Condensed({
    subsets: ['latin'],
    weight: ['400', '700'],
});

export default function HeaderLogin() {
    return (
        <header
            // 背景白、上下 padding 0.5rem、左右 padding 2rem、中央揃え　　
            className={`bg-white py-2 px-8 text-center ${robotoCondensed.className}`}
        >
            <h1 className="m-0 text-black font-bold text-[2rem] leading-[1.1]">
                mamazon
                <span className="text-[1rem] font-normal ml-1">
                    .co.jp
                </span>
            </h1>
        </header>
    );
}
