'use client';

import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import { Product } from "@/types/Product";
import { useCart } from '@/lib/context/CartContext';

type Props = {
    product: Product;
};

export default function ProductCard({ product }: Props) {
    const { addToCart, cartItems, increaseQuantity, decreaseQuantity } = useCart();

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
                {product.images?.map((img) => (
                    <SwiperSlide key={img.id}>
                        <img
                            src={`http://localhost/storage/${img.image_path}`}
                            className="h-48 object-contain mx-auto"
                        />
                    </SwiperSlide>
                ))}
            </Swiper>

            {/* 商品情報 */}
            <p className="font-bold truncate mt-2">
                {product.product_name}
            </p>

            <p className="text-2xl">
                ¥{product.product_price.toLocaleString()}
            </p>

            {/* 👇 分岐UI */}
            {!cartItem ? (
                // 未追加
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
                // 追加済み
                <div
                    onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                    }}
                    className="cursor-pointer mt-3 flex items-center justify-between border-2 border-yellow-400 rounded-full px-2 py-2"
                >
                    <button
                        // 👇 修正③
                        onClick={() => decreaseQuantity(cartItem.id)}
                        className="cursor-pointer px-3 py-1 rounded-lg"
                    >
                        −
                    </button>

                    <span className="font-bold">{cartItem.quantity}</span>

                    <button
                        // 👇 修正③
                        onClick={() => increaseQuantity(cartItem.id)}
                        className="cursor-pointer px-3 py-1 rounded-lg"
                    >
                        ＋
                    </button>
                </div>
            )}
        </div>
    );
}