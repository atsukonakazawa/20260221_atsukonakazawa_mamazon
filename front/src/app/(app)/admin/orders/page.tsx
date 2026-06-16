'use client';

import useSWR from 'swr';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { fetchOrders, OrderListItem } from '@/lib/api/adminOrderApi';

export default function AdminOrdersPage() {
    const router = useRouter();

    const [keyword, setKeyword] = useState('');
    const [search, setSearch] = useState('');

    type SortableKey =
    | 'id'
    | 'created_at'
    | 'user_name'
    | 'total_amount'
    | 'payment_status'
    | 'shipment_status';

    const [sortKey, setSortKey] =
        useState<SortableKey>('created_at');

    const [sortOrder, setSortOrder] =
        useState<'asc' | 'desc'>('desc');

    const {
        data: orders,
        isLoading,
        error,
    } = useSWR<OrderListItem[]>(
        ['adminOrders', search],
        () => fetchOrders(search)
    );

    if (isLoading) {
        return <div className="p-5">読み込み中...</div>;
    }

    if (error) {
        return (
            <div className="p-5 text-red-500">
                注文一覧の取得に失敗しました
            </div>
        );
    }

    // ソート処理
    const sortedOrders = [...(orders ?? [])].sort((a, b) => {
        const aValue = a[sortKey];
        const bValue = b[sortKey];

        if (aValue == null) return 1;
        if (bValue == null) return -1;

        if (aValue < bValue) {
            return sortOrder === 'asc' ? -1 : 1;
        }

        if (aValue > bValue) {
            return sortOrder === 'asc' ? 1 : -1;
        }

        return 0;
    });

    // ソート関数
    const handleSort = (key: SortableKey) => {
        if (sortKey === key) {
            setSortOrder(
                sortOrder === 'asc' ? 'desc' : 'asc'
            );
        } else {
            setSortKey(key);
            setSortOrder('asc');
        }
    };

    return (
        <div className="p-5">
            <h1 className="text-2xl font-semibold mb-5">
                注文管理
            </h1>

            <button
                onClick={() => router.push('/admin')}
                className="mb-4 text-xs bg-white border border-gray-300 rounded-md px-4 py-2 hover:bg-gray-50 cursor-pointer"
            >
                ダッシュボードへ戻る
            </button>

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
                    placeholder="注文番号・購入者名・金額で検索"
                    className="border border-gray-300 rounded bg-white px-3 py-2 text-sm w-96"
                />

                <button
                    onClick={() => setSearch(keyword.trim())}
                    className="bg-gray-800 text-white px-4 py-2 text-sm rounded"
                >
                    検索
                </button>
            </div>

            <div className="overflow-x-auto bg-white border rounded-lg">
                <table className="w-full text-sm">
                    <thead className="bg-gray-100">
                        <tr>
                            <th onClick={() => handleSort('id')}
                                className="px-4 py-3 text-left cursor-pointer hover:bg-gray-200">
                                注文番号 {sortKey === 'id' && (sortOrder === 'asc' ? ' ↑' : ' ↓')}
                            </th>
                            <th onClick={() => handleSort('created_at')}
                                className="px-4 py-3 text-left cursor-pointer hover:bg-gray-200">
                                注文日時{sortKey === 'created_at' && (sortOrder === 'asc' ? ' ↑' : ' ↓')}
                            </th>
                            <th onClick={() => handleSort('user_name')}
                                className="px-4 py-3 text-left cursor-pointer hover:bg-gray-200">
                                購入者{sortKey === 'user_name' && (sortOrder === 'asc' ? ' ↑' : ' ↓')}
                            </th>
                            <th onClick={() => handleSort('total_amount')}
                                className="px-4 py-3 text-right cursor-pointer hover:bg-gray-200">
                                注文金額{sortKey === 'total_amount' && (sortOrder === 'asc' ? ' ↑' : ' ↓')}
                            </th>
                            <th onClick={() => handleSort('payment_status')}
                                className="px-4 py-3 text-center cursor-pointer hover:bg-gray-200">
                                支払状況{sortKey === 'payment_status' && (sortOrder === 'asc' ? ' ↑' : ' ↓')}
                            </th>
                            <th onClick={() => handleSort('shipment_status')}
                                className="px-4 py-3 text-center cursor-pointer hover:bg-gray-200">
                                配送状況{sortKey === 'shipment_status' && (sortOrder === 'asc' ? ' ↑' : ' ↓')}
                            </th>
                        </tr>
                    </thead>

                    <tbody>
                        {sortedOrders.map((order) => (
                            <tr
                                key={order.id}
                                onClick={() => router.push(`/admin/orders/${order.id}`)}
                                className="border-t hover:bg-gray-50 transition-colors cursor-pointer"
                            >
                                <td className="px-4 py-3">
                                    {order.id}
                                </td>

                                <td className="px-4 py-3">
                                    {order.created_at}
                                </td>

                                <td className="px-4 py-3">
                                    {order.user_name}
                                </td>

                                <td className="px-4 py-3 text-right">
                                    ¥{order.total_amount.toLocaleString()}
                                </td>

                                <td className="px-4 py-3 text-center">
                                    {order.payment_status}
                                </td>

                                <td className="px-4 py-3 text-center">
                                    {order.shipment_status}
                                </td>

                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}