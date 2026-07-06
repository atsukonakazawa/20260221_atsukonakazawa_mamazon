'use client';

import { useSearchParams, useRouter } from 'next/navigation';
import { useState, Suspense } from 'react';
import { apiFetch } from '@/lib/api/apiClient';
import { useToast } from '@/lib/context/ToastContext';


function NewPasswordPageContent() {
    const params = useSearchParams();
    const tel = params.get('tel')!;
    const router = useRouter();
    const { showToast } = useToast();


    const [password, setPassword] = useState('');
    const [passwordConfirm, setPasswordConfirm] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        //古いエラーメッセージを削除
        setError('');

        // バリデーション
        if (!password || !passwordConfirm) {
            setError('パスワードを入力してください');
            return;
        }

        if (password !== passwordConfirm) {
            setError('パスワードが一致しません');
            return;
        }

        if (password.length < 6) {
            setError('パスワードは6文字以上で入力してください');
            return;
        }

        try {
            await apiFetch('/api/password/reset', {
                method: 'POST',
                headers: {
                'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                tel,
                password,
                }),
            });

            // 成功メッセージ
            showToast('パスワードを変更しました', 'success');
            // 少し待って画面遷移
            setTimeout(() => {
                router.push('/auth');
            }, 200);

        } catch {
            // エラーメッセージ
            showToast('パスワード変更に失敗しました', 'error');
        }
    };

    return (
        <main className="flex justify-center items-center mt-[50px]">
        <form
            onSubmit={handleSubmit}
            className="bg-white p-6 rounded-lg border border-[#CCCCCC] w-full max-w-[400px]"
        >
            <h2 className="pb-2 text-[1.3rem]">新しいパスワードを設定</h2>

            {error && (
            <p className="text-red-600 text-sm mb-3">
                {error}
            </p>
            )}

            <input
            type="password"
            placeholder="新しいパスワード"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full p-2 mb-3 rounded border border-[#888C8C]"
            />

            <input
            type="password"
            placeholder="パスワード（確認）"
            value={passwordConfirm}
            onChange={(e) => setPasswordConfirm(e.target.value)}
            className="w-full p-2 mb-3 rounded border border-[#888C8C]"
            />

            <button
            type="submit"
            className="w-full py-1.5 bg-[#FFD712] text-[#111111] font-medium rounded-full"
            >
            更新する
            </button>
        </form>
        </main>
    );
}

export default function NewPasswordPage() {
    return (
        <Suspense fallback={<div>読み込み中...</div>}>
            <NewPasswordPageContent />
        </Suspense>
    );
}