'use client';

type ToastProps = {
    message: string;
    type: 'success' | 'error';
    visible: boolean;
};

export default function Toast({
    message,
    type,
    visible,
}: ToastProps) {
    if (!visible) return null;

    return (
        <div
            className={`
                fixed
                top-5
                right-5
                z-50
                px-5
                py-3
                rounded-md
                shadow-lg
                text-white
                font-medium
                transition-all
                duration-300
                ${
                    type === 'success'
                        ? 'bg-green-600'
                        : 'bg-red-600'
                }
            `}
        >
            {message}
        </div>
    );
}