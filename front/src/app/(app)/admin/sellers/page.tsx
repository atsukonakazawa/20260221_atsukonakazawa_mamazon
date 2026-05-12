'use client';

import useSWR from 'swr';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { fetchSellers, SellerListItem, toggleSellerStatus } from '@/lib/api/adminSellerApi';

export default function AdminSellersPage() {
    const router = useRouter();

    // 入力中の検索ワード取得（Enter押すまでAPI叩かないように）
    const [keyword, setKeyword] = useState('');
    // 実際に使う検索ワード取得
    const [search, setSearch] = useState('');
    // ソートする列の取得
    const [sortKey, setSortKey] = useState<keyof SellerListItem>('id');
    // 昇順・降順
    const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');

    const { data, error, isLoading, mutate } = useSWR<SellerListItem[]>(
        ['adminSellers', search],
        () => fetchSellers(search)
    );

    if (isLoading) return <div className="p-5">読み込み中...</div>;
    if (error) return <div className="p-5 text-red-500">エラーが発生しました</div>;

    // ソート関数
    const sortedSellers = [...(data ?? [])].sort((a, b) => {
        const aValue = a[sortKey];
        const bValue = b[sortKey];

        if (aValue == null) return 1;
        if (bValue == null) return -1;

        if (aValue < bValue) return sortOrder === 'asc' ? -1 : 1;
        if (aValue > bValue) return sortOrder === 'asc' ? 1 : -1;

        return 0;
    });

    // ソート時のヘッダークリック処理
    const handleSort = (key: keyof SellerListItem) => {
        if (sortKey === key) {
            setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
        } else {
            setSortKey(key);
            setSortOrder('asc');
        }
    };

    return (
        <div className="min-h-screen bg-gray-100 p-5">
            <h1 className="text-xl font-semibold mb-4">販売者 一覧</h1>

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
                    placeholder="販売者名・住所・電話番号で検索"
                    className="border border-gray-300 rounded px-3 py-2 text-sm w-96"
                />
                <button
                    onClick={() => setSearch(keyword.trim())}
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
                                className="text-left px-3 py-2 font-semibold border-b cursor-pointer hover:bg-gray-100 w-16"
                            >
                                ID{sortKey === 'id' && (sortOrder === 'asc' ? ' ↑' : ' ↓')}
                            </th>
                            <th
                                onClick={() => handleSort('seller_name')}
                                className="text-left px-3 py-2 font-semibold border-b cursor-pointer hover:bg-gray-100 w-48"
                            >
                                販売者名{sortKey === 'seller_name' && (sortOrder === 'asc' ? ' ↑' : ' ↓')}
                            </th>
                            <th
                                onClick={() => handleSort('postcode')}
                                className="text-left px-3 py-2 font-semibold border-b cursor-pointer hover:bg-gray-100 w-32"
                            >
                                郵便番号{sortKey === 'postcode' && (sortOrder === 'asc' ? ' ↑' : ' ↓')}
                            </th>
                            <th
                                onClick={() => handleSort('address')}
                                className="text-left px-3 py-2 font-semibold border-b cursor-pointer hover:bg-gray-100"
                            >
                                住所{sortKey === 'address' && (sortOrder === 'asc' ? ' ↑' : ' ↓')}
                            </th>
                            <th
                                onClick={() => handleSort('tel')}
                                className="text-left px-3 py-2 font-semibold border-b cursor-pointer hover:bg-gray-100 w-40"
                            >
                                電話番号{sortKey === 'tel' && (sortOrder === 'asc' ? ' ↑' : ' ↓')}
                            </th>
                            <th
                                onClick={() => handleSort('created_at')}
                                className="text-left px-3 py-2 font-semibold border-b cursor-pointer hover:bg-gray-100 w-32"
                            >
                                登録日{sortKey === 'created_at' && (sortOrder === 'asc' ? ' ↑' : ' ↓')}
                            </th>
                            <th
                                onClick={() => handleSort('status')}
                                className="text-left px-3 py-2 font-semibold border-b cursor-pointer hover:bg-gray-100 w-24">
                                ステータス{sortKey === 'status' && (sortOrder === 'asc' ? ' ↑' : ' ↓')}
                            </th>
                            <th className="px-3 py-2 font-semibold border-b w-24">
                                操作
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {sortedSellers.map((seller) => (
                            <tr
                                key={seller.id}
                                onClick={() => router.push(`/admin/sellers/${seller.id}`)}
                                className="border-t hover:bg-gray-50 transition-colors cursor-pointer"
                            >
                                <td className="px-3 py-2">{seller.id}</td>
                                <td className="px-3 py-2">{seller.seller_name}</td>
                                <td className="px-3 py-2">{seller.postcode}</td>
                                <td className="px-3 py-2">{seller.address}</td>
                                <td className="px-3 py-2">{seller.tel}</td>
                                <td className="px-3 py-2">
                                    {new Date(seller.created_at).toLocaleDateString('ja-JP')}
                                </td>
                                <td className="px-3 py-2 w-24">
                                    <button className={`px-3 py-1 text-xs rounded
                                        ${seller.status === 'active' && 'text-green-700'}
                                        ${seller.status === 'suspended' && 'text-yellow-700'}
                                        ${seller.status === 'withdrawn' && 'text-red-500'}
                                    `}>
                                        {seller.status === 'active' && '有効'}
                                        {seller.status === 'suspended' && '停止'}
                                        {seller.status === 'withdrawn' && '削除済'}
                                    </button>
                                </td>

                                <td className="px-3 py-2 w-24">
                                    {seller.status !== 'withdrawn' && (
                                        <button
                                            onClick={async (e) => {
                                                e.stopPropagation();
                                                await toggleSellerStatus(seller.id);
                                                mutate();
                                            }}
                                            className={`px-3 py-1 mx-3 text-xs rounded text-white cursor-pointer
                                                ${seller.is_active
                                                    ? 'bg-red-500 hover:bg-red-600'
                                                    : 'bg-green-500 hover:bg-green-600'
                                                }
                                            `}
                                        >
                                            {seller.is_active ? '停止' : '再開'}
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