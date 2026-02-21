'use client';
import React from 'react';

type Props = {
  emailOrPhone: string;
  onSubmit: (password: string) => void;
};

export default function PasswordForm({ emailOrPhone, onSubmit }: Props) {
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const password = (e.currentTarget.elements.namedItem('password') as HTMLInputElement).value;
    onSubmit(password);
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg border border-[#CCCCCC] w-full max-w-[350px]">
      <h2 className="pb-1 text-[1.3rem]">パスワードを入力</h2>
      <div className="mb-3 text-sm text-gray-700">
        {emailOrPhone} に登録されたアカウントです
      </div>
      <input
        type="password"
        name="password"
        placeholder="パスワード"
        className="w-full p-2 mb-3 rounded border border-[#888C8C] focus:outline-none focus:bg-[#F6FEFF] focus:shadow-[0_0_5px_5px_#C8F3FA] transition-all"
      />
      <button
        type="submit"
        className="w-full py-1.5 bg-[#FFD712] text-[#111111] font-medium rounded-full cursor-pointer"
      >
        ログイン
      </button>
      <div className="mt-3 text-right">
        <a href="/login"
          className="text-sm text-[#2162A1] hover:underline">前の画面へ戻る</a>
      </div>
    </form>
  );
}
