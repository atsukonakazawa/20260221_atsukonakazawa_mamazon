'use client';

import Header from '../../../components/Header';
import FooterLogin from "../../../components/FooterLogin";
import { useUser } from '@/lib/context/UserContext';
import useSWR from 'swr';
import { fetchOrders } from '@/lib/api/orderApi';
import Link from 'next/link';

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
            order_id: order.id,
            orderDate: order.created_at,
            totalPrice: order.total_price,
            shipping_name: order.shipping_name,
            shipping_postcode: order.shipping_postcode,
            shipping_address: order.shipping_address,
            shipment_status: order.shipment_status?.shipment_status || "準備中",
            payment_status: order.payment_status?.payment_status || "支払確認中",
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
                            <div key={item.id} className="border rounded-lg">

                                {/* 上段 */}
                                <div className="flex justify-between rounded-t-lg bg-[rgb(239,242,242)]">
                                    {/* 上段・左 */}
                                    <div className="flex justify-start">

                                        {/* 注文日 */}
                                        <div className="px-6 py-2 mb-2">
                                            <span className="text-xs">
                                                注文日
                                            </span>
                                            <p className="text-lg font-light">
                                                {new Date(item.orderDate).toLocaleDateString()}
                                            </p>
                                        </div>

                                        {/* 価格 */}
                                        <div className="px-6 py-2 mb-2">
                                            <span className="text-xs">
                                                合計
                                            </span>
                                            <p className="text-lg font-light">
                                                ¥{item.price.toLocaleString()}
                                            </p>
                                        </div>

                                        {/* お届け先 */}
                                        <div className="px-6 py-2 mb-2">
                                            <span className="text-xs">
                                                お届け先
                                            </span>
                                            <div className="relative group w-fit">
                                                {/* 表示される名前 */}
                                                <p className="text-lg font-light cursor-pointer underline">
                                                    {item.shipping_name}
                                                </p>
                                                {/* ホバー時に表示される住所 */}
                                                <div className="
                                                    absolute left-0 mt-1 hidden group-hover:block
                                                    text-sm rounded p-3
                                                    shadow-lg bg-white  border border-gray-300 whitespace-nowrap z-10">
                                                    〒{item.shipping_postcode}<br />
                                                    {item.shipping_address}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                     {/* 上段・右 */}
                                    <div className="flex justify-end">
                                        {/* 注文番号 */}
                                        <div className="px-6 py-2 mb-2">
                                            <span className="text-xs">
                                                注文番号
                                            </span>
                                            <p className="text-lg font-light">
                                                {item.order_id}
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                {/* 下段 */}
                                <div className="p-2 flex items-center justify-between">
                                    {/* 下段・左側 */}
                                    <div className="p-2 items-center gap-4 max-w-sm">
                                        {/* 下段・左側・ステータス */}
                                        <div className="p-2 flex items-center justify-start gap-4 max-w-sm">
                                            {/* 支払状況 */}
                                            <p className="text-xl font-bold">
                                                {item.payment_status}
                                            </p>
                                            {/* 配送状況 */}
                                            <p className="text-xl font-bold">
                                                {item.shipment_status}
                                            </p>
                                        </div>

                                        <div className="p-2 flex items-center justify-start gap-4 max-w-sm">

                                            {/* 商品画像 */}
                                            <Link href={`/products/${item.product?.id}`}>
                                                <img
                                                    src={`http://localhost/storage/${item.product.images[0]?.image_path}`}
                                                    className="w-25 h-25 object-contain cursor-pointer"
                                                    alt={item.product?.product_name}
                                                />
                                            </Link>

                                            {/* 商品名 */}
                                            <Link
                                                href={`/products/${item.product?.id}`}
                                                className="font-medium truncate text-blue-600 hover:underline"
                                            >
                                                {item.product?.product_name || "商品名なし"}
                                            </Link>
                                        </div>
                                    </div>

                                    {/* 下段・右 */}
                                    <div className="py-4 items-center w-[200px]">
                                        <button
                                            className="cursor-pointer  my-1 p-1 text-sm w-full rounded-full border border-black-100"
                                        >
                                            テスト
                                        </button>
                                        <button
                                            className="cursor-pointer my-1 p-1 text-sm w-full rounded-full border border-black-100"
                                        >
                                            お支払い番号の確認
                                        </button>
                                        <button
                                            className="cursor-pointer my-1 p-1 text-sm w-full rounded-full border border-black-100"
                                        >
                                            商品レビューを書く
                                        </button>
                                    </div>
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