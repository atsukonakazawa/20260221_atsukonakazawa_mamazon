'use client';

import useSWR from 'swr';
import { useParams } from 'next/navigation';
import Link from 'next/link';

import {
    fetchOrderDetail,
    OrderDetail
} from '@/lib/api/adminOrderApi';

export default function AdminOrderDetailPage() {
    const params = useParams();

    const {
        data: order,
        isLoading,
        error,
    } = useSWR<OrderDetail>(
        `/admin/orders/${params.id}`,
        () => fetchOrderDetail(Number(params.id))
    );

    if (isLoading) {
        return <div className="p-5">読み込み中...</div>;
    }

    if (error || !order) {
        return (
            <div className="p-5 text-red-500">
                注文情報を取得できませんでした
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-100 p-5">
            <Link
                href="/admin/orders"
                className="inline-block mb-4 text-xs bg-white border border-gray-300 rounded-md px-4 py-2 hover:bg-gray-50 cursor-pointer"
            >
                一覧に戻る
            </Link>

            <h1 className="text-2xl font-semibold mt-4 mb-6">
                注文詳細
            </h1>

            <div className="bg-white border rounded-lg p-5 mb-6">
                <p>注文番号：{order.id}</p>
                <p>注文日時：{order.created_at}</p>
                <p>購入者：{order.user_name}</p>

                <p>支払方法：{order.payment_way}</p>
                <p>支払状況：{order.payment_status}</p>
                <p>配送状況：{order.shipment_status}</p>
            </div>

            <div className="bg-white border rounded-lg p-5 mb-6">
                <h2 className="font-semibold mb-3">
                    配送先
                </h2>

                <p>〒{order.shipping_postcode}</p>
                <p>{order.shipping_address}</p>
                <p>{order.shipping_name}</p>
                <p>送り主：{order.sender}</p>
            </div>

            <div className="bg-white border rounded-lg overflow-hidden">
                <table className="w-full text-sm">
                    <thead className="bg-gray-100">
                        <tr>
                            <th className="px-4 py-3 text-left">
                                商品名
                            </th>
                            <th className="px-4 py-3 text-right">
                                単価
                            </th>
                            <th className="px-4 py-3 text-center">
                                数量
                            </th>
                            <th className="px-4 py-3 text-right">
                                小計
                            </th>
                        </tr>
                    </thead>

                    <tbody>
                        {order.items.map((item, index) => (
                            <tr
                                key={index}
                                className="border-t"
                            >
                                <td className="px-4 py-3">
                                    {item.product_name}
                                </td>

                                <td className="px-4 py-3 text-right">
                                    ¥{item.price.toLocaleString()}
                                </td>

                                <td className="px-4 py-3 text-center">
                                    {item.quantity}
                                </td>

                                <td className="px-4 py-3 text-right">
                                    ¥{item.subtotal.toLocaleString()}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <div className="mt-5 text-right text-xl font-semibold">
                合計：
                ¥{order.total_price.toLocaleString()}
            </div>
        </div>
    );
}