'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, User, ShoppingCart, Menu, Bot } from 'lucide-react';
import { useCart } from '@/lib/context/CartContext';

export default function BottomNav() {
    const pathname = usePathname();
    const [isAccountOpen, setIsAccountOpen] = useState(false);

    const navItem = (
        href: string,
        label: string,
        Icon: any
    ) => {
        const isActive = pathname === href;
        return (
            <Link
                href={href}
                className={`flex flex-col items-center text-xs ${
                isActive ? 'text-yellow-500' : 'text-gray-600'
                }`}
            >
                <Icon size={22} />
                <span>{label}</span>
            </Link>
        );
    };

    //カート
    const { cartItems } = useCart();
    const totalQuantity = cartItems.reduce(
        (sum, item) => sum + item.quantity,
        0
    );

    return (
        <>
            {/* ボトムナビ */}
            <div className="sm:hidden fixed bottom-0 left-0 w-full bg-white border-t flex justify-around py-2 z-50">
                {/* ホームボタン */}
                {navItem('/mypage', 'ホーム', Home)}

                {/* アカウントボタン */}
                {navItem('/account', 'アカウント', User)}

                {/* カートボタン */}
                <Link
                    href="/cart"
                    className="flex flex-col items-center text-xs text-gray-600"
                    >
                    <div className="relative">
                        <ShoppingCart size={22} />

                        {totalQuantity > 0 && (
                        <span className="absolute -top-1 -right-2 bg-red-500 text-white text-[10px] w-4 h-4 flex items-center justify-center rounded-full">
                            {totalQuantity}
                        </span>
                        )}
                    </div>

                    <span>カート</span>
                </Link>

                {/* メニューボタン */}
                {navItem('/menu', 'メニュー', Menu)}

                {/* AIボタン */}
                {navItem('/ai', 'AI', Bot)}
            </div>

        </>
    );
}
