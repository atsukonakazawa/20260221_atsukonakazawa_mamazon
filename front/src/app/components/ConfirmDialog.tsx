'use client';

type ConfirmDialogProps = {
    open: boolean;
    title: string;
    message: string;
    confirmText?: string;
    cancelText?: string;
    onConfirm: () => void;
    onCancel: () => void;
};

export default function ConfirmDialog({
    open,
    title,
    message,
    confirmText = 'OK',
    cancelText = 'キャンセル',
    onConfirm,
    onCancel,
}: ConfirmDialogProps) {
    if (!open) return null;

    return (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-md p-6">

                <h2 className="text-lg font-semibold mb-3">
                    {title}
                </h2>

                <p className="text-gray-700 mb-6">
                    {message}
                </p>

                <div className="flex justify-end gap-3">
                    <button
                        onClick={onCancel}
                        className="px-4 py-2 rounded bg-gray-300 hover:bg-gray-400 cursor-pointer"
                    >
                        {cancelText}
                    </button>

                    <button
                        onClick={onConfirm}
                        className="px-4 py-2 rounded bg-red-600 text-white hover:bg-red-700 cursor-pointer"
                    >
                        {confirmText}
                    </button>
                </div>

            </div>
        </div>
    );
}