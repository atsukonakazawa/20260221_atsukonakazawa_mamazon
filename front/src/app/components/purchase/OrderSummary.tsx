'use client';

type CartItem = {
    product_id: number;
    price: number;
    quantity: number;
};

type Props = {
    cartItems: CartItem[];
    onOrder: (total: number) => void;
    shipping?: number;
};

export default function OrderSummary({ cartItems, onOrder, shipping = 0 }: Props) {

    // 小計
    const subtotal = cartItems.reduce(
        (sum, item) => sum + item.price * item.quantity,
        0
    );

    // 合計
    const total = subtotal + shipping;

    return (
        <div className="border p-6 rounded space-y-4">
            <button
                onClick={() => onOrder(total)}
                className="mt-3 mb-10 w-full bg-yellow-400 hover:bg-yellow-500 py-3 rounded-full font-bold cursor-pointer"
            >
                注文を確定する
            </button>

            <div className="flex justify-between">
                <span>商品の小計：</span>
                <span>¥{subtotal.toLocaleString()}円</span>
            </div>

            <div className="flex justify-between">
                <span>配送料・手数料：</span>
                <span>¥{shipping.toLocaleString()}円</span>
            </div>

            <hr />

            <div className="flex justify-between text-xl font-bold">
                <span>ご請求額：</span>
                <span>¥{total.toLocaleString()}円</span>
            </div>
        </div>
    );
}