'use client';

import { useParams, useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import useSWR from 'swr';
import {
    fetchSellerDetail,
    updateAdminSeller,
    SellerDetail
} from '@/lib/api/adminSellerApi';
import { validateSellerForm, normalizePhone, normalizePostcode } from '@/lib/utils/validation';
import { fetchAddress } from "@/lib/api/postcodeApi";
import { useToast } from '@/lib/context/ToastContext';


export default function AdminSellerEditPage() {
    const [formError, setFormError] = useState<string>("");

    const { id } = useParams();
    const router = useRouter();
    const { showToast } = useToast();

    const { data, isLoading, error } = useSWR<SellerDetail>(
        id ? `admin-seller-${id}` : null,
        () => fetchSellerDetail(Number(id))
    );

    const [form, setForm] = useState({
        seller_name: '',
        tel: '',
        postcode: '',
        address: '',
    });

    // 初期値セット
    useEffect(() => {
        if (!data) return;

        setForm({
            seller_name: data.seller_name ?? '',
            tel: data.tel ?? '',
            postcode: data.postcode ?? '',
            address: data.address ?? '',
        });
    }, [data]);

    const handleChange = async (
        e: React.ChangeEvent<HTMLInputElement>
    ) => {
        const { name, value, type, checked } = e.target;

        // 通常の入力
        if (name !== "postcode") {
            setForm(prev => ({
                ...prev,
                [name]: type === "checkbox" ? checked : value,
            }));
            return;
        }

        // 郵便番号だけ特別処理
        const postcode = value.replace("-", "");

        setForm(prev => ({
            ...prev,
            postcode,
        }));

        if (postcode.length === 7) {
            const address = await fetchAddress(postcode);

            if (address) {
                setForm(prev => ({
                    ...prev,
                    postcode,
                    address,
                }));
            }
        }
    };

    const handleSubmit = async () => {

        //前回のエラーメッセージを消す
        setFormError('');

        const errorMessage = validateSellerForm({
            seller_name: form.seller_name,
            tel: form.tel ?? '',
            postcode: form.postcode ?? '',
            address: form.address ?? '',
        });

        if (errorMessage) {
            setFormError(errorMessage);
            return;
        }

        try {
            await updateAdminSeller(Number(id), {
                ...form,
                postcode: normalizePostcode(form.postcode),
                tel: normalizePhone(form.tel),
            });

            // 成功メッセージ
            showToast('更新しました', 'success');
            // 少し待って画面遷移
            setTimeout(() => {
                router.push(`/admin/sellers/${id}`);
            }, 200);

        } catch {
            // エラーメッセージ
            showToast('更新に失敗しました', 'error');
        }
    };

    if (isLoading) return <div className="p-5">読み込み中...</div>;
    if (error) return <div className="p-5 text-red-500">エラー</div>;

    return (
        <div className="min-h-screen bg-gray-100 p-5">
            <div className="bg-white max-w-2xl mx-auto rounded border p-6">
                <h1 className="text-xl font-semibold mb-6">
                    販売会社情報　編集
                </h1>

                <div className="space-y-4">
                    <input name="seller_name" value={form.seller_name} onChange={handleChange} placeholder="株式会社　ABC" className="w-full border p-2 rounded" />
                    <input name="tel" value={form.tel} onChange={handleChange} placeholder="電話番号" className="w-full border p-2 rounded" />
                    <input name="postcode" value={form.postcode} onChange={handleChange} placeholder="郵便番号" className="w-full border p-2 rounded" />
                    <input name="address" value={form.address} onChange={handleChange} placeholder="住所" className="w-full border p-2 rounded" />

                    {/* エラーメッセージ */}
                    {formError && (
                        <p className="text-red-600 text-sm mb-2">
                        {formError}
                        </p>
                    )}

                    <div className="flex gap-3 mt-6">
                        <button
                            onClick={handleSubmit}
                            className="bg-blue-600 text-white px-4 py-2 rounded cursor-pointer"
                        >
                            保存
                        </button>

                        <button
                            onClick={() => router.back()}
                            className="bg-gray-400 text-white px-4 py-2 rounded cursor-pointer"
                        >
                            戻る
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}