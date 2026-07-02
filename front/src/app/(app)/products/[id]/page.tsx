import { notFound } from "next/navigation";
import { fetchProductById } from "@/lib/api/productApi";
import GuestHeader from "@/app/components/GuestHeader";
import FooterLogin from "../../../components/FooterLogin";
import ProductSwiper from "../../../components/products/ProductSwiper";
import AddToCartButton from '../../../components/products/AddToCartButton';
import StarRatingDisplay from '../../../components/review/StarRatingDisplay';
import Link from "next/link";


export default async function ProductDetail({
    params,
    }: {
    params: Promise<{ id: number }>;
    }) {

    const { id } = await params;

    try {
        const product = await fetchProductById(id);

        return (
            <>
                <GuestHeader />

                <div className="max-w-6xl mx-auto p-6">

                    {/* 3カラムレイアウト */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">

                        {/* 左：商品画像 */}
                        <div className="w-full max-w-xs mx-auto">
                            <ProductSwiper images={product.images} />
                        </div>

                        {/* 中：商品情報 */}
                        <div>
                            <h1 className="text-2xl font-bold mt-6">
                                {product.product_name}
                            </h1>

                        <div className="mt-3 flex">
                            <StarRatingDisplay
                                rating={product.reviews_avg_score ?? 0}
                            />
                            <Link
                                href={`/products/${product.id}/reviews`}
                                className="text-xs text-blue-400 pl-3 hover:underline"
                            >
                                ({product.reviews_count ?? 0}件)
                            </Link>
                        </div>


                            <div className="text-3xl mt-4">
                                ¥{product.product_price.toLocaleString()}
                            </div>

                            <div className="md:hidden mt-4">
                                <AddToCartButton
                                    product={product}
                                    guestMode
                                />
                            </div>

                            <div className="mt-4">
                                {product.category && (
                                    <p>カテゴリー: {product.category.category_name}</p>
                                )}

                                {product.color && (
                                    <p>カラー: {product.color.color_name}</p>
                                )}

                                {product.shipment_date && (
                                    <p>お届け: {product.shipment_date.shipment_date}</p>
                                )}

                                {product.size && (
                                    <p>サイズ: {product.size.size_name}</p>
                                )}

                                {product.seller && (
                                    <p>販売者: {product.seller.seller_name}</p>
                                )}

                                <div>
                                    <p>説明：{product.product_description}</p>
                                </div>
                            </div>
                        </div>

                        {/* 右：カート */}
                        <div className="hidden md:block border p-6 h-fit">
                            <h2 className="text-xl font-bold">
                                カート
                            </h2>
                            <AddToCartButton
                                product={product}
                                guestMode
                            />
                        </div>
                    </div>
                </div>

                <FooterLogin />
            </>
        );
    } catch {
        return notFound();
    }
}
