'use client';

import Header from '../../../components/Header';
import FooterLogin from "../../../components/FooterLogin";
import Link from 'next/link';

export default function OrderCompletePage() {
    return (
        <>
            <Header />

            <div className="p-10 text-center">
                <h1 className="text-2xl font-bold mb-4">
                    注文が確定しました 🎉
                </h1>

                <p className="mb-6">
                    ご購入ありがとうございます。
                </p>

                <Link
                    href="/mypage"
                    className="bg-yellow-400 px-6 py-3 rounded font-bold"
                >
                    商品一覧へ戻る
                </Link>
            </div>

            <FooterLogin />
        </>
    );
}