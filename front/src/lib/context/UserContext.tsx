'use client';
import { createContext, useContext, useState, ReactNode } from 'react';

// ① ユーザーの型
type User = {
    id: number;
    last_name: string;
    first_name: string
    postcode: string;
    address: string;
    tel?: string;
    placement: boolean;
    place_of_placement?: string;
    email: string;
} | null;

// ② Contextの型を定義
type UserContextType = {
    user: User;
    setUser: React.Dispatch<React.SetStateAction<User>>;
    logout: () => void;
};

//③ Contextを作る
const UserContext = createContext<UserContextType>({
    user: null,
    setUser: () => { },
    logout: () => {},
});

// ④ Provider（アプリ全体を包む）
export const UserProvider = ({ children }: { children: ReactNode }) => {
    const [user, setUser] = useState<User>(null);

    //logout
    const logout = () => {
        localStorage.removeItem('token'); // トークン削除（あれば）
        setUser(null);
    };

    return (
    <UserContext.Provider value={{ user, setUser, logout }}>
        {children}
    </UserContext.Provider>
    );
};

// ⑤ 使いやすくするためのHook
export const useUser = () => useContext(UserContext);
