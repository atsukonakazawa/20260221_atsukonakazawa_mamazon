'use client';

import { useState } from 'react';

type StarRatingProps = {
    score: number;
    setScore: (score: number) => void;
    maxStars?: number;
    size?: number; // Tailwindの文字サイズ（px）
};

export default function StarRating({
    score,
    setScore,
    maxStars = 5,
    size = 32,
}: StarRatingProps) {
    // ホバー時の表示用
    const [hovered, setHovered] = useState<number | null>(null);

    return (
        <div className="flex items-center gap-1">
            {[...Array(maxStars)].map((_, index) => {
                const starValue = index + 1;
                const isActive =
                    hovered !== null
                        ? starValue <= hovered
                        : starValue <= score;

                return (
                    <button
                        key={starValue}
                        type="button"
                        onClick={() => setScore(starValue)}
                        onMouseEnter={() => setHovered(starValue)}
                        onMouseLeave={() => setHovered(null)}
                        aria-label={`${starValue}星`}
                        className="focus:outline-none transition-transform transform hover:scale-110"
                    >
                        <span
                            style={{ fontSize: `${size}px` }}
                            className={
                                isActive
                                    ? 'text-yellow-400'
                                    : 'text-gray-300'
                            }
                        >
                            ★
                        </span>
                    </button>
                );
            })}

            {/* 選択された評価の表示 */}
            <span className="ml-2 text-sm text-gray-600">
                {score} / {maxStars}
            </span>
        </div>
    );
}