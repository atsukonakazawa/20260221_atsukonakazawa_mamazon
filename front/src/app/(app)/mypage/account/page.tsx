'use client';

import Header from '../../../components/Header';
import FooterLogin from '../../../components/FooterLogin';
import { useUser } from '@/lib/context/UserContext';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function AccountPage() {
    const { user, logout } = useUser();
    const router = useRouter();

    // 未ログインならログイン画面へ
    useEffect(() => {
        if (!user) {
        router.push('/auth');
        }
    }, [user, router]);

    if (!user) return null;

    return (
        <>
        <Header />

        <div className="max-w-md mx-auto p-4 space-y-4">

            <h2 className="text-lg font-bold">アカウントサービス</h2>

            {/* アカウント情報確認・変更 */}
            <button
            onClick={() => router.push('/mypage/account/edit')}
            className="w-full bg-white border rounded rounded-full px-5 py-3 text-left shadow-sm hover:bg-gray-50 cursor-pointer"
            >
            アカウント情報の確認・変更
            </button>

            {/* ログアウト */}
            <button
            onClick={logout}
            className="w-full bg-[#131921] text-white rounded rounded-full p-3 shadow hover:bg-gray-500 cursor-pointer"
            >
            ログアウト
            </button>

        </div>

        <FooterLogin />
        </>
    );
}