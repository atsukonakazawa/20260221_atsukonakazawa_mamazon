'use client';

import useSWR from 'swr';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { fetchUsers, UserListItem, toggleUserStatus } from '@/lib/api/adminUserApi';
import Link from 'next/link';


export default function AdminUsersPage() {
    const router = useRouter();

    //入力中の検索ワード取得（Enter押すまでAPI叩かないように）
    const [keyword, setKeyword] = useState('');
    //実際に使う検索ワード取得
    const [search, setSearch] = useState('');
    //ソートする列の取得
    const [sortKey, setSortKey] = useState<keyof UserListItem>('id');
    //昇順・降順
    const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');

    const { data, error, isLoading, mutate } = useSWR<UserListItem[]>(
        ['adminUsers', search],
        () => fetchUsers(search)
    );

    if (isLoading) return <div className="p-5">読み込み中...</div>;
    if (error) return <div className="p-5 text-red-500">エラーが発生しました</div>;

    //ソート関数
    const sortedUsers = [...(data ?? [])].sort((a, b) => {
        const aValue = a[sortKey];
        const bValue = b[sortKey];

        if (aValue == null) return 1;
        if (bValue == null) return -1;

        if (aValue < bValue) return sortOrder === 'asc' ? -1 : 1;
        if (aValue > bValue) return sortOrder === 'asc' ? 1 : -1;

        return 0;
    });

    //ソート時のヘッダークリック処理
    const handleSort = (key: keyof UserListItem) => {
        if (sortKey === key) {
            setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
        } else {
            setSortKey(key);
            setSortOrder('asc');
        }
    };

    return (
        <div className="min-h-screen bg-gray-100 p-5">
            <h1 className="text-2xl font-semibold mb-4">ユーザー 一覧</h1>

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
                    placeholder="名前・メールアドレス・電話番号で検索"
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
                                onClick={() => handleSort('last_name')}
                                className="text-left px-3 py-2 font-semibold border-b cursor-pointer hover:bg-gray-100 w-32">
                                名前{sortKey === 'last_name' && (sortOrder === 'asc' ? ' ↑' : ' ↓')}
                            </th>
                            <th
                                onClick={() => handleSort('email')}
                                className="text-left px-3 py-2 font-semibold border-b cursor-pointer hover:bg-gray-100 w-32">
                                メール{sortKey === 'email' && (sortOrder === 'asc' ? ' ↑' : ' ↓')}
                            </th>
                            <th
                                onClick={() => handleSort('tel')}
                                className="text-left px-3 py-2 font-semibold border-b cursor-pointer hover:bg-gray-100 w-32">
                                電話番号{sortKey === 'tel' && (sortOrder === 'asc' ? ' ↑' : ' ↓')}
                            </th>
                            <th
                                onClick={() => handleSort('created_at')}
                                className="text-left px-3 py-2 font-semibold border-b cursor-pointer hover:bg-gray-100 w-16">
                                登録日{sortKey === 'created_at' && (sortOrder === 'asc' ? ' ↑' : ' ↓')}
                            </th>
                            <th
                                onClick={() => handleSort('status')}
                                className="text-left px-3 py-2 font-semibold border-b cursor-pointer hover:bg-gray-100 w-16">
                                ステータス{sortKey === 'status' && (sortOrder === 'asc' ? ' ↑' : ' ↓')}
                            </th>
                            <th className="px-3 py-2 font-semibold border-b w-16">
                                操作
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {sortedUsers?.map((user) => (
                            <tr
                                key={user.id}
                                onClick={() => router.push(`/admin/users/${user.id}`)}
                                className="border-t hover:bg-gray-50 transition-colors cursor-pointer"
                            >
                                <td className="px-3 py-2 w-16">{user.id}</td>
                                <td className="px-3 py-2 w-32">
                                    {user.last_name} {user.first_name}
                                </td>
                                <td className="px-3 py-2 w-32">
                                    {user.email ?? '-'}
                                </td>
                                <td className="px-3 py-2 w-32">
                                    {user.tel ?? '-'}
                                </td>
                                <td className="px-3 py-2 w-16">
                                    {new Date(user.created_at).toLocaleDateString('ja-JP')}
                                </td>
                                <td className="px-3 py-2 w-16">
                                    <button className={`px-3 py-1 text-xs rounded
                                        ${user.status === 'active' && 'text-green-700'}
                                        ${user.status === 'suspended' && 'text-yellow-700'}
                                        ${user.status === 'withdrawn' && 'text-red-500'}
                                    `}>
                                        {user.status === 'active' && '有効'}
                                        {user.status === 'suspended' && '停止'}
                                        {user.status === 'withdrawn' && '退会'}
                                    </button>
                                </td>

                                <td className="text-center px-3 py-2 w-16">
                                    {user.status !== 'withdrawn' && (
                                        <button
                                            onClick={async (e) => {
                                                e.stopPropagation();
                                                await toggleUserStatus(user.id);
                                                mutate();
                                            }}
                                            className={`px-3 py-1 mx-auto text-xs rounded text-white cursor-pointer
                                                ${user.is_active
                                                    ? 'bg-red-500 hover:bg-red-600'
                                                    : 'bg-green-500 hover:bg-green-600'
                                                }
                                            `}
                                        >
                                            {user.is_active ? '停止' : '再開'}
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