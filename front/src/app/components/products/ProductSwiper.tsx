'use client';

import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination } from "swiper/modules";

import "swiper/css";
import "swiper/css/pagination";

type ProductImage = {
    id: number;
    image_path: string;
};

type Props = {
    images?: ProductImage[];
};

export default function ProductSwiper({ images }: Props) {
    if (!images || images.length === 0) return null;

    return (
    <Swiper
        modules={[Pagination]}
        slidesPerView={1}
        spaceBetween={10}
        pagination={{ clickable: true }}
        className="w-full"
        >
        {images.map((img) => (
            <SwiperSlide key={img.id}>
            <img
                src={`http://localhost/storage/${img.image_path}`}
                className="w-full object-contain mx-auto"
            />
            </SwiperSlide>
        ))}
        </Swiper>
    );
}