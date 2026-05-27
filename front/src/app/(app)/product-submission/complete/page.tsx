'use client';

import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { useEffect } from 'react';
import { useSeller } from '@/lib/context/SellerContext';

export default function ProductSubmissionCompletePage() {

    const searchParams = useSearchParams();

    const productName =
        searchParams.get('product_name');

    const productPrice =
        searchParams.get('product_price');

    const sellerName =
        searchParams.get('seller_name');

    const { setSeller } = useSeller();

    useEffect(() => {

        if (sellerName) {

            setSeller({
                id: 1,
                seller_name: sellerName,
            });
        }

    }, [sellerName, setSeller]);

    return (

        <div className="max-w-2xl mx-auto p-6">

            <div className="bg-white border rounded-lg p-8">

                <h1 className="text-2xl font-bold mb-4">
                    仮登録完了
                </h1>

                <p className="text-gray-600 mb-6">
                    承認後に公開されます
                </p>

                <div className="border rounded p-4 mb-6">

                    <h2 className="font-bold mb-3">
                        登録内容
                    </h2>

                    <p>
                        商品名：{productName}
                    </p>

                    <p>
                        価格：¥{productPrice}
                    </p>

                    <p>
                        販売会社：{sellerName}
                    </p>

                </div>

                <div className="flex gap-3">

                    <Link
                        href="/product-submission"
                        className="
                            bg-black
                            text-white
                            px-4
                            py-2
                            rounded
                        "
                    >
                        続けて商品の登録をする
                    </Link>

                    <Link
                        href="/seller/dashboard"
                        className="
                            bg-gray-200
                            px-4
                            py-2
                            rounded
                        "
                    >
                        販売会社ダッシュボードに戻る
                    </Link>

                </div>

            </div>

        </div>
    );
}