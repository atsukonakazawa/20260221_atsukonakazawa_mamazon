'use client';

import { UserProvider } from '@/lib/context/UserContext';
import { CartProvider } from '@/lib/context/CartContext';
import { SellerProvider } from '@/lib/context/SellerContext';

export default function Providers({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <UserProvider>
            <CartProvider>
                <SellerProvider>
                    {children}
                </SellerProvider>
            </CartProvider>
        </UserProvider>
    );
}