'use client';

import { useRouter } from 'next/navigation';

export default function AdminPage() {
    const router = useRouter();

    return (
        <div className="min-h-screen bg-gray-100 p-5">
            <h1 className="text-2xl font-semibold mb-6">
                Mamazon 管理者ダッシュボード
            </h1>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-5 max-w-4xl">

                {/* ユーザー管理 */}
                <button
                    onClick={() => router.push('/admin/users')}
                    className="bg-white border border-gray-300 rounded-lg p-6 text-left hover:bg-gray-50 transition cursor-pointer shadow-sm"
                >
                    <h2 className="text-lg font-semibold mb-2">
                        ユーザー管理
                    </h2>

                    <p className="text-sm text-gray-600">
                        ユーザー一覧の確認・検索・停止処理
                    </p>
                </button>

                {/* 販売者管理 */}
                <button
                    onClick={() => router.push('/admin/sellers')}
                    className="bg-white border border-gray-300 rounded-lg p-6 text-left hover:bg-gray-50 transition cursor-pointer shadow-sm"
                >
                    <h2 className="text-lg font-semibold mb-2">
                        販売者管理
                    </h2>

                    <p className="text-sm text-gray-600">
                        販売者一覧の確認・検索・停止処理
                    </p>
                </button>

                {/* 商品管理 */}
                <button
                    onClick={() => router.push('/admin/products')}
                    className="bg-white border border-gray-300 rounded-lg p-6 text-left hover:bg-gray-50 transition cursor-pointer shadow-sm"
                >
                    <h2 className="text-lg font-semibold mb-2">
                        商品管理
                    </h2>

                    <p className="text-sm text-gray-600">
                        商品一覧の確認・検索・停止処理
                    </p>
                </button>

            </div>
        </div>
    );
}