'use client';

import {
    createContext,
    useContext,
    useState,
    ReactNode,
} from 'react';

type Seller = {
    id: number;
    seller_name: string;
} | null;

type SellerContextType = {
    seller: Seller;
    setSeller: React.Dispatch<
        React.SetStateAction<Seller>
    >;
};

const SellerContext = createContext<SellerContextType>({
    seller: null,
    setSeller: () => {},
});

export const SellerProvider = ({
    children,
}: {
    children: ReactNode;
}) => {

    const [seller, setSeller] =
        useState<Seller>(null);

    return (
        <SellerContext.Provider
            value={{ seller, setSeller }}
        >
            {children}
        </SellerContext.Provider>
    );
};

export const useSeller = () =>
    useContext(SellerContext);