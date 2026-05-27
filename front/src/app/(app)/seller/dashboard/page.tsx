'use client';

import Link from 'next/link';
import { useSeller } from '@/lib/context/SellerContext';

export default function SellerDashboardPage() {

    const { seller } = useSeller();

    return (

        <div className="max-w-5xl mx-auto p-6">

            <div className="mb-6">

                <p className="text-sm text-gray-500">
                    Mamazon Seller Console
                </p>

                <h1>
                Mamazon {seller?.seller_name} ダッシュボード
            </h1>

            </div>

            <div className="bg-white border rounded-lg p-6">

                <h2 className="text-lg font-bold mb-4">
                    商品管理
                </h2>

                <Link
                    href="/product-submission"
                    className="
                        inline-block
                        bg-black
                        text-white
                        px-4
                        py-2
                        rounded
                    "
                >
                    商品を登録する
                </Link>

            </div>

        </div>
    );
}