'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, User, ShoppingCart, Menu, Bot } from 'lucide-react';

export default function BottomNav() {
    const pathname = usePathname();

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

    return (
        <div className="sm:hidden fixed bottom-0 left-0 w-full bg-white border-t flex justify-around py-2 z-50">
        {navItem('/mypage', 'ホーム', Home)}
        {navItem('/account', 'アカウント', User)}
        {navItem('/cart', 'カート', ShoppingCart)}
        {navItem('/menu', 'メニュー', Menu)}
        {navItem('/ai', 'AI', Bot)}
        </div>
    );
}
