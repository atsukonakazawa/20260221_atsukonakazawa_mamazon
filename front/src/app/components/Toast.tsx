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
                transition-opacity transform
                duration-500
                flex
                items-center

                ${
                    visible
                        ? 'opacity-100 translate-y-0'
                        : 'opacity-0 -translate-y-2 pointer-events-none'
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