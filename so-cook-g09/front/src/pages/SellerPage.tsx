// src/pages/SellerPage.tsx
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getSellerCatalog } from '../services/sellerService';
import type { SellerCatalog, Product } from '../types/seller';
import styles from './SellerPage.module.css'; // Import the CSS module

// A simple Star icon component
const StarIcon = () => (
    <svg fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg" style={{ width: '1.2rem', height: '1.2rem', color: '#ffc107' }}>
        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
    </svg>
);

const SellerPage: React.FC = () => {
    const { sellerId } = useParams<{ sellerId: string }>();
    const [sellerCatalog, setSellerCatalog] = useState<SellerCatalog | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchSellerData = async () => {
            if (!sellerId) return;
            try {
                setLoading(true);
                // Conversion du sellerId en nombre car notre API attend un number
                const data = await getSellerCatalog(parseInt(sellerId, 10));
                setSellerCatalog(data);
                setError(null);
            } catch (err) {
                setError('Failed to fetch seller data.');
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchSellerData();
    }, [sellerId]);

    if (loading) {
        return <div className={styles.container}>Loading...</div>;
    }

    if (error) {
        return <div className={styles.container}>{error}</div>;
    }

    if (!sellerCatalog) {
        return <div className={styles.container}>Seller not found.</div>;
    }

    const { seller, products } = sellerCatalog;
    const { seller_name, average_seller_rate } = seller;

    return (
        <div className={styles.container}>
            <header className={styles.sellerHeader}>
                <h1>{seller_name}</h1>
                <p>
                    <StarIcon />
                    <span>{average_seller_rate?.toFixed(1) || "N/A"} / 5</span>
                </p>
            </header>

            <main>
                <div className={styles.productsGrid}>
                    {products.map((product: Product) => (
                        <div key={product.id_product} className={styles.productCard}>
                            <img src={product.image_url} alt={product.product_name} className={styles.productImage} />
                            <div className={styles.productInfo}>
                                <h3>{product.product_name}</h3>
                                <p className={styles.description}>{product.description}</p>
                                <div className={styles.productFooter}>
                                    <span className={styles.price}>${product.price.toFixed(2)}</span>
                                    <span className={styles.type}>{product.product_type || 'N/A'}</span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </main>
        </div>
    );
};

export default SellerPage;
