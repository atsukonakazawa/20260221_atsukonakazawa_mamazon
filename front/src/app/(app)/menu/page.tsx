'use client';

import Link from 'next/link';
import Header from '../../components/Header';
import FooterLogin from "../../components/FooterLogin";

export default function MenuPage() {
    return (
        <>
            <Header />

            <div className="p-6 max-w-md mx-auto">
                <h1 className="text-2xl font-bold mb-6">メニュー</h1>

                {/* 注文履歴ボタン */}
                <Link
                    href="/mypage/orders"
                    className="block w-full text-center font-bold py-3 rounded-full mb-4 transition cursor-pointer border border-black-200"
                >
                    注文履歴
                </Link>

            </div>

            <FooterLogin />
        </>
    );
}