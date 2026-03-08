'use client';

import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination } from "swiper/modules";

import "swiper/css";
import "swiper/css/pagination";

import { Product } from "@/types/Product";

type Props = {
    product: Product;
};

export default function ProductCard({ product }: Props) {
    return (
        <div className="cursor-pointer hover:shadow-lg transition p-3 border rounded">

            <Swiper
                modules={[Pagination]}
                slidesPerView={1}            // ← ここを追加
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

            <p className="font-bold truncate mt-2">
                {product.product_name}
            </p>

            <p className="text-2xl">
                ¥{product.product_price.toLocaleString()}
            </p>

        </div>
    );
}