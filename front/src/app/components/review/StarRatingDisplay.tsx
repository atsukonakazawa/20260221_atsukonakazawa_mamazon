'use client';

import React from 'react';

type StarRatingDisplayProps = {
    rating: number;       // 平均評価（例：3.5）
    maxStars?: number;    // 星の最大数（デフォルト5）
    size?: number;        // 星のサイズ（px）
    showScore?: boolean;  // 数値を表示するか
};

export default function StarRatingDisplay({
    rating,
    maxStars = 5,
    size = 16,
    showScore = true,
}: StarRatingDisplayProps) {
    // ratingを0〜maxStarsの範囲に制限
    const safeRating = Math.max(0, Math.min(rating || 0, maxStars));

    const stars = Array.from({ length: maxStars }, (_, index) => {
        const starNumber = index + 1;
        let fillPercentage = 0;

        if (safeRating >= starNumber) {
            fillPercentage = 100;
        } else if (safeRating >= starNumber - 0.5) {
            fillPercentage = 50;
        }

        return (
            <div
                key={index}
                style={{
                    position: 'relative',
                    width: size,
                    height: size,
                    fontSize: `${size}px`,
                    lineHeight: `${size}px`,
                }}
            >
                {/* 背景の星（グレー） */}
                <span style={{ color: '#D1D5DB' }}>★</span>

                {/* 塗りつぶしの星（黄色） */}
                <span
                    style={{
                        color: '#FDC800',
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        width: `${fillPercentage}%`,
                        overflow: 'hidden',
                        whiteSpace: 'nowrap',
                    }}
                >
                    ★
                </span>
            </div>
        );
    });

    return (
        <div className="flex items-center gap-1">
            <div className="flex">{stars}</div>
            {showScore && (
                <span className="ml-1 text-xs text-gray-600">
                    {safeRating.toFixed(1)}
                </span>
            )}
        </div>
    );
}