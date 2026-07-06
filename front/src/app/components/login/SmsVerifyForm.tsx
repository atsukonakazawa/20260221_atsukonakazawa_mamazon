'use client';
import { useState } from 'react';

type Props = {
    tel: string;
    onVerify: (code: string) => void;
    errorMessage?: string;
};

export default function SmsVerifyForm({ tel, onVerify, errorMessage }: Props) {
    const [code, setCode] = useState('');
    const [localError, setLocalError] = useState('');

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (!code.trim()) {
            setLocalError('認証コードを入力してください');
            return;
        }

        // 入力されたのでローカルエラーを消す
        setLocalError('');

        onVerify(code);
    };


    return (
    <form
        onSubmit={handleSubmit}
        className="bg-white p-6 rounded-lg border border-[#CCCCCC] w-full max-w-[350px]"
    >
        <h2 className="pb-2 text-[1.3rem]">SMS認証</h2>

        <p className="mb-3 text-sm text-gray-700">
        {tel} に送信された認証コードを入力してください
        </p>

        <input
        type="text"
        placeholder="6桁の認証コード"
        value={code}
        onChange={(e) => {
            setCode(e.target.value);
            setLocalError('');
        }}
        className="
            w-full
            p-2
            mb-3
            rounded
            border border-[#888C8C]
            focus:outline-none
        "
        />

        {(localError || errorMessage) && (
            <p className="text-red-600 text-sm mb-2">
                {localError || errorMessage}
            </p>
        )}

        <button
        type="submit"
        className="
            w-full
            py-1.5
            bg-[#FFD712]
            text-[#111111]
            font-medium
            rounded-full
        "
        >
            認証する
        </button>

        <p className="mt-10 text-xs text-gray-500">
            ・SMSが届かない場合は、入力内容をご確認ください。
        </p>
        <p className="mt-1 text-xs text-gray-500">
            ・認証コードの有効期限は5分間です。
        </p>

    </form>
    );
}
