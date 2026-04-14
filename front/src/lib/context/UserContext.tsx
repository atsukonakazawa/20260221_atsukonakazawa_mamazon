'use client';
import { createContext, useContext, useState, ReactNode } from 'react';

// ① ユーザーの型
type User = {
    id: number;
    last_name: string;
    first_name: string
    postcode: string;
    address: string;
} | null;

// ② Contextを作る
const UserContext = createContext<{
    user: User;
    setUser: (user: User) => void;
}>({
    user: null,
    setUser: () => {},
});

// ③ Provider（アプリ全体を包む）
export const UserProvider = ({ children }: { children: ReactNode }) => {
    const [user, setUser] = useState<User>(null);

    return (
    <UserContext.Provider value={{ user, setUser }}>
        {children}
    </UserContext.Provider>
    );
};

// ④ 使いやすくするためのHook
export const useUser = () => useContext(UserContext);
