'use client';

import React from 'react';

type Props = {
  emailOrPhone: string;//表示用の値
  onSubmit: (password: string) => void;//親から渡された関数
  errorMessage?: string;
};

export default function PasswordForm({
  emailOrPhone,
  onSubmit,
  errorMessage
}: Props) {

  //(e: React.SyntheticEvent<HTMLFormElement>)・・・form上の何らかのイベント
  const handleSubmit = (e: React.SyntheticEvent<HTMLFormElement>) => {

    //無駄なリロードを止める
    e.preventDefault();


    //端的には、inputからパスワードを取り出しているだけ
    //e.currentTarget・・・今回はformがイベントの対象
    //elements・・・具体的なイベント対象の指定。今回はformの中のinput
    //namedItem('password')・・・name="password" のinputを取得
    //as HTMLInputElement・・・TypeScriptに「これはinputだよ」と教えている
    //.value・・・入力されたパスワード
    const password = (e.currentTarget.elements.namedItem('password') as HTMLInputElement).value;

    //親の関数を呼び出す
    onSubmit(password);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white p-6 rounded-lg border border-[#CCCCCC] w-full max-w-[350px]"
    >

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

      {errorMessage && (
        <p className="text-red-600 text-sm mb-2 ">
          {errorMessage}
        </p>
      )}

      <button
        type="submit"
        className="w-full py-1.5 bg-[#FFD712] text-[#111111] font-medium rounded-full cursor-pointer"
      >
        ログイン
      </button>
      <div className="mt-3 text-right">
        <a href="/auth"
          className="text-sm text-[#2162A1] hover:underline">最初の画面へ戻る</a>
      </div>
      <div className="mt-3 text-right">
        <a
          href="/auth/password-reset/request"
          className="text-sm text-[#2162A1] hover:underline"
        >
          パスワードを忘れてしまった場合
          </a>
      </div>
    </form>
  );
}
