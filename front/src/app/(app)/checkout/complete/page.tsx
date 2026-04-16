'use client';

import { useSearchParams } from 'next/navigation';
import Header from '../../../components/Header';
import FooterLogin from "../../../components/FooterLogin";
import Link from 'next/link';

export default function OrderCompletePage() {
    const searchParams = useSearchParams();

    const paymentNumber = searchParams.get('number');
    const paymentLimit = searchParams.get('limit');
    const confirmationNumber = searchParams.get('confirmation');
    // 支払い期限のフォーマット（秒数を表示しない）
    const formattedLimit = paymentLimit
        ? new Date(paymentLimit).toLocaleString('ja-JP', {
                dateStyle: 'short',
                timeStyle: 'short',
                hour12: false,
            })
        : null;

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

                {/* コンビニ払いの場合だけ表示 */}
                {paymentNumber && (
                    <div className="bg-yellow-100 p-6 rounded mb-6">
                        <p className="font-bold">コンビニでお支払いください</p>

                        <p className="mt-2">
                            お支払い番号：{paymentNumber}
                        </p>

                        {confirmationNumber && (
                            <p>
                                確認番号：{confirmationNumber}
                            </p>
                        )}

                        {formattedLimit && (
                            <p>
                                支払い期限：{formattedLimit}
                            </p>
                        )}
                    </div>
                )}

                <Link
                    href="/mypage"
                    className="bg-yellow-400 px-6 py-3 rounded font-bold"
                >
                    ホーム
                </Link>
            </div>

            <FooterLogin />
        </>
    );
}