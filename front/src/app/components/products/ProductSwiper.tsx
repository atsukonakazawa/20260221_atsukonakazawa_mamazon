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
            {images && images.length > 0 ? (
                images.map((image) => (
                    <SwiperSlide key={image.id}>
                        <img
                            src={image.image_path}
                            alt="商品画像"
                            className="w-full object-contain mx-auto"
                        />
                    </SwiperSlide>
                ))
            ) : (
                <SwiperSlide>
                    <img
                        src="/no-image.png"
                        alt="No image"
                    />
                </SwiperSlide>
            )}
        </Swiper>
    );
}