'use client';

import { useParams, useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import useSWR from 'swr';
import {
    fetchProductDetail,
    updateAdminProduct,
    ProductDetail,
    fetchProductFormOptions,
    ProductFormOptions,
} from '@/lib/api/adminProductApi';
import { validateProductForm }  from '@/lib/utils/validation';

export default function AdminProductEditPage() {
    const { id } = useParams();
    const router = useRouter();

    const [formError, setFormError] = useState<string>("");
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);
    const [initialForm, setInitialForm] = useState({
        category_id: '',
        shipment_date_id: '',
        seller_id: '',
        product_name: '',
        product_price: '',
        color_id: '',
        size_id: '',
        product_description: '',
    });
    const [form, setForm] = useState({
        category_id: '',
        shipment_date_id: '',
        seller_id: '',
        product_name: '',
        product_price: '',
        color_id: '',
        size_id: '',
        product_description: '',
    });


    const { data, isLoading, error } = useSWR<ProductDetail>(
        id ? `admin-product-${id}` : null,
        () => fetchProductDetail(Number(id))
    );
    const { data: options } = useSWR<ProductFormOptions>(
        'product-form-options',
        fetchProductFormOptions
    );


    // 初期値セット
    useEffect(() => {
        if (!data) return;

        const initialData = {
            category_id: data.category_id ?? '',
            shipment_date_id: data.shipment_date_id ?? '',
            seller_id: data.seller_id ?? '',
            product_name: data.product_name ?? '',
            product_price: data.product_price ?? '',
            color_id: data.color_id ?? '',
            size_id: data.size_id ?? '',
            product_description: data.product_description ?? '',
        };

        setForm(initialData);
        setInitialForm(initialData);

    }, [data]);

    const handleChange = (
        e: React.ChangeEvent<
            HTMLInputElement |
            HTMLSelectElement |
            HTMLTextAreaElement
        >
    ) => {
        const { name, value } = e.target;

        setForm(prev => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleSubmit = async () => {
        const isChanged =
            JSON.stringify(form) !== JSON.stringify(initialForm);

        if (!isChanged && !imageFile) {
            setFormError('変更箇所がありません');
            return;
        }

        const errorMessage = validateProductForm({
            category_id: form.category_id,
            shipment_date_id: form.shipment_date_id ?? '',
            seller_id: form.seller_id ?? '',
            product_name: form.product_name ?? '',
            product_price: form.product_price ?? '',
        });

        if (errorMessage) {
            setFormError(errorMessage);
            return;
        }

        try {
            const formData = new FormData();
            formData.append('_method', 'PUT');
            formData.append('category_id', String(form.category_id));
            formData.append('shipment_date_id', String(form.shipment_date_id));
            formData.append('seller_id', String(form.seller_id));
            formData.append('product_name', form.product_name);
            formData.append('product_price', form.product_price);

            if (form.color_id) {
                formData.append('color_id', String(form.color_id));
            }

            if (form.size_id) {
                formData.append('size_id', String(form.size_id));
            }

            if (form.product_description) {
                formData.append('product_description', form.product_description);
            }

            if (imageFile) {
                formData.append('image', imageFile);
            }

            await updateAdminProduct(Number(id), formData);
            alert('更新しました');
            router.push(`/admin/products/${id}`);
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
                    商品情報　編集
                </h1>

                <div className="space-y-4">

                    <label className="block mb-1 font-bold text-[0.9rem]">
                        <span className="mr-3 px-2 py-1 bg-red-500 text-xs text-white round rounded-sm">必須</span>
                        カテゴリー
                    </label>
                    <select
                        name="category_id"
                        value={form.category_id}
                        onChange={handleChange}
                        className="w-full border p-2 rounded bg-white"
                    >
                        <option value="">カテゴリーを選択</option>

                        {options?.categories.map((category) => (
                            <option
                                key={category.id}
                                value={category.id}
                            >
                                {category.category_name}
                            </option>
                        ))}
                    </select>

                    <label className="block mb-1 font-bold text-[0.9rem]">
                        <span className="mr-3 px-2 py-1 bg-red-500 text-xs text-white round rounded-sm">必須</span>
                        出荷予定日
                    </label>
                    <select
                        name="shipment_date_id"
                        value={form.shipment_date_id}
                        onChange={handleChange}
                        className="w-full border p-2 rounded bg-white"
                    >
                        <option value="">出荷予定日を選択</option>

                        {options?.shipment_dates.map((shipmentDate) => (
                            <option
                                key={shipmentDate.id}
                                value={shipmentDate.id}
                            >
                                {shipmentDate.shipment_date}
                            </option>
                        ))}
                    </select>

                    <label className="block mb-1 font-bold text-[0.9rem]">
                        <span className="mr-3 px-2 py-1 bg-red-500 text-xs text-white round rounded-sm">必須</span>
                        販売者
                    </label>
                    <select
                        name="seller_id"
                        value={form.seller_id}
                        onChange={handleChange}
                        className="w-full border p-2 rounded bg-white"
                    >
                        <option value="">販売者を選択</option>

                        {options?.sellers.map((seller) => (
                            <option
                                key={seller.id}
                                value={seller.id}
                            >
                                {seller.seller_name}
                            </option>
                        ))}
                    </select>

                    <label className="block mb-1 font-bold text-[0.9rem]">
                        <span className="mr-3 px-2 py-1 bg-red-500 text-xs text-white round rounded-sm">必須</span>
                        商品名
                    </label>
                    <input name="product_name" value={form.product_name} onChange={handleChange} placeholder="商品名" className="w-full border p-2 rounded" />

                    <label className="block mb-1 font-bold text-[0.9rem]">
                        <span className="mr-3 px-2 py-1 bg-red-500 text-xs text-white round rounded-sm">必須</span>
                        価格
                    </label>
                    <input type="number" name="product_price" value={form.product_price} onChange={handleChange} placeholder="価格" className="w-full border p-2 rounded" />

                    <label className="block mb-1 font-bold text-[0.9rem]">
                        カラー
                    </label>
                    <select
                        name="color_id"
                        value={form.color_id}
                        onChange={handleChange}
                        className="w-full border p-2 rounded bg-white"
                    >
                        <option value="">カラーを選択</option>

                        {options?.colors.map((color) => (
                            <option
                                key={color.id}
                                value={color.id}
                            >
                                {color.color_name}
                            </option>
                        ))}
                    </select>

                    <label className="block mb-1 font-bold text-[0.9rem]">
                        サイズ
                    </label>
                    <select
                        name="size_id"
                        value={form.size_id}
                        onChange={handleChange}
                        className="w-full border p-2 rounded bg-white"
                    >
                        <option value="">サイズを選択</option>

                        {options?.sizes.map((size) => (
                            <option
                                key={size.id}
                                value={size.id}
                            >
                                {size.size_name}
                            </option>
                        ))}
                    </select>

                    <label className="block mb-1 font-bold text-[0.9rem]">
                        商品説明
                    </label>
                    <textarea
                        name="product_description"
                        value={form.product_description}
                        onChange={handleChange}
                        placeholder="商品説明"
                        rows={5}
                        className="w-full border p-2 rounded resize-none"
                    />

                    <div>
                        <label className="block text-sm mb-2 font-bold">
                            商品画像
                        </label>

                        {/* 現在画像 */}
                        <div className="flex gap-2 mb-3 flex-wrap">
                            {data?.images?.map((image) => (
                                <img
                                    key={image.id}
                                    src={`http://localhost/storage/${image.image_path}`}
                                    alt={data.product_name}
                                    className="w-32 h-32 object-cover rounded"
                                />
                            ))}
                        </div>

                        {/* カスタムファイルボタン */}
                        <label className="inline-block  hover:bg-blue-100 text-xs mt-1 px-3 py-1 rounded border cursor-pointer">
                            画像を変更する

                            <input
                                type="file"
                                accept="image/*"
                                onChange={(e) => {
                                    const file = e.target.files?.[0];

                                    if (!file) return;

                                    setImageFile(file);

                                    const imageUrl = URL.createObjectURL(file);
                                    setPreviewUrl(imageUrl);
                                }}
                                className="hidden"
                            />
                        </label>

                        {/* 新画像プレビュー */}
                        {previewUrl && (
                            <div className="mt-5">
                                <div className="flex justify-start mb-2">
                                    <p className="text-sm font-bold">新しい画像</p>
                                    {/* 選択ファイル名 */}
                                    {imageFile && (
                                        <p className="text-sm ml-5 text-gray-400">
                                            選択中: {imageFile.name}
                                        </p>
                                    )}

                                </div>

                                <img
                                    src={previewUrl}
                                    alt="新画像プレビュー"
                                    className="w-32 h-32 object-cover rounded"
                                />
                            </div>
                        )}
                    </div>

                    {/* エラーメッセージ */}
                    {formError && (
                        <p className="text-red-600 text-sm">
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
                            onClick={() => router.push(`/admin/products/${id}`)}
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