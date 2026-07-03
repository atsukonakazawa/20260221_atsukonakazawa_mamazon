'use client';

import { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { fetchCart, addCart, updateCart, clearCartApi } from '@/lib/api/cartApi';
import { useUser } from '@/lib/context/UserContext';


type CartItem = {
    id: number; // 👈 cart.id
    product_id: number;
    name: string;
    price: number;
    image?: string;
    quantity: number;
};

type CartContextType = {
    cartItems: CartItem[];
    addToCart: (productId: number) => Promise<void>;
    increaseQuantity: (cartId: number) => Promise<void>;
    decreaseQuantity: (cartId: number) => Promise<void>;
    clearCart: () => Promise<void>;
};

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
    const { user } = useUser();
    const [cartItems, setCartItems] = useState<CartItem[]>([]);

    // 初回ロード時にカート取得
    useEffect(() => {
        if (user?.id) {
            loadCart();
        }
    }, [user?.id]);

    const loadCart = async () => {
        if (!user) return;
        const data = await fetchCart();

        // Laravelのレスポンスに合わせて整形
        const formatted = data.map((item: any) => ({
            id: item.id,
            product_id: item.product_id,
            name: item.product?.product_name,
            price: item.product?.product_price,
            image: item.product?.images?.[0]?.image_path,
            quantity: item.quantity,
        }));

        setCartItems(formatted);
    };

    // カート追加
    const addToCart = async (productId: number) => {
        if (!user) return;
        await addCart(productId);
        await loadCart(); // 👈 再取得
    };

    // ＋
    const increaseQuantity = async (cartId: number) => {
        if (!user) return;
        await updateCart(cartId, 'increase');
        await loadCart();
    };

    // −
    const decreaseQuantity = async (cartId: number) => {
        if (!user) return;
        await updateCart(cartId, 'decrease');
        await loadCart();
    };

    //カートを空にする
    const clearCart = async () => {
        if (!user) return;
        await clearCartApi();
        setCartItems([]); // ← これ重要（画面更新）
    };

    return (
        <CartContext.Provider
            value={{
                cartItems,
                addToCart,
                increaseQuantity,
                decreaseQuantity,
                clearCart,
            }}
        >
            {children}
        </CartContext.Provider>
    );
}

export function useCart() {
    const context = useContext(CartContext);

    if (!context) {
        throw new Error('useCart must be used within CartProvider');
    }

    return context;
}

