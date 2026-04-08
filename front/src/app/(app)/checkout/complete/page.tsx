'use client';

import { useSearchParams } from 'next/navigation';
import Header from '../../../components/Header';
import FooterLogin from "../../../components/FooterLogin";
import Link from 'next/link';

export default function OrderCompletePage() {

    const searchParams = useSearchParams();

    const paymentNumber = searchParams.get('number');
    const paymentLimit = searchParams.get('limit');

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

                        <p>
                            支払い期限：{paymentLimit}
                        </p>
                    </div>
                )}

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