'use client';

import Header from '../../../../components/Header';
import FooterLogin from '../../../../components/FooterLogin';
import { useUser } from '@/lib/context/UserContext';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { updateUser, type UpdateUserRequest } from '@/lib/api/userApi';
import { sendSmsCode, verifySmsCode } from '../../../../../lib/api/authApi';
import SmsVerifyForm from '../../../../components/login/SmsVerifyForm';


export default function AccountEditPage() {
    const { user, setUser } = useUser();
    const router = useRouter();

    //フォーム入力の状態管理
    const [lastName, setLastName] = useState('');
    const [firstName, setFirstName] = useState('');
    const [postcode, setPostcode] = useState('');
    const [address, setAddress] = useState('');
    const [tel, setTel] = useState('');
    const [placement, setPlacement] = useState(false);
    const [placeOfPlacement, setPlaceOfPlacement] = useState('');
    const [email, setEmail] = useState('');

    //パスワードの変更の状態管理
    const [password, setPassword] = useState('');
    const [passwordConfirm, setPasswordConfirm] = useState('');

    //フローに応じて画面切り替え
    const [step, setStep] = useState<'form' | 'smsVerify'>('form');

    //一時データ保存（２段階処理をするために重要）
    const [pendingData, setPendingData] = useState<UpdateUserRequest | null>(null);

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
        if (password && password !== passwordConfirm) {
            alert('パスワードが一致しません');
            return;
        }

        //apiに送信するデータを作成
        //passwordは安全のため入力時だけ追加し、空なら送らない
        const data: UpdateUserRequest = {
            user_id: user.id,
            last_name: lastName,
            first_name: firstName,
            postcode: postcode,
            address: address,
            tel: tel,
            placement: placement,
            place_of_placement: placeOfPlacement,
            email: email,
            ...(password && { password }),
        };

        //電話番号・メールアドレスの変更検知
        const isTelChanged = tel !== user.tel;
        const isEmailChanged = email !== user.email;
        //パスワード・電話番号・メールアドレスどれか変更があればsmsを送る
        const needSms = !!password || isTelChanged || isEmailChanged;

        if (needSms) {
            // SMS認証必要なときは先に認証
            // SMS送信先を決定(電話番号変更なら新しい番号に送信)
            const targetTel = isTelChanged ? tel : user.tel;

            if (!targetTel) {
                alert('電話番号が不正です');
                return;
            }

            //dataを一時保存
            setPendingData(data);
            //authApiに値を送りSMS送信
            await sendSmsCode({ tel: targetTel });
            alert('認証コードを送信しました');
            //画面遷移
            setStep('smsVerify');

        } else {
            // SMS認証必要ない時は即更新
            const updatedUser = await updateUser(data);
            setUser(updatedUser);
            alert('更新しました！');
            router.push('/mypage/account');
        }
    };

    // 認証後の処理
    const handleVerify = async (code: string) => {
        if (!pendingData) {
            alert('データがありません');
            return;
        }

        //再度SMS送信先を決定(電話番号変更なら新しい番号に送信)
        const isTelChanged = pendingData.tel !== user.tel;
        const targetTel = isTelChanged ? pendingData.tel : user.tel;

        //apiにform値を送信
        const result = await verifySmsCode({
            tel: targetTel!,
            code,
        });

        if (!result.success) {
            alert('コードが違います');
            return;
        }

        const updatedUser = await updateUser(pendingData);

        setUser(updatedUser);

        alert('更新しました！');
        router.push('/mypage/account');
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
                    onChange={(e) => setPostcode(e.target.value)}
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
                />
            </div>
        )}

        <FooterLogin />
        </>
    );
}