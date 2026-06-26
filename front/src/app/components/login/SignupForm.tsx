'use client';
import React, { useState } from 'react';
import { checkEmail } from '../../../lib/api/authApi';
import {
  normalizePhone,
  normalizePostcode,
  validateUserForm
} from '@/lib/utils/validation';
import { fetchAddress } from "../../../lib/api/postcodeApi";

/**
 * 親（LoginPage）や API に渡す正式データ型
 */
export type SignupData = {
  first_name: string; // 必須
  last_name: string;  // 必須
  email?: string;
  tel?: string;
  password: string;   // 必須
  postcode?: string;
  address?: string;
  date_of_birth?: string; // input[type=date] は string
  placement?: boolean;
  place_of_placement?: string;
};

/**
* SignupForm 内部だけで使うフォーム状態
* 確認用パスワードは API に渡さない
*/
type SignupFormState = SignupData & {
  password_confirm: string;
};

/**
 * 親コンポーネント（LoginPage）から受け取るprops
 */
type Props = {
  // すでに入力済みのメールアドレス or 電話番号（表示専用）
  emailOrPhone: string;
  //メールアドレス形式になっているかどうか
  isEmail: boolean;
  // 登録処理を親に委ねるための関数
  onSubmit: (data: SignupData) => void;
};


export default function SignupForm({ emailOrPhone, isEmail, onSubmit }: Props) {

  //メールアドレスの入力状態管理
  const [emailError, setEmailError] = useState<string>('');
  const [timer, setTimer] = useState<NodeJS.Timeout | null>(null);

  // useState はコンポーネント内で使う
  const [form, setForm] = useState<SignupFormState>({
    first_name: '',
    last_name: '',
    email: isEmail ? emailOrPhone : '',
    tel: !isEmail ? emailOrPhone : '',
    password: '',
    password_confirm: '',
    postcode: '',
    address: '',
    date_of_birth: '',
    placement: false,
    place_of_placement: '',
  });

  const [formError, setFormError] = useState<string>("");

  /**
   * フォーム送信時の処理
   */
  //以下、「次に進む」ボタン押下時（<form>が送信された時）の処理
  //e はイベントオブジェクトの略で、ボタンを押したりフォームを送信したときに自動的に渡される。今回はフォームが送信された時の情報が入っている。
  //e:の後ろは型注釈。
  //React.FormEventはReactの「フォームで発生するイベント」。
  //<HTMLFormElement>は対象が HTML の <form> 要素である」。
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const error = validateUserForm({
      first_name: form.first_name,
      last_name: form.last_name,
      email: form.email ?? '',
      tel: form.tel ?? '',
      password: form.password,
      password_confirm: form.password_confirm,
      postcode: form.postcode ?? '',
      address: form.address ?? '',
      date_of_birth: form.date_of_birth ?? '',
    });

    if (error) {
      setFormError(error);
      return;
    }

    if (emailError) {
      setFormError('メールアドレスを確認してください');
      return;
    }

    // 正規化（重要）
    const normalizedTel = normalizePhone(form.tel!);
    const normalizedPostcode = normalizePostcode(form.postcode!);
    // password_confirm を除外して親へ渡す
    const { password_confirm, ...signupData } = form;
    onSubmit({
      ...signupData,
      tel: normalizedTel,
      postcode: normalizedPostcode,
    });
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white p-6 rounded-lg border border-[#CCCCCC] w-full max-w-[350px] mt-[20px]"
    >
      {/* タイトル */}
      <h2 className="pb-1 text-[1.3rem]">
        アカウント作成
      </h2>

      {/* 登録対象のメール or 電話番号を表示 */}
      <div className="mb-3 text-sm text-gray-700">
        {emailOrPhone} で新規アカウントを作成します
      </div>

      {/*  姓  */}
      {/* name 属性は FormData.get() のキーになる */}
      <label className="block mb-1 font-bold text-[0.9rem]">
        <span className="mr-3 px-2 py-1 bg-red-500 text-xs text-white round rounded-sm">必須</span>
        姓
      </label>
      <input
        type="text"
        name="last_name"
        placeholder="(例)鈴木"
        required
        value={form.last_name}
        onChange={(e) =>
          setForm({ ...form, last_name: e.target.value })
        }
        className="
          w-full
          p-2
          mb-2
          rounded
          border border-[#888C8C]
        "
      />

      {/*  名  */}
      <label className="block mb-1 font-bold text-[0.9rem]">
        <span className="mr-3 px-2 py-1 bg-red-500 text-xs text-white round rounded-sm">必須</span>
        名
      </label>
      <input
        type="text"
        name="first_name"
        placeholder="(例)太郎"
        required
        value={form.first_name}
        onChange={(e) =>
          setForm({ ...form, first_name: e.target.value })
        }
        className="
          w-full
          p-2
          mb-3
          rounded
          border border-[#888C8C]
        "
      />

      <label className="block mb-1 font-bold text-[0.9rem]">
        <span className="mr-3 px-2 py-1 bg-red-500 text-xs text-white round rounded-sm">必須</span>
        電話番号
      </label>
      <input
        type="text"
        value={form.tel}
        required
        onChange={async (e) => {
          const postcode = e.target.value.replace("-", "");

          setForm({
              ...form,
              postcode,
          });

          if (postcode.length === 7) {
              const address = await fetchAddress(postcode);

              if (address) {
                  setForm((prev) => ({
                      ...prev,
                      postcode,
                      address,
                  }));
              }
          }
      }}
        className="
          w-full
          p-2
          mb-3
          rounded
          border border-[#888C8C]
          focus:outline-none
          focus:bg-[#F6FEFF]
          focus:shadow-[0_0_5px_5px_#C8F3FA]
          transition-all
        "
      />

      <label className="block mb-1 font-bold text-[0.9rem]">
        <span className="mr-3 px-2 py-1 bg-red-500 text-xs text-white round rounded-sm">必須</span>
        メールアドレス
      </label>
      <input
        type="email"
        value={form.email}
        required
        className="
          w-full
          p-2
          mb-3
          rounded
          border border-[#888C8C]
          focus:outline-none
          focus:bg-[#F6FEFF]
          focus:shadow-[0_0_5px_5px_#C8F3FA]
          transition-all"
        onChange={(e) => {
          const value = e.target.value;

          // 入力値更新
          setForm({ ...form, email: value });

          // 前のタイマーを止める
          if (timer) clearTimeout(timer);

          // 0.5秒後にAPI実行
          const newTimer = setTimeout(async () => {
            if (!value) {
              setEmailError('');
              return;
            }

            try {
              const res = await checkEmail(value);

              if (res.exists) {
                setEmailError('このメールアドレスはすでに使われています');
              } else {
                setEmailError('');
              }
            } catch {
              setEmailError('');
            }
          }, 500);

          setTimer(newTimer);
        }}
      />
      {emailError && (
        <p className="text-red-500 text-sm mb-2">
          {emailError}
        </p>
      )}

      {/* パスワード入力欄 */}
      <label className="block mb-1 font-bold text-[0.9rem]">
        <span className="mr-3 px-2 py-1 bg-red-500 text-xs text-white round rounded-sm">必須</span>
        パスワード
      </label>
      <input
        type="password"
        name="password"
        placeholder="8文字以上"
        required                 // HTMLレベルの最低限バリデーション
        value={form.password}
        onChange={(e) =>
          setForm({ ...form, password: e.target.value })
        }
        className="
          w-full
          p-2
          mb-3
          rounded
          border border-[#888C8C]
          focus:outline-none
          focus:bg-[#F6FEFF]
          focus:shadow-[0_0_5px_5px_#C8F3FA]
          transition-all
        "
      />

      <label className="block mb-1 font-bold text-[0.9rem]">
        <span className="mr-3 px-2 py-1 bg-red-500 text-xs text-white round rounded-sm">必須</span>
        パスワード（確認）
      </label>
        <input
        type="password"
        value={form.password_confirm}
        onChange={(e) => setForm({ ...form, password_confirm: e.target.value })}
        required
        className="
          w-full
          p-2
          mb-3
          rounded
          border border-[#888C8C]
          focus:outline-none
          focus:bg-[#F6FEFF]
          focus:shadow-[0_0_5px_5px_#C8F3FA]
          transition-all
        "
      />

      <label className="block mb-1 font-bold text-[0.9rem]">
        <span className="mr-3 px-2 py-1 bg-red-500 text-xs text-white round rounded-sm">必須</span>
        郵便番号
      </label>
      <input
        name="postcode"
        placeholder="(例)1231234"
        required
        value={form.postcode}
        onChange={(e) =>
          setForm({ ...form, postcode: e.target.value })
        }
        className="
          w-full
          p-2
          mb-3
          rounded
          border border-[#888C8C]
          focus:outline-none
          focus:bg-[#F6FEFF]
          focus:shadow-[0_0_5px_5px_#C8F3FA]
          transition-all
        "
      />

      <label className="block mb-1 font-bold text-[0.9rem]">
        <span className="mr-3 px-2 py-1 bg-red-500 text-xs text-white round rounded-sm">必須</span>
        住所（番地まで）
      </label>
      <input
        name="address"
        placeholder="住所(例)東京都中野区東中野1-1-1"
        required
        value={form.address}
        onChange={(e) =>
          setForm({ ...form, address: e.target.value })
        }
        className="
          w-full
          p-2
          mb-3
          rounded
          border border-[#888C8C]
          focus:outline-none
          focus:bg-[#F6FEFF]
          focus:shadow-[0_0_5px_5px_#C8F3FA]
          transition-all
        "
      />

      <label className="block mb-1 font-bold text-[0.9rem]">
        <span className="mr-3 px-2 py-1 bg-red-500 text-xs text-white round rounded-sm">必須</span>
        生年月日
      </label>
      <input
        type="date"//カレンダーアイコンから日付選択
        name="date_of_birth"
        placeholder="例)19880401"
        required
        value={form.date_of_birth}
        onChange={(e) =>
          setForm({ ...form, date_of_birth: e.target.value })
        }
        className="
          w-full
          p-2
          mb-3
          rounded
          border border-[#888C8C]
          focus:outline-none
          focus:bg-[#F6FEFF]
          focus:shadow-[0_0_5px_5px_#C8F3FA]
          transition-all
        "
      />

      <label className="flex items-center gap-2 text-sm">
        <input
          type="checkbox"
          name="placement"
          checked={form.placement}
          onChange={(e) =>
            setForm({ ...form, placement: e.target.checked })
          }
        />
        置き配可の場合はチェックを入れてください。
      </label>

      <label className="block mb-1 font-bold text-[0.9rem]">
        置き配場所
      </label>
      <input
        name="place_of_placement"
        placeholder="玄関ドア横"
        value={form.place_of_placement}
        onChange={(e) =>
          setForm({ ...form, place_of_placement: e.target.value })
        }
        className="
          w-full
          p-2
          mb-3
          rounded
          border border-[#888C8C]
          focus:outline-none
          focus:bg-[#F6FEFF]
          focus:shadow-[0_0_5px_5px_#C8F3FA]
          transition-all
        "
      />

      {formError && (
        <p className="text-red-600 text-sm mb-2">
          {formError}
        </p>
      )}

      {/* 送信ボタン */}
      <button
        type="submit"
        className="
          w-full
          py-1.5
          bg-[#FFD712]
          text-[#111111]
          font-medium
          rounded-full
          cursor-pointer
        "
      >
        SMSで認証コードを送信
      </button>
      <div className="mt-3 text-right">
        <a href="/auth"
          className="text-sm text-[#2162A1] hover:underline">最初の画面へ戻る</a>
      </div>
    </form>
  );
}
