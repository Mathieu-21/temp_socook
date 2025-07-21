// src/services/sellerService.ts
import api from './api';
import type { SellerCatalog } from '../types/seller';

// Obtenir les détails d'un vendeur par ID
export const getSellerById = async (sellerId: number) => {
    const response = await api.get(`/api/sellers/${sellerId}`);
    return response.data;
};

// Obtenir le catalogue d'un vendeur (ses produits)
export const getSellerCatalog = async (sellerId: number): Promise<SellerCatalog> => {
    try {
        const response = await api.get(`/api/products/seller/${sellerId}`);
        return {
            seller: await getSellerById(sellerId),
            products: response.data
        };
    } catch (error) {
        console.error("Erreur lors de la récupération du catalogue:", error);
        // Fallback aux données mockées en cas d'erreur (pour le développement)
        const mockResponse = await fetch('/seller-mock.json');
        return await mockResponse.json();
    }
};

// Obtenir les vendeurs à proximité
export const getNearbySellers = async (lat: number, lng: number, distance: number) => {
    try {
        const response = await api.get(`/api/sellers/nearby/${lat}/${lng}/${distance}`);
        return response.data;
    } catch (error) {
        console.error("Erreur lors de la récupération des vendeurs à proximité:", error);
        return [];
    }
};

// Obtenir tous les vendeurs
export const getAllSellers = async () => {
    try {
        const response = await api.get('/api/sellers');
        return response.data;
    } catch (error) {
        console.error("Erreur lors de la récupération des vendeurs:", error);
        return [];
    }
};

