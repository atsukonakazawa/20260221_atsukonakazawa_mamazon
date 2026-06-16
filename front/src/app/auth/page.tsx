'use client';
import { useState } from 'react';
import HeaderLogin from '../components/HeaderLogin';
import FooterLogin from "../components/FooterLogin";
import SmsVerifyForm from '../components/login/SmsVerifyForm';
import PasswordForm from '../components/login/PasswordForm';
import SignupForm from '../components/login/SignupForm';
import {
  checkUser,
  sendSmsCode,
  verifySmsCode,
  registerUser,
  loginUser
} from '../../lib/api/authApi';
import type { SignupData } from '../components/login/SignupForm';
import { useRouter } from 'next/navigation';
import { useUser } from '@/lib/context/UserContext';
import { isValidPhone, isValidEmail, normalizePhone } from '@/lib/utils/validation';


export default function LoginPage() {
  const [userInput, setUserInput] = useState<string>("");
  const [normalizedInput, setNormalizedInput] = useState("");
  const [isEmail, setIsEmail] = useState(false);

  //一時データ保存（２段階処理をするために重要）
  const [pendingSignup, setPendingSignup] =
    useState<SignupData | null>(null);

  //フローに応じて画面切り替え
  const [step, setStep] = useState<
    'inputUser' | 'password' | 'signup' | 'smsVerify'
    >('inputUser');

  const [errorMessage, setErrorMessage] = useState<string>("");
  const { setUser } = useUser();
  const router = useRouter();


  //===========================
  //入り口処理
  //===========================

  //(e: React.SyntheticEvent<HTMLFormElement>)・・・form上の何らかのイベント
  const handleNext = async (e: React.SyntheticEvent<HTMLFormElement>) => {
    //無駄なリロードを止める
    e.preventDefault();

    const input = userInput.trim();

    // 未入力の場合
    if (!input) {
      setErrorMessage("電話番号またはメールアドレスを入力してください");
      return;
    }

    //メールアドレスや電話番号らしき値が入力されているかチェック
    const emailCheck = isValidEmail(input);
    const phoneCheck = isValidPhone(input);

    if (!emailCheck && !phoneCheck) {
      setErrorMessage("正しいメールアドレスまたは電話番号(ハイフンなし)を入力してください");
      return;
    }

    //正規化
    const normalized = phoneCheck ? normalizePhone(input) : input;

    //正規化された電話番号またはメールアドレスを状態に保存
    setNormalizedInput(normalized);
    setIsEmail(emailCheck);

    try {
      //userの存在を確認し、その後のフローを決定
      const { exists } = await checkUser(normalized);
      setErrorMessage("");

      if (exists) setStep("password");
      else setStep("signup");

    } catch {
      setErrorMessage("ユーザー確認に失敗しました。もう一度試してください。");
    }
  };

  //===========================
  //ログイン
  //===========================

  const handleLogin = async (password: string) => {
    setErrorMessage("");

    //未入力の場合
    if (!password.trim()) {
      setErrorMessage("パスワードを入力してください");
      return;
    }

    try {
      const res = await loginUser({
        email: normalizedInput,
        password,
      });

      setUser(res.user);
      router.push('/mypage');

    } catch (err: any) {

      // 🚫 利用停止
      if (
        err.status === 403 &&
        err.message === 'このアカウントは現在利用停止中です'
      ) {
        setErrorMessage('このアカウントは現在利用停止中です');
        return;
      }

      // 🔑 SMS未認証
      if (
        err.status === 403 &&
        err.message === 'SMS認証が完了していません'
      ) {
        alert('SMS認証が必要です');
        setStep('smsVerify');
        return;
      }

      // ❌ パスワード不一致（401）
      if (err.status === 401) {
        setErrorMessage("パスワードが一致しません");
        return;
      }

      //その他
      alert(err.message ?? 'ログイン失敗');
    }
  };

  //===========================
  //新規登録
  //===========================

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

  //===========================
  //SMS認証
  //===========================

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

      // 必須チェック（ここ超重要）
      if (!pendingSignup.email || !pendingSignup.tel) {
        alert('メールアドレスと電話番号は必須です');
        return;
      }

      // 型を確定させる（RegisterPayloadに合わせる）
      const payload = {
        ...pendingSignup,
        email: pendingSignup.email,
        tel: pendingSignup.tel,
      };

      // 本登録
      await registerUser(payload);

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

            {errorMessage && (
              <p className="text-red-600 text-sm mb-2 ">
                {errorMessage}
              </p>
            )}

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
            onSubmit={handleLogin}
            errorMessage={errorMessage}/>}
        {step === 'signup' &&
          <SignupForm
            emailOrPhone={normalizedInput}
            isEmail={isEmail}
            onSubmit={handleSignup} />}
      </main>

      <FooterLogin />
    </>
  );
}
