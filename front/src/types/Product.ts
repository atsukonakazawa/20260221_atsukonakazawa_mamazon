export type Category = {
    id: number;
    category_name: string;
};

export type Color = {
    id: number;
    color_name: string;
};

export type Shipment_date = {
    id: number;
    shipment_date: string;
};

export type Size = {
    id: number;
    size_name: string;
};

export type Seller = {
    id: number;
    seller_name: string;
};


export type Product = {
    id: number;
    category_id: number;
    category?: Category;

    color_id: number;
    color?: Color;

    shipment_date_id: number;
    shipment_date?: Shipment_date;

    size_id: number;
    size?: Size;

    seller_id: number;
    seller?: Seller;

    product_name: string;
    product_price: number;
    product_description: string;

    product_image: string;

    images?: ProductImage[];

    created_at: string;
    updated_at: string;
};

export type ProductImage = {
    id: number;
    product_id: number;
    image_path: string;
    sort_order: number;
    created_at: string;
    updated_at: string;
};
