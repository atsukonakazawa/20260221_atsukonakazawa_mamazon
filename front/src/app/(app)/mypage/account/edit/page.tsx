'use client';

import Header from '../../../../components/Header';
import FooterLogin from '../../../../components/FooterLogin';
import { useUser } from '@/lib/context/UserContext';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { updateUser, type UpdateUserRequest } from '@/lib/api/userApi';
import { sendSmsCode, verifySmsCode } from '../../../../../lib/api/authApi';
import SmsVerifyForm from '../../../../components/login/SmsVerifyForm';
import {
    validateUserForm,
    normalizePhone,
    normalizePostcode
} from '@/lib/utils/validation';
import { fetchAddress } from "@/lib/api/postcodeApi";
import { useToast } from '@/lib/context/ToastContext';

export default function AccountEditPage() {

    //フォーム入力の状態管理
    const [lastName, setLastName] = useState('');
    const [firstName, setFirstName] = useState('');
    const [postcode, setPostcode] = useState('');
    const [address, setAddress] = useState('');
    const [tel, setTel] = useState('');
    const [placement, setPlacement] = useState(false);
    const [placeOfPlacement, setPlaceOfPlacement] = useState('');
    const [email, setEmail] = useState('');

    const [formError, setFormError] = useState<string>("");
    const [smsError, setSmsError] = useState('');

    //パスワードの変更の状態管理
    const [password, setPassword] = useState('');
    const [passwordConfirm, setPasswordConfirm] = useState('');

    //フローに応じて画面切り替え
    const [step, setStep] = useState<'form' | 'smsVerify'>('form');

    //一時データ保存（２段階処理をするために重要）
    const [pendingData, setPendingData] = useState<UpdateUserRequest | null>(null);

    const { user, setUser } = useUser();
    const router = useRouter();
    const { showToast } = useToast();

    // UserContextから初期値を持ってきてセット
    useEffect(() => {
        console.log('user:', user);
        if (!user) {
            router.push('/auth');
            return;
        }

        setLastName(user.last_name ?? '');
        setFirstName(user.first_name ?? '');
        setPostcode(user.postcode ?? '');
        setAddress(user.address ?? '');
        setTel(user.tel ?? '');
        setPlacement(user.placement ?? false);
        setPlaceOfPlacement(user.place_of_placement ?? '');
        setEmail(user.email ?? '');

    }, [user, router]);
    if (!user) return null;

    // 保存処理
    const handleSave = async () => {
        setFormError("");

        const error = validateUserForm({
            first_name: firstName,
            last_name: lastName,
            email,
            tel,
            password,
            password_confirm: passwordConfirm,
            postcode,
            address,
        });

        if (error) {
            setFormError(error);
            return;
        }

        if (password && password !== passwordConfirm) {
            setFormError('パスワードが一致しません');
            return;
        }

        //変更検知
        const safe = (v: string | null | undefined) => v ?? '';
        const isTelChanged = normalizePhone(tel) !== normalizePhone(safe(user.tel));
        const isEmailChanged = safe(email) !== safe(user.email);
        const isPasswordChanged = !!password;
        const isNameChanged =
            safe(lastName) !== safe(user.last_name) ||
            safe(firstName) !== safe(user.first_name);
        const isPostcodeChanged = normalizePostcode(postcode) !== normalizePostcode(safe(user.postcode));
        const isAddressChanged =
            safe(address) !== safe(user.address);

        const isPlacementChanged =
            placement !== (user.placement ?? false) ||
            safe(placeOfPlacement) !== safe(user.place_of_placement);

        //何も変更がない場合は変更処理しない
        const isNothingChanged =
            !isTelChanged &&
            !isEmailChanged &&
            !isPasswordChanged &&
            !isNameChanged &&
            !isPostcodeChanged &&
            !isAddressChanged &&
            !isPlacementChanged;

        if (isNothingChanged) {
            setFormError('変更箇所がありません');
            return;
        }

        // 電話番号の正規化
        const normalizedTel = normalizePhone(tel);
        const normalizedPostcode = normalizePostcode(postcode);

        //apiに送信するデータを作成
        //passwordは安全のため入力時だけ追加し、空なら送らない
        const data: UpdateUserRequest = {
            last_name: lastName,
            first_name: firstName,
            postcode: normalizedPostcode,
            address: address,
            tel: normalizedTel,
            placement: placement,
            place_of_placement: placeOfPlacement,
            email: email,
            ...(password && { password }),
        };

        //パスワード・電話番号・メールアドレスどれか変更があればsmsを送る
        const needSms = !!password || isTelChanged || isEmailChanged;

        if (needSms) {
            // SMS認証必要なときは先に認証
            // SMS送信先を決定(電話番号変更なら新しい番号に送信)
            const targetTelRaw = isTelChanged ? tel : user.tel;
            const targetTel = targetTelRaw ? normalizePhone(targetTelRaw) : '';

            if (!targetTel) {
                setFormError('電話番号が不正です');
                return;
            }

            //dataを一時保存
            setPendingData(data);
            //authApiに値を送りSMS送信
            await sendSmsCode({ tel: targetTel });

            // 成功メッセージ
            showToast('認証コードを送信しました', 'success');
            // SMS認証画面へ
            setStep('smsVerify');

        } else {
            // SMS認証必要ない時は即更新
            try {
                const updatedUser = await updateUser(data);

                setUser(updatedUser);

                // 成功メッセージ
                showToast('更新しました', 'success');
                // 少し待って画面遷移
                setTimeout(() => {
                    router.push('/mypage/account');
                }, 200);

            } catch (e: any) {
                // Laravelのバリデーションエラー
                if (e.errors) {
                    const firstError = Object.values(e.errors)
                        .flat()[0] as string;

                    setFormError(firstError);
                    return;
                }

                // APIがmessageを返している場合
                if (e.message) {
                    setFormError(e.message);
                    return;
                }

                // それ以外
                setFormError('更新に失敗しました');

            }
        }
    };

    // 認証後の処理
    const handleVerify = async (code: string) => {
        if (!pendingData) {
            showToast('データがありません', 'error');
            return;
        }

        //再度SMS送信先を決定(電話番号変更なら新しい番号に送信)
        const isTelChanged = pendingData.tel !== user.tel;
        const targetTelRaw = isTelChanged ? pendingData.tel : user.tel;

        if (!targetTelRaw) {
            setSmsError('電話番号が不正です');
            return;
            }

        const targetTel = targetTelRaw ? normalizePhone(targetTelRaw) : '';

        //apiにform値を送信
        try {
            const result = await verifySmsCode({
                tel: targetTel!,
                code,
            });

            if (!result.success) {
                setSmsError('認証コードが正しくありません');
                return;
            }

            setSmsError('');

        } catch (e: any) {
            // 👇 Laravelの422エラーを拾う
            if (e.status === 422) {
                setSmsError(e.message ?? '認証コードが正しくありません');
                return;
            }

            setSmsError('通信エラーが発生しました');
        }

        try {
            const updatedUser = await updateUser(pendingData);

            setUser(updatedUser);
            // 成功メッセージ
            showToast('更新しました', 'success');
            // 少し待って画面遷移
            setTimeout(() => {
                router.push('/mypage/account');
            }, 200);

        } catch (e: any) {
            if (e.errors) {
                const firstError = Object.values(e.errors)
                    .flat()[0] as string;

                setFormError(firstError);
                return;
            }

            if (e.message) {
                setFormError(e.message);
                return;
            }

            setFormError('更新に失敗しました');
        }
    };

    return (
        <>
        <Header />

        <div className="max-w-md mx-auto p-4 space-y-4">

            {step === 'form' && (
                <>
                    <h2 className="text-lg font-bold">アカウント情報の確認・変更</h2>

                    {/* 姓 */}
                    <input
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    placeholder="姓"
                    className="w-full border p-2 rounded"
                    />

                    {/* 名 */}
                    <input
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    placeholder="名"
                    className="w-full border p-2 rounded"
                    />

                    {/* 郵便番号 */}
                    <input
                    value={postcode}
                    onChange={async (e) => {
                        const postcode = e.target.value.replace("-", "");

                        setPostcode(postcode);

                        if (postcode.length === 7) {
                            const addressResult = await fetchAddress(postcode);

                            if (addressResult) {
                                setAddress(addressResult);
                            }
                        }
                    }}
                    placeholder="郵便番号"
                    className="w-full border p-2 rounded"
                    />

                    {/* 住所 */}
                    <input
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    placeholder="住所"
                    className="w-full border p-2 rounded"
                    />

                    {/* 電話番号 */}
                    <input
                    value={tel ?? ''}
                    onChange={(e) => setTel(e.target.value)}
                    placeholder="電話番号"
                    className="w-full border p-2 rounded"
                    />

                    {/* 置き配利用 */}
                    <label className="flex items-center space-x-2">
                        <input
                            type="checkbox"
                            checked={placement}
                            onChange={(e) => setPlacement(e.target.checked)}
                        />
                        <span>置き配を利用する</span>
                    </label>

                    {/* 置き配場所 */}
                    <input
                    value={placeOfPlacement}
                    onChange={(e) => setPlaceOfPlacement(e.target.value)}
                    placeholder="置き配場所"
                    className="w-full border p-2 rounded"
                    />

                    {/* メールアドレス */}
                    <input
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="メールアドレス"
                    className="w-full border p-2 rounded"
                    />

                    {/* パスワード */}
                    <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="新しいパスワード"
                    className="w-full border p-2 rounded"
                    />

                    {/* 確認用パスワード */}
                    <input
                    type="password"
                    value={passwordConfirm}
                    onChange={(e) => setPasswordConfirm(e.target.value)}
                    placeholder="パスワード（確認用）"
                    className="w-full border p-2 rounded"
                        />

                    {/* エラーメッセージ */}
                    {formError && (
                        <p className="text-red-600 text-sm mb-2">
                        {formError}
                        </p>
                    )}

                    {/* 更新ボタン */}
                    <button
                    onClick={handleSave}
                    className="w-full bg-yellow-400 p-3 rounded font-bold cursor-pointer"
                    >
                    更新する
                    </button>
                </>
            )}
        </div>

        {step === 'smsVerify' && pendingData &&  (
            <div className="flex justify-center items-center mt-[50px]">
                <SmsVerifyForm
                tel={pendingData.tel}
                onVerify={handleVerify}
                errorMessage={smsError}
                />
            </div>
        )}

        <FooterLogin />
        </>
    );
}