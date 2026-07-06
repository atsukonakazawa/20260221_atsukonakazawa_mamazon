'use client';

import useSWR from 'swr';
import { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { fetchProductDetail, ProductDetail, deleteProduct, approveProduct } from '@/lib/api/adminProductApi';
import Link from 'next/link';
import { useToast } from '@/lib/context/ToastContext';
import ConfirmDialog from '@/app/components/ConfirmDialog';

export default function AdminProductDetailPage() {
    const [showApproveForm, setShowApproveForm] = useState(false);
    const [showDeleteConfirmDialog, setShowDeleteConfirmDialog] = useState(false);
    const [approvedBy, setApprovedBy] = useState('');

    const { id } = useParams();
    const router = useRouter();
    const { showToast } = useToast();

    const { data, error, isLoading } = useSWR<ProductDetail>(
        id ? `adminProduct-${id}` : null,
        () => fetchProductDetail(Number(id))
    );

    if (isLoading) return <div className="p-5">読み込み中...</div>;
    if (error) return <div className="p-5 text-red-500">エラーが発生しました</div>;
    if (!data) return null;

    const handleDelete = async () => {
        try {
            await deleteProduct(data.id);

            //削除確認ダイアログを閉じる
            setShowDeleteConfirmDialog(false);
            //成功メッセージを表示
            showToast('削除処理しました', 'success');

            //少し待ってから画面遷移
            setTimeout(() => {
                router.push('/admin/products');
            }, 200);
        } catch {
            //削除確認ダイアログを閉じる
            setShowDeleteConfirmDialog(false);
            //エラーメッセージを表示
            showToast('処理に失敗しました', 'error');
        }
    };

    const handleApprove = async () => {

        if (!approvedBy.trim()) {
            showToast('承認者名を入力してください', 'error');
            return;
        }

        try {
            await approveProduct(data.id, approvedBy);

            showToast('承認しました！', 'success');

            //少し待ってから画面遷移
            setTimeout(() => {
                router.push('/admin/products');
            }, 200);

        } catch {
            showToast('承認に失敗しました', 'error');
        }
    };

    return (
        <div className="min-h-screen bg-gray-100 p-5">
            <Link
                href="/admin/products"
                className="inline-block mb-4 text-xs bg-white border border-gray-300 rounded-md px-4 py-2 hover:bg-gray-50 cursor-pointer"
            >
                一覧に戻る
            </Link>

            <div className="bg-white border border-gray-300 rounded-md mx-auto p-6 max-w-2xl">
                <h1 className="text-xl font-semibold mb-4">商品　詳細</h1>

                <div className="space-y-3 text-sm">
                    <div><strong>ID:</strong> {data.id}</div>
                    <div><strong>カテゴリー:</strong> {data.category?.category_name ?? '-'}</div>
                    <div><strong>出荷予定日:</strong> {data.shipment_date?.shipment_date ?? '-'}</div>
                    <div><strong>販売者:</strong> {data.seller?.seller_name ?? '-'}</div>
                    <div><strong>商品名:</strong> {data.product_name ?? '-'}</div>
                    <div><strong>価格:</strong> {data.product_price ?? '-'}</div>
                    <div><strong>カラー:</strong> {data.color?.color_name ?? '-'}</div>
                    <div><strong>サイズ:</strong> {data.size?.size_name ?? '-'}</div>
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
                    <div><strong>登録日:</strong> {new Date(data.created_at).toLocaleDateString('ja-JP')}</div>
                    <div><strong>更新日:</strong> {new Date(data.updated_at).toLocaleDateString('ja-JP')}</div>
                    <div>
                        <strong>商品画像:</strong>
                        <div className="flex gap-3 mt-2 flex-wrap">
                            {data.images && data.images.length > 0 ? (
                                data.images.map((img) => (
                                <img
                                    key={img.id}
                                    src={img.image_path}
                                    alt={data.product_name}
                                    className="w-32 h-32 object-scale-down rounded"
                                />
                                ))
                            ) : (
                                <img
                                    src="/no-image.png"
                                    className="w-32 h-32 object-scale-down rounded"
                                />
                            )}
                        </div>
                    </div>
                </div>
            </div>
            <div className="mt-8 mx-auto max-w-2xl flex gap-3 justify-center">
                <button
                    onClick={() => router.push(`/admin/products/${data.id}/edit`)}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 mx-4 rounded cursor-pointer"
                >
                    編集
                </button>

                {data.status === 'inactive' && (
                    <button
                        onClick={() => setShowApproveForm(!showApproveForm)}
                        className="bg-green-600 hover:bg-green-700 text-white px-5 py-2 mx-4 rounded cursor-pointer"
                    >
                        承認
                    </button>
                )}

                <button
                    onClick={() => setShowDeleteConfirmDialog(true)}
                    className="bg-red-600 hover:bg-red-700 text-white px-5 py-2 mx-4 rounded cursor-pointer"
                >
                    削除
                </button>
            </div>

            {showApproveForm && (
                <div className="mt-6 mx-auto max-w-2xl bg-white border border-gray-300 rounded p-4">

                    <h2 className="font-semibold mb-3">
                        承認処理
                    </h2>

                    <input
                        type="text"
                        value={approvedBy}
                        onChange={(e) => setApprovedBy(e.target.value)}
                        placeholder="承認者氏名"
                        className="w-full border border-gray-300 rounded px-3 py-2"
                    />

                    <div className="mt-4 flex gap-3">
                        <button
                            onClick={handleApprove}
                            className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded cursor-pointer"
                        >
                            承認実行
                        </button>

                        <button
                            onClick={() => setShowApproveForm(false)}
                            className="bg-gray-400 hover:bg-gray-500 text-white px-4 py-2 rounded cursor-pointer"
                        >
                            キャンセル
                        </button>
                    </div>
                </div>
            )}

            <ConfirmDialog
                open={showDeleteConfirmDialog}
                title="商品削除"
                message="この商品を削除処理しますか？"
                confirmText="削除"
                cancelText="キャンセル"
                onConfirm={handleDelete}
                onCancel={() => setShowDeleteConfirmDialog(false)}
            />
        </div>
    );
}