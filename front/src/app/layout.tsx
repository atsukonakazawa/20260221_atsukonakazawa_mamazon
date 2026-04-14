import './globals.css';
// Google Fonts から Montserrat フォントを読み込む
import { Roboto_Condensed } from 'next/font/google';
import type { Metadata } from 'next';
import { UserProvider } from '@/lib/context/UserContext';
import { CartProvider } from '@/lib/context/CartContext';

// Roboto_Condensed フォントの設定
const robotoCondensed = Roboto_Condensed({
  subsets: ['latin'],
  weight: ['400', '700', '800'], // 普通と太字を読み込み
});

// サイト全体のメタデータ（タイトルなど）
export const metadata: Metadata = {
  title: 'mamazon',
};

// 全ページ共通の特別なレイアウト
// 各ページがレンダリングされるとその内容が{children}に差し込まれる
// children: React.ReactNode;は、「props（引数）に children があり、その型は React.ReactNode です」という宣言
// 全ページにRoboto_Condensedを適用できる
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ja">
      <body className={robotoCondensed.className}>
        <UserProvider>
          <CartProvider>
            {children}
          </CartProvider>
        </UserProvider>
      </body>
    </html>
  );
}
