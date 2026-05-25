'use client';

import { useSearchParams, useRouter } from 'next/navigation';
import { verifySmsCode } from '@/lib/api/authApi';
import SmsVerifyForm from '@/app/components/login/SmsVerifyForm';
import { useState } from 'react';

export default function VerifyPage() {
    const params = useSearchParams();
    const tel = params.get('tel')!;
    const router = useRouter();

    const [errorMessage, setErrorMessage] = useState('');

    const handleVerify = async (code: string) => {

        // 前回エラーを消す
        setErrorMessage('');

        try {
            await verifySmsCode({ tel, code });

            // 成功したら新パスワード設定へ
            router.push(`/auth/password-reset/new-password?tel=${tel}`);

        } catch (err: any) {
            setErrorMessage(
                err.message || '認証に失敗しました'
            );
        }
    };

    return (
        <div className="flex justify-center items-center mt-[50px]">
            <SmsVerifyForm
            tel={tel}
            onVerify={handleVerify}
            errorMessage={errorMessage}
            />
        </div>
    );
}