'use client';

import Header from '../../components/Header';
import FooterLogin from "../../components/FooterLogin";
import { useCart } from '@/lib/context/CartContext';
import { useRouter } from 'next/navigation';

export default function CartPage() {
    const { cartItems, increaseQuantity, decreaseQuantity } = useCart();

    // 🔽 小計計算
    const subtotal = cartItems.reduce((sum, item) => {
        return sum + item.price * item.quantity;
    }, 0);

    const totalQuantity = cartItems.reduce((sum, item) => {
        return sum + item.quantity;
    }, 0);

    const router = useRouter();

    return (
        <>
            <Header />

                <div className="p-6">
                <h1 className="text-2xl font-bold mb-4">カート</h1>

                    {cartItems.length === 0 ? (
                        <p>カートに商品がありません</p>
                    ) : (
                        <div className="flex flex-col md:flex-row gap-6">

                            {/* 🛒 商品リスト（左） */}
                            <div className="flex-1 space-y-4 order-2 md:order-1">
                            {cartItems.map((item) => (
                                <div
                                    key={item.id}
                                    className="flex items-center gap-4 border p-4 rounded"
                                >
                                    {/* 画像 */}
                                    <img
                                        src={`http://localhost/storage/${item.image}`}
                                        className="w-20 h-20 object-contain"
                                    />

                                    {/* 商品情報 */}
                                    <div className="flex-1">
                                        <p className="font-bold">{item.name}</p>
                                        <p>¥{item.price.toLocaleString()}</p>
                                    </div>

                                    {/* 数量操作 */}
                                    <div className="flex items-center border-2 border-yellow-400 rounded-full">
                                        <button
                                            onClick={() => decreaseQuantity(item.id)}
                                            className="cursor-pointer px-3 py-1"
                                        >
                                            −
                                        </button>

                                        <span className="px-3">
                                            {item.quantity}
                                        </span>

                                        <button
                                            onClick={() => increaseQuantity(item.id)}
                                            className="cursor-pointer px-3 py-1"
                                        >
                                            ＋
                                        </button>
                                    </div>
                                </div>
                            ))}
                    </div>

                    {/* 💰 小計エリア（右 / 上） */}
                        <div className="md:w-1/3 border p-4 rounded h-fit order-1 md:order-2">

                            {/* モバイル用タイトル */}
                            <p className="text-lg  md:hidden">
                                小計 ¥{subtotal.toLocaleString()}
                            </p>

                            {/* PC用タイトル */}
                            <p className="hidden md:block text-lg mb-2">
                                小計（{totalQuantity}個の商品）（税込）
                            </p>

                            {/* PCのみ金額表示 */}
                            <p className="hidden md:block text-2xl font-bold mb-4">
                                ¥{subtotal.toLocaleString()}
                            </p>

                            <button
                                onClick={() => router.push('/checkout')}className="cursor-pointer  w-full bg-yellow-400 hover:bg-yellow-400 py-2 rounded-full">
                                レジに進む（{totalQuantity}個）（税込）
                            </button>
                        </div>
                    </div>
                )}
            </div>

            <FooterLogin />
        </>
    );
}