'use client';
import Header from '../components/Header';
import FooterLogin from "../components/FooterLogin";
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useUser } from '@/lib/UserContext';


export default function MyPage() {
    const { user } = useUser();
    const router = useRouter();

    useEffect(() => {
        if (!user) {
            router.push('/login');
        }
    }, [user, router]);

    if (!user) return null; // リダイレクト中は何も表示しない

    return (
        <>
            <Header />
            <FooterLogin />
        </>
        );
}
