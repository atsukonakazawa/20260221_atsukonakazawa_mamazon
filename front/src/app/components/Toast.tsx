'use client';

type ToastProps = {
    message: string;
    type: 'success' | 'error' | 'info';
    isVisible: boolean;
    isClosing: boolean;
};

export default function Toast({
    message,
    type,
    isVisible,
    isClosing,
}: ToastProps) {

    if (!isVisible) return null;

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
                transition-opacity
                duration-500
                flex
                items-center

                ${
                    isClosing
                    ? 'opacity-0'
                    : 'opacity-100'
                }

                ${
                    type === 'success'
                        ? 'bg-green-500'
                        : 'bg-red-600'
                }
            `}
        >
            <span className="mr-2">
                {type === 'success' ? '✓' : '✕'}
            </span>

            {message}
        </div>
    );
}