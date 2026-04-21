'use client';

import Header from '../../../../components/Header';
import FooterLogin from '../../../../components/FooterLogin';
import { useUser } from '@/lib/context/UserContext';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { updateUser } from '@/lib/api/userApi';

export default function AccountEditPage() {
    const { user, setUser } = useUser();
    const router = useRouter();

    const [lastName, setLastName] = useState('');
    const [firstName, setFirstName] = useState('');
    const [postcode, setPostcode] = useState('');
    const [address, setAddress] = useState('');
    const [tel, setTel] = useState('');
    const [placement, setPlacement] = useState(false);
    const [placeOfPlacement, setPlaceOfPlacement] = useState('');
    const [email, setEmail] = useState('');

    // 初期値セット
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
        try {
            const updatedUser = await updateUser({
                user_id: user.id,
                last_name: lastName,
                first_name: firstName,
                postcode: postcode,
                address: address,
                tel: tel,
                placement: placement,
                place_of_placement: placeOfPlacement,
                email: email,
            });

            // Context更新
            setUser(updatedUser);

            alert('更新しました！');
            router.push('/mypage/account');

        } catch (error) {
            console.error(error);
            alert('更新に失敗しました');
        }
    };

    return (
        <>
        <Header />

        <div className="max-w-md mx-auto p-4 space-y-4">

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

            {/* 更新ボタン */}
            <button
            onClick={handleSave}
            className="w-full bg-yellow-400 p-3 rounded font-bold cursor-pointer"
            >
            更新する
            </button>

        </div>

        <FooterLogin />
        </>
    );
}