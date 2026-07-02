'use client';

import { useUser } from "@/lib/context/UserContext";
import Header from "./Header";
import GuestHeader from "./GuestHeader";

export default function AppHeader() {
    const { user } = useUser();

    return user ? <Header /> : <GuestHeader />;
}