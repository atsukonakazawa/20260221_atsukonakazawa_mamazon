'use client';

import { useEffect, useMemo, useState } from 'react';
import {
    fetchProductSubmissionOptions,
    submitProduct,
    ProductFormOptions,
} from '@/lib/api/productSubmissionApi';

export default function ProductSubmissionPage() {

    const [categories, setCategories] =
    useState<ProductFormOptions['categories']>([]);
    const [sellers, setSellers] =
        useState<ProductFormOptions['sellers']>([]);
    const [shipmentDates, setShipmentDates] =
        useState<ProductFormOptions['shipment_dates']>([]);
    const [categoryId, setCategoryId] = useState('');
    const [sellerId, setSellerId] = useState('');
    const [shipmentDateId, setShipmentDateId] = useState('');
    const [productName, setProductName] = useState('');
    const [productPrice, setProductPrice] = useState('');
    const [productDescription, setProductDescription] = useState('');
    const [createdBy, setCreatedBy] = useState('');
    const [image, setImage] = useState<File | null>(null);
    const [message, setMessage] = useState('');

    const imagePreview = useMemo(() => {

        if (!image) return null;

        return URL.createObjectURL(image);

    }, [image]);

    useEffect(() => {

        fetchOptions();

    }, []);

    async function fetchOptions() {

        const data = await fetchProductSubmissionOptions();

        setCategories(data.categories);
        setSellers(data.sellers);
        setShipmentDates(data.shipment_dates);
    }

    async function handleSubmit(e: React.FormEvent) {

        e.preventDefault();

        setMessage('');

        try {

            const formData = new FormData();

            formData.append('product_name', productName);
            formData.append('product_price', productPrice);
            formData.append('product_description', productDescription);

            formData.append('created_by', createdBy);

            formData.append('category_id', categoryId);
            formData.append('seller_id', sellerId);
            formData.append('shipment_date_id', shipmentDateId);

            if (image) {
                formData.append('image', image);
            }

            await submitProduct(formData);

            setMessage('商品を仮登録しました!');

            // 初期化
            setProductName('');
            setProductPrice('');
            setProductDescription('');
            setCreatedBy('');
            setCategoryId('');
            setSellerId('');
            setShipmentDateId('');
            setImage(null);

        } catch {

            setMessage('登録に失敗しました');
        }
    }

    return (

        <div className="max-w-2xl mx-auto p-6">

            <h1 className="text-2xl font-bold mb-6">
                商品仮登録
            </h1>

            {message && (
                <p className="mb-4 text-sm">
                    {message}
                </p>
            )}

            <form
                onSubmit={handleSubmit}
                className="space-y-4"
            >

                <div>
                    <label className="block mb-1">
                        商品名
                    </label>

                    <input
                        type="text"
                        value={productName}
                        onChange={(e) => setProductName(e.target.value)}
                        className="w-full border p-2 rounded"
                    />
                </div>

                <div>
                    <label className="block mb-1">
                        価格
                    </label>

                    <input
                        type="number"
                        value={productPrice}
                        onChange={(e) => setProductPrice(e.target.value)}
                        className="w-full border p-2 rounded"
                    />
                </div>

                <div>
                    <label className="block mb-1">
                        商品説明
                    </label>

                    <textarea
                        value={productDescription}
                        onChange={(e) => setProductDescription(e.target.value)}
                        className="w-full border p-2 rounded"
                    />
                </div>

                <div>
                    <label className="block mb-1">
                        カテゴリー
                    </label>

                    <select
                        value={categoryId}
                        onChange={(e) => setCategoryId(e.target.value)}
                        className="w-full border p-2 rounded"
                    >
                        <option value="">
                            選択してください
                        </option>

                        {categories.map((category) => (

                            <option
                                key={category.id}
                                value={category.id}
                            >
                                {category.category_name}
                            </option>
                        ))}
                    </select>
                </div>

                <div>
                    <label className="block mb-1">
                        販売会社
                    </label>

                    <select
                        value={sellerId}
                        onChange={(e) => setSellerId(e.target.value)}
                        className="w-full border p-2 rounded"
                    >
                        <option value="">
                            選択してください
                        </option>

                        {sellers.map((seller) => (

                            <option
                                key={seller.id}
                                value={seller.id}
                            >
                                {seller.seller_name}
                            </option>
                        ))}
                    </select>
                </div>

                <div>
                    <label className="block mb-1">
                        発送日
                    </label>

                    <select
                        value={shipmentDateId}
                        onChange={(e) => setShipmentDateId(e.target.value)}
                        className="w-full border p-2 rounded"
                    >
                        <option value="">
                            選択してください
                        </option>

                        {shipmentDates.map((date) => (

                            <option
                                key={date.id}
                                value={date.id}
                            >
                                {date.shipment_date}
                            </option>
                        ))}
                    </select>
                </div>

                <div>
                    <label className="block mb-2">
                        商品画像
                    </label>

                    <label
                        className="
                            inline-block
                            bg-gray-800
                            text-white
                            px-4
                            py-2
                            rounded
                            cursor-pointer
                            hover:bg-gray-700
                            transition
                        "
                    >
                        画像を追加

                        <input
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={(e) => {

                                if (e.target.files?.[0]) {
                                    setImage(e.target.files[0]);
                                }
                            }}
                        />
                    </label>

                    {image && (
                        <p className="mt-2 text-sm text-gray-600">
                            選択中: {image.name}
                        </p>
                    )}
                </div>

                {imagePreview && (

                    <div className="mt-4">

                        <p className="text-sm mb-2 text-gray-600">
                            商品プレビュー
                        </p>

                        <div className="
                            w-48
                            rounded-lg
                            overflow-hidden
                            bg-white
                        ">

                            <img
                                src={imagePreview}
                                alt="商品プレビュー"
                                className="w-full h-48 object-contain rounded-lg border"
                            />

                        </div>

                    </div>
                )}

                <div>
                    <label className="block mb-1">
                        登録担当者
                    </label>

                    <input
                        type="text"
                        value={createdBy}
                        onChange={(e) => setCreatedBy(e.target.value)}
                        className="w-full border p-2 rounded"
                    />
                </div>

                <button
                    type="submit"
                    className="bg-black text-white px-4 py-2 rounded cursor-pointer"
                >
                    仮登録する
                </button>

            </form>

        </div>
    );
}