'use client';

import Header from '../../../components/Header';
import FooterLogin from "../../../components/FooterLogin";
import { useUser } from '@/lib/context/UserContext';
import useSWR from 'swr';
import { fetchOrders } from '@/lib/api/orderApi';
import Link from 'next/link';
import { useState, useRef } from 'react';


export default function OrdersPage() {
    const { user } = useUser();

    //支払い番号表示用のuseStateを追加
    const [paymentMessage, setPaymentMessage] = useState<string | null>(null);
    //支払い番号表示時に画面上部に自動スクロール
    const messageRef = useRef<HTMLDivElement | null>(null);

    const { data: orders, isLoading } = useSWR(
        user ? 'orders' : null,
        fetchOrders
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
            payment_method: order.payment_way?.payment_way,
            payment_number: order.payment_number,
            confirmation_number: order.confirmation_number,
            payment_limit:order.payment_limit,
        }))
    );

    //支払い番号表示ボタン押下時の処理
    const handlePaymentInfo = (item: any) => {
        if (item.payment_method === 'コンビニ払い') {
            setPaymentMessage(
                `注文番号：${item.order_id}
                お支払い番号：${item.payment_number}
                確認番号：${item.confirmation_number}
                お支払い期限：${new Date(item.payment_limit).toLocaleString('ja-JP', {
                    dateStyle: 'short',
                    timeStyle: 'short',
                    hour12: false,
                })
                }`
            );
        } else {
            setPaymentMessage(
                `すでに${item.payment_method}で支払い済みです。`
            );
        }
        // 描画後にスクロール
        setTimeout(() => {
            messageRef.current?.scrollIntoView({
                behavior: 'smooth',
                block: 'center',
            });
        }, 100);

    };

    return (
        <>
            <Header />

            <div className="p-6 max-w-3xl mx-auto">
                <h1 className="text-2xl font-bold mb-6">注文履歴</h1>

                {paymentMessage && (
                    <div
                        ref={messageRef}
                        className="mb-4 p-4 bg-yellow-100 border border-yellow-400 rounded whitespace-pre-line">
                        {paymentMessage}
                    </div>
                )}

                {orders.length === 0 ? (
                    <p>注文履歴がありません</p>
                ) : (
                    <div className="space-y-6">
                        {orderItems.map((item: any) => (
                            <div key={item.id} className="border rounded-lg">

                                {/* 上段 */}
                                <div className="flex flex-col md:flex-row md:justify-between rounded-t-lg bg-[rgb(239,242,242)]">
                                    {/* 上段・左 */}
                                    <div className="flex flex-col sm:flex-row">

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
                                                <div className="hidden md:block">
                                                    <div className="
                                                        absolute left-0 mt-1 hidden group-hover:block
                                                        text-sm rounded p-3
                                                        shadow-lg bg-white  border border-gray-300 whitespace-nowrap z-10">
                                                        〒{item.shipping_postcode}<br />
                                                        {item.shipping_address}
                                                    </div>
                                                </div>
                                                <div className="block md:hidden text-sm">
                                                    <p>〒{item.shipping_postcode}</p>
                                                    <p>{item.shipping_address}</p>
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
                                <div className="p-2 flex flex-col md:flex-row md:items-center md:justify-between gap-4">

                                    {/* 下段・左側 */}
                                    <div className="p-2 items-center gap-4 max-w-sm">

                                        {/* ステータス */}
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
                                                    src={item.product?.images?.[0]?.image_path || "/no-image.png"}
                                                    className="w-24 h-24 object-contain"
                                                    alt={item.product?.product_name}
                                                />
                                            </Link>

                                            {/* 商品名 */}
                                            <Link
                                                href={`/products/${item.product?.id}`}
                                                className="font-medium text-sm md:text-base break-words text-blue-600 hover:underline"
                                            >
                                                {item.product?.product_name || "商品名なし"}
                                            </Link>
                                        </div>
                                    </div>

                                    {/* 下段・右 */}
                                    <div className="py-4 w-full md:w-[200px]">

                                        {/* お支払い番号 */}
                                        <button
                                            onClick={() => handlePaymentInfo(item)}
                                            className="cursor-pointer my-1 p-1 text-sm w-full rounded-full border border-black-100 hover:bg-gray-100"
                                        >
                                            お支払い番号の確認
                                        </button>

                                        {/* 商品レビュー */}
                                        <Link href={`/reviews/create/${item.product?.id}`}>
                                            <button
                                                disabled={item.shipment_status !== "お届け済み"}
                                                className={`my-1 p-1 text-sm w-full rounded-full border
                                                ${
                                                    item.shipment_status === "お届け済み"
                                                        ? "cursor-pointer border-black-100 hover:bg-gray-100"
                                                        : "bg-gray-200 text-gray-500 cursor-not-allowed"
                                                }`}
                                            >
                                                商品レビューを書く
                                            </button>
                                        </Link>
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