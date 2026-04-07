'use client';

import Header from '../../../components/Header';
import FooterLogin from "../../../components/FooterLogin";
import { useUser } from '@/lib/context/UserContext';
import useSWR from 'swr';
import { fetchOrders } from '@/lib/api/orderApi';

export default function OrdersPage() {
    const { user } = useUser();

    const { data: orders, isLoading } = useSWR(
        user ? ['orders', user.id] : null,
        () => fetchOrders(user!.id)
    );

    if (!user) return null;
    if (isLoading) return <p>Loading...</p>;

    const orderItems = orders?.flatMap((order: any) =>
        order.items.map((item: any) => ({
            ...item,
            orderDate: order.created_at,
            totalPrice: order.total_price,
        }))
    );

    return (
        <>
            <Header />

            <div className="p-6 max-w-3xl mx-auto">
                <h1 className="text-2xl font-bold mb-6">注文履歴</h1>

                {orders.length === 0 ? (
                    <p>注文履歴がありません</p>
                ) : (
                    <div className="space-y-6">
                        {orderItems.map((item: any) => (
                            <div key={item.id} className="border p-4 rounded">

                                {/* 注文日 */}
                                <div className="mb-2 text-sm text-gray-500">
                                    <p>注文日：{new Date(item.orderDate).toLocaleDateString()}</p>
                                </div>

                                {/* 商品 */}
                                <div className="flex items-center justify-between">

                                    {/* 左側：画像＋商品名 */}
                                    <div className="flex items-center gap-4">

                                        {/* 商品画像 */}
                                        <img
                                            src={`http://localhost/storage/${item.product.images[0]?.image_path}`}
                                            className="w-16 h-16 object-contain"
                                        />

                                        {/* 商品名 */}
                                        <span className="font-medium">
                                            {item.product?.product_name || "商品名なし"}
                                        </span>

                                    </div>

                                    {/* 右側：価格 */}
                                    <span className="font-bold">
                                        ¥{item.price.toLocaleString()}
                                    </span>

                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            <FooterLogin />
        </>
    );
}