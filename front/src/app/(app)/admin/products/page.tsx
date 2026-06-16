'use client';

import useSWR from 'swr';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { fetchProducts, ProductList, toggleProductStatus } from '@/lib/api/adminProductApi';
import Link from 'next/link';

export default function AdminProductsPage() {
    const router = useRouter();

    //入力中の検索ワード取得（Enter押すまでAPI叩かないように）
    const [keyword, setKeyword] = useState('');
    //実際に使う検索ワード取得
    const [search, setSearch] = useState('');
    //リレーションもソートをかけられるようにsortableな型を作る
    type SortableKey =
        | 'id'
        | 'category_name'
        | 'shipment_date'
        | 'seller_name'
        | 'product_name'
        | 'product_price'
        | 'updated_at'
        | 'status';
    //ソートする列の取得
    const [sortKey, setSortKey] = useState<SortableKey>('id');
    //昇順・降順
    const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');

    const { data, error, isLoading, mutate } = useSWR<ProductList[]>(
        ['adminProducts', search],
        () => fetchProducts(search)
    );

    if (isLoading) return <div className="p-5">読み込み中...</div>;
    if (error) return <div className="p-5 text-red-500">エラーが発生しました</div>;

    //ソート関数
    const sortedProducts = [...(data ?? [])].sort((a, b) => {
        const getValue = (product: ProductList, key: SortableKey) => {
            switch (key) {
                case 'category_name':
                    return product.category?.category_name ?? '';

                case 'shipment_date':
                    return product.shipment_date?.shipment_date ?? '';

                case 'seller_name':
                    return product.seller?.seller_name ?? '';

                default:
                    return product[key as keyof ProductList];
            }
        };

        const aValue = getValue(a, sortKey);
        const bValue = getValue(b, sortKey);

        if (aValue == null) return 1;
        if (bValue == null) return -1;

        if (aValue < bValue) return sortOrder === 'asc' ? -1 : 1;
        if (aValue > bValue) return sortOrder === 'asc' ? 1 : -1;

        return 0;
    });

    //ソート時のヘッダークリック処理
    const handleSort = (key: SortableKey) => {
        if (sortKey === key) {
            setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
        } else {
            setSortKey(key);
            setSortOrder('asc');
        }
    };

    return (
        <div className="min-h-screen bg-gray-100 p-5">
            <h1 className="text-2xl font-semibold mb-4">商品 一覧</h1>

            <Link
                href="/admin"
                className="inline-block mb-4 text-xs bg-white border border-gray-300 rounded-md px-4 py-2 hover:bg-gray-50 cursor-pointer"
            >
                ダッシュボードに戻る
            </Link>

            {/* 🔍 検索エリア */}
            <div className="mb-4 flex gap-2">
                <input
                    type="text"
                    value={keyword}
                    onChange={(e) => setKeyword(e.target.value)}
                    onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                            setSearch(keyword.trim());
                        }
                    }}
                    placeholder="商品名・価格で検索"
                    className="border border-gray-300 rounded bg-white px-3 py-2 text-sm w-96"
                />
                <button
                    onClick={() => setSearch(keyword)}
                    className="bg-gray-800 text-white px-4 py-2 text-sm rounded"
                >
                    検索
                </button>
            </div>

            {/* テーブル */}
            <div className="bg-white border border-gray-300 rounded-md overflow-hidden mx-auto max-w-7xl">
                <table className="w-full text-sm border-collapse">
                    <thead className="bg-gray-50">
                        <tr>
                            <th
                                onClick={() => handleSort('id')}
                                className="text-left px-3 py-2 font-semibold border-b cursor-pointer hover:bg-gray-100 w-16">
                                ID{sortKey === 'id' && (sortOrder === 'asc' ? ' ↑' : ' ↓')}
                            </th>
                            <th
                                onClick={() => handleSort('category_name')}
                                className="text-left px-3 py-2 font-semibold border-b cursor-pointer hover:bg-gray-100 w-32">
                                カテゴリー{sortKey === 'category_name' && (sortOrder === 'asc' ? ' ↑' : ' ↓')}
                            </th>
                            <th
                                onClick={() => handleSort('shipment_date')}
                                className="text-left px-3 py-2 font-semibold border-b cursor-pointer hover:bg-gray-100 w-32">
                                出荷予定日{sortKey === 'shipment_date' && (sortOrder === 'asc' ? ' ↑' : ' ↓')}
                            </th>
                            <th
                                onClick={() => handleSort('seller_name')}
                                className="text-left px-3 py-2 font-semibold border-b cursor-pointer hover:bg-gray-100 w-32">
                                販売者{sortKey === 'seller_name' && (sortOrder === 'asc' ? ' ↑' : ' ↓')}
                            </th>
                            <th
                                onClick={() => handleSort('product_name')}
                                className="text-left px-3 py-2 font-semibold border-b cursor-pointer hover:bg-gray-100 w-16">
                                商品名{sortKey === 'product_name' && (sortOrder === 'asc' ? ' ↑' : ' ↓')}
                            </th>
                            <th
                                onClick={() => handleSort('product_price')}
                                className="text-left px-3 py-2 font-semibold border-b cursor-pointer hover:bg-gray-100 w-16">
                                価格{sortKey === 'product_price' && (sortOrder === 'asc' ? ' ↑' : ' ↓')}
                            </th>
                            <th
                                onClick={() => handleSort('updated_at')}
                                className="text-left px-3 py-2 font-semibold border-b cursor-pointer hover:bg-gray-100 w-16">
                                最終更新日{sortKey === 'updated_at' && (sortOrder === 'asc' ? ' ↑' : ' ↓')}
                            </th>
                            <th
                                onClick={() => handleSort('status')}
                                className="text-left px-3 py-2 font-semibold border-b cursor-pointer hover:bg-gray-100 w-24">
                                ステータス{sortKey === 'status' && (sortOrder === 'asc' ? ' ↑' : ' ↓')}
                            </th>
                            <th className="px-3 py-2 font-semibold border-b w-16">
                                操作
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {sortedProducts?.map((product) => (
                            <tr
                                key={product.id}
                                onClick={() => router.push(`/admin/products/${product.id}`)}
                                className="border-t hover:bg-gray-50 transition-colors cursor-pointer"
                            >
                                <td className="px-3 py-2 w-16">{product.id}</td>
                                <td className="px-3 py-2 w-32">
                                    {product.category?.category_name ?? '-'}
                                </td>
                                <td className="px-3 py-2 w-32">
                                    {product.shipment_date?.shipment_date ?? '-'}
                                </td>
                                <td className="px-3 py-2 w-32">
                                    {product.seller?.seller_name ?? '-'}
                                </td>
                                <td className="px-3 py-2 w-32">
                                    {product.product_name}
                                </td>
                                <td className="px-3 py-2 w-32">
                                    {product.product_price}
                                </td>
                                <td className="px-3 py-2 w-16">
                                    {new Date(product.updated_at).toLocaleDateString('ja-JP')}
                                </td>
                                <td className="px-3 py-2 w-16">
                                    <button className={`px-3 py-1 text-xs rounded
                                        ${product.status === 'inactive' && 'text-blue-500'}
                                        ${product.status === 'active' && 'text-green-700'}
                                        ${product.status === 'suspended' && 'text-yellow-700'}
                                        ${product.status === 'withdrawn' && 'text-red-500'}
                                    `}>
                                        {product.status === 'inactive' && '承認待ち'}
                                        {product.status === 'active' && '有効'}
                                        {product.status === 'suspended' && '停止'}
                                        {product.status === 'withdrawn' && '退会'}
                                    </button>
                                </td>

                                <td className="text-center px-3 py-2 w-16">
                                    {product.status !== 'withdrawn' &&
                                    product.status !== 'inactive' && (
                                        <button
                                            onClick={async (e) => {
                                                e.stopPropagation();
                                                await toggleProductStatus(product.id);
                                                mutate();
                                            }}
                                            className={`px-3 py-1 mx-auto text-xs rounded text-white cursor-pointer
                                                ${product.is_active
                                                    ? 'bg-red-500 hover:bg-red-600'
                                                    : 'bg-green-500 hover:bg-green-600'
                                                }
                                            `}
                                        >
                                            {product.is_active ? '停止' : '再開'}
                                        </button>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}