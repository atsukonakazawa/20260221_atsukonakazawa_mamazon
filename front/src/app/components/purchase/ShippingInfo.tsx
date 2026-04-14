'use client';

import { useState, useEffect } from 'react';

type Props = {
    initialPostcode?: string;
    initialAddress?: string;
    initialShippingName?: string;
    initialSender?: string;
    onChange: (data: {
        shipping_postcode: string;
        shipping_address: string;
        shipping_name: string;
        sender: string;
    }) => void;
};

//postcodeにハイフンを入れる
const formatPostcode = (value: string) => {
    // 数字以外を削除
    const digits = value.replace(/\D/g, '');
    // 7桁までに制限
    const trimmed = digits.slice(0, 7);
    // 3桁-4桁の形式に整形
    if (trimmed.length > 3) {
        return `${trimmed.slice(0, 3)}-${trimmed.slice(3)}`;
    }
    return trimmed;
};

export default function ShippingInfo({
    initialPostcode = '',
    initialAddress = '',
    initialShippingName = '',
    initialSender = '',
    onChange,
}: Props) {
    const [postcode, setPostcode] = useState(
        formatPostcode(initialPostcode)
    );
    const [address, setAddress] = useState(initialAddress);
    const [shippingName, setShippingName] = useState(initialShippingName);
    const [sender, setSender] = useState(initialSender);

    // 入力内容を親コンポーネントへ通知
    useEffect(() => {
        onChange({
            shipping_postcode: postcode,
            shipping_address: address,
            shipping_name: shippingName,
            sender: sender,
        });
    }, [postcode, address, shippingName, sender, onChange]);

    return (
        <div className="border p-6 rounded space-y-4 mt-6">
            <h2 className="text-lg font-bold">お届け先・送り主</h2>

            <div>
                <label className="block text-sm font-medium">郵便番号</label>
                <input
                    type="text"
                    value={postcode}
                    onChange={(e) => setPostcode(formatPostcode(e.target.value))}
                    className="w-full border rounded px-3 py-2"
                    placeholder="例：123-4567"
                    maxLength={8}
                />
            </div>

            <div>
                <label className="block text-sm font-medium">住所</label>
                <input
                    type="text"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    className="w-full border rounded px-3 py-2"
                    placeholder="東京都千代田区〇〇"
                />
            </div>

            <div>
                <label className="block text-sm font-medium">お届け先氏名</label>
                <input
                    type="text"
                    value={shippingName}
                    onChange={(e) => setShippingName(e.target.value)}
                    className="w-full border rounded px-3 py-2"
                    placeholder="山田 太郎"
                />
            </div>

            <div>
                <label className="block text-sm font-medium">送り主</label>
                <input
                    type="text"
                    value={sender}
                    onChange={(e) => setSender(e.target.value)}
                    className="w-full border rounded px-3 py-2"
                    placeholder="山田 太郎"
                />
            </div>
        </div>
    );
}