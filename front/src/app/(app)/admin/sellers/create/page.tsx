'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createSeller } from '@/lib/api/adminSellerApi';
import { normalizePostcode, normalizePhone } from '@/lib/utils/validation';
import { fetchAddress } from "@/lib/api/postcodeApi";


export default function AdminSellerCreatePage() {

    const router = useRouter();

    const [sellerName, setSellerName] = useState('');
    const [postcode, setPostcode] = useState('');
    const [address, setAddress] = useState('');
    const [tel, setTel] = useState('');
    const [message, setMessage] = useState('');

    async function handleSubmit(e: React.FormEvent) {

        e.preventDefault();

        setMessage('');

        if (
            !sellerName.trim() ||
            !postcode.trim() ||
            !address.trim() ||
            !tel.trim()
        ) {
            setMessage('すべての項目を入力してください');
            return;
        }

        try {

            await createSeller({
                seller_name: sellerName,
                postcode: normalizePostcode(postcode),
                address,
                tel: normalizePhone(tel),
            });

            alert('販売会社の登録に成功しました');

            router.push('/admin/sellers');

        } catch {

            setMessage('販売会社の登録に失敗しました');
        }
    }

    return (

        <div className="max-w-2xl mx-auto p-6">

            <h1 className="text-2xl font-bold mb-6">
                販売会社 新規登録
            </h1>

            <form
                onSubmit={handleSubmit}
                className="space-y-4"
            >

                <div>
                    <label className="block mb-1">
                        販売会社名
                    </label>

                    <input
                        type="text"
                        value={sellerName}
                        onChange={(e) => setSellerName(e.target.value)}
                        className="w-full border p-2 rounded"
                    />
                </div>

                <div>
                    <label className="block mb-1">
                        郵便番号
                    </label>

                    <input
                        type="text"
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
                        className="w-full border p-2 rounded"
                    />
                </div>

                <div>
                    <label className="block mb-1">
                        住所
                    </label>

                    <input
                        type="text"
                        value={address}
                        onChange={(e) => setAddress(e.target.value)}
                        className="w-full border p-2 rounded"
                    />
                </div>

                <div>
                    <label className="block mb-1">
                        電話番号
                    </label>

                    <input
                        type="text"
                        value={tel}
                        onChange={(e) => setTel(e.target.value)}
                        className="w-full border p-2 rounded"
                    />
                </div>

                {message && (
                    <p className="my-2 text-red-500">
                        {message}
                    </p>
                )}

                <div className="flex gap-2">

                    <button
                        type="button"
                        onClick={() => router.push('/admin/sellers')}
                        className="
                            bg-white
                            border
                            border-gray-300
                            px-4
                            py-2
                            rounded
                            cursor-pointer
                        "
                    >
                        戻る
                    </button>

                    <button
                        type="submit"
                        className="
                            bg-black
                            text-white
                            px-4
                            py-2
                            rounded
                            cursor-pointer
                        "
                    >
                        登録する
                    </button>

                </div>

            </form>

        </div>
    );
}