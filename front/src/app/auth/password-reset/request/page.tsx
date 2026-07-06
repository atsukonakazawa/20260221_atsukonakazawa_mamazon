'use client';
import { useState } from 'react';
import { sendSmsCodeForReset } from '@/lib/api/authApi';
import { useRouter } from 'next/navigation';
import { useToast } from '@/lib/context/ToastContext';
import { isValidPhone, normalizePhone } from '@/lib/utils/validation';

export default function RequestPage() {
    const [tel, setTel] = useState('');
    const router = useRouter();
    const { showToast } = useToast();


    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        const input = tel.trim();

        if (!input) {
            showToast('電話番号を入力してください', 'error');
            return;
        }

        if (!isValidPhone(input)) {
            showToast('正しい電話番号（ハイフンなし）を入力してください', 'error');
            return;
        }

        const normalizedTel = normalizePhone(input);

        try {
            await sendSmsCodeForReset({ tel: normalizedTel });

            // 成功メッセージ
            showToast('認証コードを送信しました', 'success');
            // 少し待って画面遷移
            setTimeout(() => {
                router.push(`/auth/password-reset/verify?tel=${normalizedTel}`);
            }, 200);

        } catch {
            //エラーメッセージ
            showToast('認証コードの送信に失敗しました', 'error');
        }
    };

    return (
        <div className="flex justify-center items-center mt-[50px]">

            <form
                className="bg-white p-6 rounded-lg border border-[#CCCCCC] w-full max-w-[350px]"
                onSubmit={handleSubmit}
            >

            <h2 className="pb-1 text-[1.3rem]">ご登録の電話番号を入力</h2>

            <input
                className="w-full p-2 mb-3 rounded border border-[#888C8C] focus:outline-none focus:bg-[#F6FEFF] focus:shadow-[0_0_5px_5px_#C8F3FA] transition-all"
                value={tel}
                onChange={(e) => setTel(e.target.value)} />

            <button
                className="w-full py-1.5 bg-[#FFD712] text-[#111111] font-medium rounded-full cursor-pointer"
                type="submit">SMS認証コードを送信</button>

            </form>
        </div>
    );
}