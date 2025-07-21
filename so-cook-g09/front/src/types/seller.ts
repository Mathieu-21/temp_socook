// src/types/seller.ts

export interface Product {
    id_product: number;
    id_seller: number;
    product_name: string;
    description: string;
    price: number;
    stock_quantity: number;
    category: string;
    image_url: string;
    created_at: string;
    updated_at: string;
    product_type?: 'cooked' | 'raw';
}

export interface Seller {
    id_seller: number;
    seller_name: string;
    email: string;
    address: string;
    phone: string;
    latitude: number;
    longitude: number;
    description?: string;
    logo_url?: string;
    average_seller_rate?: number;
    created_at: string;
    updated_at: string;
    distance?: number;
}

export interface SellerCatalog {
    seller: Seller;
    products: Product[];
}

// Interface pour le composant MapSection
export interface ProducerMapItem {
    id_seller: number;
    product_images?: string[];
    seller_name: string;
    latitude: number;
    longitude: number;
    average_seller_rate?: number;
    distance?: number;
}
