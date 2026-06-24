'use client';

import { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import Header from '../../../components/Header';
import FooterLogin from '../../../components/FooterLogin';

function ReviewCompleteContent() {
    const params = useSearchParams();

    const productName = params.get('product_name');
    const productImage = params.get('product_image');
    const score = Number(params.get('score'));
    const comment = params.get('comment');

    return (
        <>
            <Header />
            <div className="max-w-2xl mx-auto p-6 text-center">
                <h1 className="text-2xl font-bold mb-4">
                    レビューの投稿が完了しました 🎉
                </h1>

                <p className="mb-6">
                    ありがとうございます。
                </p>

                <div className="border rounded-lg p-6 bg-white shadow">
                    <img
                        src={productImage || "/no-image.png"}
                        alt={productName || "No image"}
                        className="w-40 mx-auto mb-4"
                    />

                    <h2 className="text-lg font-semibold mb-2">
                        {productName}
                    </h2>

                    <div className="text-yellow-400 text-2xl mb-2">
                        {'★'.repeat(score)}
                        {'☆'.repeat(5 - score)}
                    </div>

                    <p className="text-gray-700">
                        {comment}
                    </p>
                </div>

                <Link
                    href="/mypage"
                    className="inline-block mt-6 bg-yellow-400 px-6 py-2 rounded hover:bg-yellow-500"
                >
                    ホーム画面
                </Link>
            </div>

            <FooterLogin />
        </>
    );
}

export default function ReviewCompletePage() {
    return (
        <Suspense fallback={<div>読み込み中...</div>}>
            <ReviewCompleteContent />
        </Suspense>
    );
}