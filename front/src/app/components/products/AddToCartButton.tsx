'use client';

import { useCart } from '@/lib/context/CartContext';
import { useUser } from '@/lib/context/UserContext';

export default function AddToCartButton({ product }: any) {
    const { addToCart, cartItems, increaseQuantity, decreaseQuantity } = useCart();
    const { user } = useUser();

    // 👇 カート内の該当商品を取得
    const item = cartItems.find(i => i.product_id === product.id);

    // 👇 すでにカートにある場合（＋−表示）
    if (item) {
        return (
        <div className="flex items-center justify-between mt-4 border-2 border-yellow-400 rounded-full">
            <button
                    onClick={() => decreaseQuantity(item.id)}
            className="px-4 py-2 rounded-l-full"
            >
            −
            </button>

            <span className="px-4">{item.quantity}</span>

            <button
            onClick={() => increaseQuantity(item.id)}
            className="px-4 py-2 rounded-r-full"
            >
            ＋
            </button>
        </div>
        );
    }

    // 👇 未追加の場合（通常ボタン）
    return (
        <button
        onClick={async () => {
            if (!user) return;
            await addToCart(product.id);
        }}
        className="w-full bg-yellow-400 py-3 rounded-full mt-4 hover:bg-yellow-500"
        >
        カートに入れる
        </button>
    );
}