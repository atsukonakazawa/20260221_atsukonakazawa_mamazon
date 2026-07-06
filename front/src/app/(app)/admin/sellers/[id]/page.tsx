'use client';

import useSWR from 'swr';
import { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { fetchSellerDetail, SellerDetail, deleteSeller} from '@/lib/api/adminSellerApi';
import Link from 'next/link';
import { useToast } from '@/lib/context/ToastContext';
import ConfirmDialog from '@/app/components/ConfirmDialog';

export default function AdminSellerDetailPage() {
    const [showDeleteConfirmDialog, setShowDeleteConfirmDialog] = useState(false);

    const { id } = useParams();
    const router = useRouter();
    const { showToast } = useToast();

    const { data, error, isLoading } = useSWR<SellerDetail>(
        id ? `adminSeller-${id}` : null,
        () => fetchSellerDetail(Number(id))
    );

    if (isLoading) return <div className="p-5">読み込み中...</div>;
    if (error) return <div className="p-5 text-red-500">エラーが発生しました</div>;
    if (!data) return null;

    const handleDelete = async () => {
        try {
            await deleteSeller(data.id);

            // ダイアログを閉じる
            setShowDeleteConfirmDialog(false);
            // 成功メッセージ
            showToast('削除処理しました', 'success');
            //少し待ってから画面遷移
            setTimeout(() => {
                router.push('/admin/sellers');
            }, 200);

        } catch {
            // ダイアログを閉じる
            setShowDeleteConfirmDialog(false);
            // エラーメッセージ
            showToast('処理に失敗しました', 'error');
        }
    };

    return (
        <div className="min-h-screen bg-gray-100 p-5">
            <Link
                href="/admin/sellers"
                className="inline-block mb-4 text-xs bg-white border border-gray-300 rounded-md px-4 py-2 hover:bg-gray-50 cursor-pointer"
            >
                一覧に戻る
            </Link>

            <div className="bg-white border border-gray-300 rounded-md mx-auto p-6 max-w-2xl">
                <h1 className="text-xl font-semibold mb-4">販売者　詳細</h1>

                <div className="space-y-3 text-sm">
                    <div><strong>ID:</strong> {data.id}</div>
                    <div><strong>販売者名:</strong> {data.seller_name}</div>
                    <div><strong>電話番号:</strong> {data.tel ?? '-'}</div>
                    <div><strong>郵便番号:</strong> {data.postcode ?? '-'}</div>
                    <div><strong>住所:</strong> {data.address ?? '-'}</div>
                    <div><strong>登録日:</strong> {new Date(data.created_at).toLocaleDateString('ja-JP')}</div>
                    <div>
                        <strong>状態:</strong>{' '}
                        <span className={`px-2 py-1 text-xs rounded
                            ${data.is_active
                                ? 'bg-green-100 text-green-700'
                                : 'bg-red-100 text-red-700'}
                        `}>
                            {data.is_active ? '有効' : '停止中'}
                        </span>
                    </div>
                </div>
            </div>
            <div className="mt-8 mx-auto max-w-2xl flex gap-3 justify-center">
                <button
                    onClick={() => router.push(`/admin/sellers/${data.id}/edit`)}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 mx-4 rounded cursor-pointer"
                >
                    編集
                </button>

                <button
                    onClick={() => setShowDeleteConfirmDialog(true)}
                    className="bg-red-600 hover:bg-red-700 text-white px-5 py-2 mx-4 rounded cursor-pointer"
                >
                    削除処理
                </button>
            </div>

            <ConfirmDialog
                open={showDeleteConfirmDialog}
                title="販売者削除"
                message="この販売者を削除処理しますか？"
                confirmText="削除"
                cancelText="キャンセル"
                onConfirm={handleDelete}
                onCancel={() => setShowDeleteConfirmDialog(false)}
            />
        </div>
    );
}