'use client';
import { useState } from 'react';
import HeaderLogin from '../components/HeaderLogin';
import FooterLogin from "../components/FooterLogin";
import SmsVerifyForm from '../components/login/SmsVerifyForm';
import PasswordForm from '../components/login/PasswordForm';
import SignupForm from '../components/login/SignupForm';
import { checkUser, sendSmsCode, verifySmsCode, registerUser, loginUser  } from '../../lib/api/authApi';
import type { SignupData } from '../components/login/SignupForm';
import { useRouter } from 'next/navigation';
import { useUser } from '@/lib/context/UserContext';



export default function LoginPage() {
  //フォーム入力の状態管理
  const [userInput, setUserInput] = useState<string>("");

  //一時データ保存（２段階処理をするために重要）
  const [pendingSignup, setPendingSignup] =
    useState<SignupData | null>(null);

  //フローに応じて画面切り替え
  const [step, setStep] = useState<
    'inputUser' | 'password' | 'signup' | 'smsVerify'
    >('inputUser');

  const { setUser } = useUser();
  const router = useRouter();
  const [errorMessage, setErrorMessage] = useState<string>("");

  const handleNext = async (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();

    //未入力の場合
    if (!userInput.trim()) {
      setErrorMessage("電話番号またはメールアドレスを入力してください");
      return;
    }
    try {
      //user存在確認し、その後のフローを決定
      const { exists } = await checkUser(userInput);
      setErrorMessage("");
      if (exists) setStep("password");
      else setStep("signup");
    } catch {
      setErrorMessage("ユーザー確認に失敗しました。もう一度試してください。");
    }
  };

  const handleLogin = async (password: string) => {
    try {
      const res = await loginUser({
        email: userInput,
        password,
      });

      setUser({
        id: res.user.id,
        last_name: res.user.last_name,
        first_name: res.user.first_name,
        postcode: res.user.postcode,
        address: res.user.address,
        tel: res.user.tel,
        placement: res.user.placement,
        place_of_placement: res.user.place_of_placement,
        email: res.user.email,
      });

      router.push('/mypage');

    } catch (err: any) {
      // 🔑 SMS未認証
      if (err.status === 403) {
        alert('SMS認証が必要です');
        setStep('smsVerify');
        return;
      }
      alert(err.message ?? 'ログイン失敗');
    }
  };

  const handleSignup = async (data: SignupData) => {
    if (!data.tel) {
      alert('電話番号がありません');
      return;
    }

    // ①仮登録データを保存（まだDBには入れない）
    setPendingSignup(data);

    // ②SMS送信APIを呼ぶ
    await sendSmsCode({ tel: data.tel });

    alert('認証コードを送信しました');

    // ③SMS認証画面へ
    setStep('smsVerify');

  };

  const handleVerify = async (code: string) => {
    if (!pendingSignup) return;

    try {
      //SMSコード検証
      const result = await verifySmsCode({
        tel: pendingSignup.tel!,
        code,
      });

      if (!result.success) {
        alert('認証コードが正しくありません');
        return;
      }

      // 必須項目チェック
      if (!pendingSignup.email || !pendingSignup.tel) {
        alert('メールアドレスまたは電話番号がを入力してください');
        return;
      }

      // 本登録
      await registerUser({
        email: pendingSignup.email, // string に確定
        tel: pendingSignup.tel,     // string に確定
        password: pendingSignup.password,
        first_name: pendingSignup.first_name,
        last_name: pendingSignup.last_name,
        postcode: pendingSignup.postcode,
        address: pendingSignup.address,
        date_of_birth: pendingSignup.date_of_birth,
        placement: pendingSignup.placement,
        place_of_placement: pendingSignup.place_of_placement,
      });

      //次へ
      alert('アカウント登録が完了しました');
      setStep('password');
    } catch(e) {
      alert('通信エラーが発生しました。もう一度お試しください');
    }
  };

  return (
    <>
      <HeaderLogin />

      <main className="flex justify-center items-center mt-[50px]">

        {step === 'smsVerify' && pendingSignup && (
          <SmsVerifyForm
            tel={pendingSignup.tel!}
            onVerify={handleVerify}
          />
        )}

        {/* メール/電話入力フォーム */}
        {/* stepに応じて表示するフォームを切り替え */}
        {step === "inputUser" && (
          <form onSubmit={handleNext}
            className="bg-white p-6 rounded-lg border border-[#CCCCCC] w-full max-w-[400px] mt-[50px]">
            <h2 className="pb-1 text-[1.3rem]">
              サインインまたはアカウントを作成
            </h2>

            {errorMessage && (
              <p className="text-red-600 text-sm mb-2 ">
                {errorMessage}
              </p>
            )}

            <label className="block mb-1 font-bold text-[0.9rem]">
              携帯電話番号またはメールアドレスを入力
            </label>

            {/* e.target.value で 現在入力されている文字列を取得 */}
            {/* 入力欄が変化したら、その値をuserInputステートにセットする */}
            <input
              type="text"
              value={userInput}
              onChange={(e) => setUserInput(e.target.value)}
              className="
                w-full               /* width: 100% */
                p-2                  /* padding: 0.5rem */
                mb-3                 /* margin-bottom: */
                rounded              /* border-radius: 0.25rem */
                border
                border-[#888C8C]     /* 枠線色 */
                bg-white
                focus:outline-none
                focus:bg-[#F6FEFF]   /* フォーカス時背景色 */
                focus:shadow-[0_0_5px_5px_#C8F3FA] /* フォーカス時の影 */
                transition-all
              "
            />
            <button
              type="submit"
              className="
                w-full                 /* width: 100% */
                py-1.5                 /* padding: 上下 0.3rem */
                bg-[#FFD712]           /* 背景色 */
                text-[#111111]         /* 文字色 */
                font-medium            /* font-weight: 500 */
                rounded-full           /* border-radius: 50px くらいの丸み */
                cursor-pointer         /* カーソルをポインターに */
              "
            >
              次に進む
            </button>

            <div className="
              mt-4             /* margin-top */
              text-[0.7rem]
              text-gray-600
            ">
              続行することで、
                <a href="#" className="text-[#2162A1] hover:underline">Mamazonの利用規約</a>
              および
                <a href="#" className="text-[#2162A1] hover:underline">プライバシー規約</a>
              に同意したものとみなされます。
            </div>

            <div className="
              mt-3            /* margin-top */
              text-[0.8rem]
              text-gray-600
              border-b
              border-[#D1D5DB]
              pb-4             /* padding-bottom */
            ">
              ヘルプが必要ですか？
            </div>

            <div className="
              mt-4
              text-sm           /* 文字を少し小さめに */
              text-gray-600
              font-bold
            ">
              業務用にご購入ですか？
            </div>

            <div className="
              mt-1
              text-sm
              text-gray-600
            ">
              <a href="#" className="text-[#2162A1] hover:underline">無料のビジネスアカウントを作る</a>
            </div>
          </form>
        )}

        {step === 'password' &&
          <PasswordForm
            emailOrPhone={userInput}
            onSubmit={handleLogin} />}
        {step === 'signup' &&
          <SignupForm
            emailOrPhone={userInput}
            onSubmit={handleSignup} />}
      </main>

      <FooterLogin />
    </>
  );
}
