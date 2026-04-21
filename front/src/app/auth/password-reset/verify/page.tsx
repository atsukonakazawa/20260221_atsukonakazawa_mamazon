'use client';

import { useSearchParams, useRouter } from 'next/navigation';
import { verifySmsCode } from '@/lib/api/authApi';
import SmsVerifyForm from '@/app/components/login/SmsVerifyForm';

export default function VerifyPage() {
    const params = useSearchParams();
    const tel = params.get('tel')!;
    const router = useRouter();

    const handleVerify = async (code: string) => {
        const res = await verifySmsCode({ tel, code });

        if (!res.success) {
        alert('認証コードが正しくありません');
        return;
        }

        // 成功 → 新パスワード画面へ
        router.push(`/auth/password-reset/new-password?tel=${tel}`);
    };

    return (
        <div className="flex justify-center items-center mt-[50px]">
            <SmsVerifyForm
            tel={tel}
            onVerify={handleVerify}
            />
        </div>
    );
}