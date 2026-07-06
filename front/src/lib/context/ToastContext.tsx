'use client';

import {
    createContext,
    useContext,
    useState,
    useRef,
    useEffect,
    ReactNode,
} from 'react';
import Toast from '@/app/components/Toast';

type ToastType = 'success' | 'error';

type ToastContextType = {
    showToast: (message: string, type: ToastType) => void;
};

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export function ToastProvider({ children }: { children: ReactNode }) {
    const [message, setMessage] = useState('');
    const [type, setType] = useState<ToastType>('success');
    const [isVisible, setIsVisible] = useState(false);
    const [isClosing, setIsClosing] = useState(false);

    const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
    useEffect(() => {
        return () => {
            if (timerRef.current) {
                clearTimeout(timerRef.current);
            }
        };
    }, []);

    const showToast = (message: string, type: ToastType) => {
        setMessage(message);
        setType(type);
        setIsClosing(false);
        setIsVisible(true);

        if (timerRef.current) {
            clearTimeout(timerRef.current);
        }

        timerRef.current = setTimeout(() => {
            setIsClosing(true);

            timerRef.current = setTimeout(() => {
                setIsVisible(false);
            }, 1000);
        }, 2000);
    };

    return (
        <ToastContext.Provider value={{ showToast }}>
            {children}

            <Toast
                message={message}
                type={type}
                isVisible={isVisible}
                isClosing={isClosing}
            />
        </ToastContext.Provider>
    );
}

export function useToast() {
    const context = useContext(ToastContext);

    if (!context) {
        throw new Error('useToast must be used within ToastProvider');
    }

    return context;
}