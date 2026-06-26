'use client';

import { useParams, useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import useSWR from 'swr';
import {
    fetchUserDetail,
    updateAdminUser,
    UserDetail
} from '@/lib/api/adminUserApi';
import {
    validateUserForm,
    normalizePhone,
    normalizePostcode
} from '@/lib/utils/validation';

export default function AdminUserEditPage() {
    const { id } = useParams();
    const router = useRouter();
    const [formError, setFormError] = useState<string>("");


    const { data, isLoading, error } = useSWR<UserDetail>(
        id ? `admin-user-${id}` : null,
        () => fetchUserDetail(Number(id))
    );

    const [form, setForm] = useState({
        last_name: '',
        first_name: '',
        email: '',
        tel: '',
        postcode: '',
        address: '',
        date_of_birth: '',
        placement: false,
        place_of_placement: '',
    });

    // 初期値セット
    useEffect(() => {
        if (!data) return;

        setForm({
            last_name: data.last_name ?? '',
            first_name: data.first_name ?? '',
            email: data.email ?? '',
            tel: data.tel ?? '',
            postcode: data.postcode ?? '',
            address: data.address ?? '',
            date_of_birth: data.date_of_birth ?? '',
            placement: data.placement,
            place_of_placement: data.place_of_placement ?? '',
        });
    }, [data]);

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement>
    ) => {
        const { name, value, type, checked } = e.target;

        setForm(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value,
        }));
    };

    const handleSubmit = async () => {
        const errorMessage = validateUserForm({
            first_name: form.first_name,
            last_name: form.last_name,
            email: form.email ?? '',
            tel: form.tel ?? '',
            postcode: form.postcode ?? '',
            address: form.address ?? '',
        });

        if (errorMessage) {
            setFormError(errorMessage);
            return;
        }
        try {
            await updateAdminUser(Number(id), {
                ...form,
                tel: normalizePhone(form.tel),
                postcode: normalizePostcode(form.postcode)
            });
            alert('更新しました');
            router.push(`/admin/users/${id}`);
        } catch {
            alert('更新失敗');
        }
    };

    if (isLoading) return <div className="p-5">読み込み中...</div>;
    if (error) return <div className="p-5 text-red-500">エラー</div>;

    return (
        <div className="min-h-screen bg-gray-100 p-5">
            <div className="bg-white max-w-2xl mx-auto rounded border p-6">
                <h1 className="text-xl font-semibold mb-6">
                    ユーザー情報 編集
                </h1>

                <div className="space-y-4">
                    <input name="last_name" value={form.last_name} onChange={handleChange} placeholder="姓" className="w-full border p-2 rounded" />
                    <input name="first_name" value={form.first_name} onChange={handleChange} placeholder="名" className="w-full border p-2 rounded" />
                    <input name="email" value={form.email} onChange={handleChange} placeholder="メール" className="w-full border p-2 rounded" />
                    <input name="tel" value={form.tel} onChange={handleChange} placeholder="電話番号" className="w-full border p-2 rounded" />
                    <input name="postcode" value={form.postcode} onChange={handleChange} placeholder="郵便番号" className="w-full border p-2 rounded" />
                    <input name="address" value={form.address} onChange={handleChange} placeholder="住所" className="w-full border p-2 rounded" />
                    <input type="date" name="date_of_birth" value={form.date_of_birth} onChange={handleChange} className="w-full border p-2 rounded" />

                    <label className="flex gap-2">
                        <input
                            type="checkbox"
                            name="placement"
                            checked={form.placement}
                            onChange={handleChange}
                        />
                        置き配
                    </label>

                    <input
                        name="place_of_placement"
                        value={form.place_of_placement}
                        onChange={handleChange}
                        placeholder="置き配場所"
                        className="w-full border p-2 rounded"
                    />

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