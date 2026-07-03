'use client';

import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import { Product } from "@/types/Product";
import { useCart } from '@/lib/context/CartContext';
import { useUser } from '@/lib/context/UserContext';
import StarRatingDisplay from '../../components/review/StarRatingDisplay';
import { useRouter } from "next/navigation";

type Props = {
    product: Product;
};

export default function ProductCard({ product }: Props) {
    const { addToCart, cartItems, increaseQuantity, decreaseQuantity } = useCart();

    // routerを取得
    const router = useRouter();
    // userを取得
    const { user } = useUser();

    const cartItem = cartItems.find((item) => item.product_id === product.id);

    return (
        <div className="cursor-pointer hover:shadow-lg transition p-3 border rounded">

            {/* 商品画像 */}
            <Swiper
                modules={[Pagination]}
                slidesPerView={1}
                pagination={{ clickable: true }}
                className="w-full"
            >
                {product.images && product.images.length > 0 ? (
                    product.images.map((img) => (
                        <SwiperSlide key={img.id}>
                            <img
                                src={img.image_path}
                                className="h-48 object-contain mx-auto"
                                alt={product.product_name}
                            />
                        </SwiperSlide>
                    ))
                ) : (
                    <SwiperSlide>
                        <img
                            src="/no-image.png"
                            className="h-48 object-contain mx-auto"
                            alt="No image"
                        />
                    </SwiperSlide>
                )}
            </Swiper>

            {/* 商品情報 */}
            <p className="font-bold truncate mt-2">
                {product.product_name}
            </p>

            <div className="my-1 flex">
                <StarRatingDisplay
                    rating={product.reviews_avg_score ?? 0}
                />
                <span className="text-xs text-blue-400 pl-3">
                    ({product.reviews_count ?? 0}件)
                </span>
            </div>

            <p className="text-2xl">
                ¥{product.product_price.toLocaleString()}
            </p>

            {/* 👇 ログイン前かログイン後か */}
            {!user ? (

                // ログイン前の場合
                <button
                    onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();

                        router.push("/auth");
                    }}
                    className="cursor-pointer mt-3 w-full bg-yellow-400 py-2 rounded-full hover:bg-yellow-500 text-sm"
                >
                    ログインしてカートに入れる
                </button>
            ) : (

                // ログイン後の場合
                !cartItem ? (

                    // カートに未追加の場合
                    <button
                        onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();

                            addToCart(product.id);
                        }}
                        className="cursor-pointer mt-3 w-full bg-yellow-400 py-2 rounded-full hover:bg-yellow-500"
                    >
                        カートに入れる
                    </button>
                ) : (
                    // カートに追加済みの場合
                    <div
                        onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                        }}
                        className="cursor-pointer mt-3 flex items-center justify-between border-2 border-yellow-400 rounded-full px-2 py-2"
                    >
                        <button
                            onClick={() => decreaseQuantity(cartItem.id)}
                            className="cursor-pointer px-3 py-1 rounded-lg"
                        >
                            −
                        </button>

                        <span className="font-bold">{cartItem.quantity}</span>

                        <button
                            onClick={() => increaseQuantity(cartItem.id)}
                            className="cursor-pointer px-3 py-1 rounded-lg"
                        >
                            ＋
                        </button>
                    </div>
                )
            )}
        </div>
    );
}