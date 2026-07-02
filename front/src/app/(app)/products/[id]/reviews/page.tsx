'use client';

import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useUser } from '@/lib/context/UserContext';
import GuestHeader from '../../../../components/GuestHeader';
import Header from '../../../../components/Header';
import FooterLogin from '../../../../components/FooterLogin';
import StarRatingDisplay from '../../../../components/review/StarRatingDisplay';
import { fetchReviews } from '@/lib/api/reviewApi';

type Review = {
    id: number;
    score: number;
    comment: string;
    user: {
        last_name: string;
        first_name: string;
    };
};

export default function ReviewListPage() {
    const params = useParams();
    const productId = params.id;
    const { user } = useUser();

    const [reviews, setReviews] = useState<Review[]>([]);

    useEffect(() => {
    const loadReviews = async () => {
        try {
            const data = await fetchReviews(Number(productId));
            setReviews(data);
        } catch (error) {
            console.error(error);
        }
    };

    if (productId) {
        loadReviews();
    }
}, [productId]);

    return (
        <>
            {user ? <Header /> : <GuestHeader />}

            <div className="max-w-3xl mx-auto p-6">
                <h1 className="text-2xl font-bold mb-6">
                    レビュー
                </h1>

                {reviews.length === 0 ? (
                    <p>レビューはまだありません</p>
                ) : (
                    <div className="space-y-6">
                        {reviews.map((review) => (
                            <div
                                key={review.id}
                                className="border p-4 rounded"
                            >
                                <p className="mb-5 text-sm text-gray-500 mt-1">
                                    {review.user.last_name + review.user.first_name} さん
                                </p>

                                <StarRatingDisplay
                                    rating={review.score}
                                    showScore={false}
                                />

                                <p className="mt-2">
                                    {review.comment}
                                </p>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            <FooterLogin />
        </>
    );
}