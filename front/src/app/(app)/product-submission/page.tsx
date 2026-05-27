'use client';

import { useEffect, useMemo, useState } from 'react';
import {
    fetchProductSubmissionOptions,
    submitProduct,
    ProductFormOptions,
} from '@/lib/api/productSubmissionApi';
import { validateProductForm } from '@/lib/utils/validation';

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
    const [images, setImages] = useState<File[]>([]);
    const [message, setMessage] = useState('');
    const handleRemoveImage = (index: number) => {

        setImages((prev) =>
            prev.filter((_, i) => i !== index)
        );
    };

    const imagePreviews = useMemo(() => {

        return images.map((image) => ({
                file: image,
                url: URL.createObjectURL(image),
            }));

    }, [images]);

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
        const errorMessage = validateProductForm({
            category_id: categoryId,
            shipment_date_id: shipmentDateId,
            seller_id: sellerId,
            product_name: productName,
            product_price: productPrice,
            product_description: productDescription,
            created_by: createdBy,
            images,
            requireImage: true,
        });

        if (errorMessage) {
            setMessage(errorMessage);
            return;
        }

        try {

            const formData = new FormData();

            formData.append('product_name', productName);
            formData.append('product_price', productPrice);
            formData.append('product_description', productDescription);

            formData.append('created_by', createdBy);

            formData.append('category_id', categoryId);
            formData.append('seller_id', sellerId);
            formData.append('shipment_date_id', shipmentDateId);

            images.forEach((image) => {
                formData.append('images[]', image);
            });

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
            setImages([]);

        } catch {

            setMessage('登録に失敗しました');
        }
    }

    return (

        <div className="max-w-2xl mx-auto p-6">

            <h1 className="text-2xl font-bold mb-6">
                商品仮登録
            </h1>

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
                        配送予定日
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
                            multiple
                            className="hidden"
                            onChange={(e) => {

                                if (!e.target.files) return;

                                const files = Array.from(e.target.files);

                                setImages((prev) => [
                                    ...prev,
                                    ...files,
                                ]);

                                // 同じ画像を再選択できるようにする
                                e.target.value = '';
                            }}
                        />
                    </label>

                    {images.length > 0 && (
                        <div className="mt-2 text-sm text-gray-600">
                            {images.map((image, index) => (
                                <p key={`${image.name}-${index}`}>
                                    選択中: {image.name}
                                </p>
                            ))}
                        </div>
                    )}
                </div>

                {imagePreviews.length > 0 && (

                    <div className="mt-4">

                        <p className="text-sm mb-2 text-gray-600">
                            商品プレビュー
                        </p>

                        <div className="flex flex-wrap gap-4">

                            {imagePreviews.map((preview, index) => (

                                <div
                                    key={`${preview.file.name}-${index}`}
                                    className="w-48"
                                >

                                    <div
                                        className="
                                            rounded-lg
                                            overflow-hidden
                                            bg-white
                                        "
                                    >
                                        <img
                                            src={preview.url}
                                            alt="商品プレビュー"
                                            className="
                                                w-full
                                                h-48
                                                object-contain
                                                rounded-lg
                                                border
                                            "
                                        />
                                    </div>

                                    <button
                                        type="button"
                                        onClick={() => handleRemoveImage(index)}
                                        className="
                                            mt-2
                                            w-full
                                            bg-red-500
                                            text-white
                                            text-sm
                                            py-1
                                            rounded
                                            hover:bg-red-600
                                            cursor-pointer
                                        "
                                    >
                                        削除
                                    </button>

                                </div>
                            ))}
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

                {message && (
                    <p className="my-2 text-red-500">
                        {message}
                    </p>
                )}

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