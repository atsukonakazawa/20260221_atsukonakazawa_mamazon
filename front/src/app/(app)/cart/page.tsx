'use client';

import Header from '../../components/Header';
import FooterLogin from "../../components/FooterLogin";
import { useCart } from '@/lib/context/CartContext';

export default function CartPage() {
    const { cartItems, increaseQuantity, decreaseQuantity } = useCart();

    return (
        <>
            <Header />

                <div className="p-6">
                <h1 className="text-2xl font-bold mb-4">カート</h1>

                    {cartItems.length === 0 ? (
                        <p>カートに商品がありません</p>
                    ) : (
                    <div className="space-y-4">
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
                                        className="px-3 py-1"
                                    >
                                        −
                                    </button>

                                    <span className="px-3">
                                        {item.quantity}
                                    </span>

                                    <button
                                        onClick={() => increaseQuantity(item.id)}
                                        className="px-3 py-1"
                                    >
                                        ＋
                                    </button>
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