'use client';

import { UserProvider } from '@/lib/context/UserContext';
import { CartProvider } from '@/lib/context/CartContext';
import { SellerProvider } from '@/lib/context/SellerContext';
import { ToastProvider } from '@/lib/context/ToastContext';


export default function Providers({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <ToastProvider>
            <UserProvider>
                <CartProvider>
                    <SellerProvider>
                        {children}
                    </SellerProvider>
                </CartProvider>
            </UserProvider>
        </ToastProvider>
    );
}