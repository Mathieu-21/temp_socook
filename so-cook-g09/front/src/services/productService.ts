// src/services/productService.ts
import api from './api';

// Obtenir tous les produits
export const getAllProducts = async () => {
  try {
    const response = await api.get('/api/products');
    return response.data;
  } catch (error) {
    console.error("Erreur lors de la récupération des produits:", error);
    return [];
  }
};

// Obtenir un produit par ID
export const getProductById = async (productId: number) => {
  try {
    const response = await api.get(`/api/products/${productId}`);
    return response.data;
  } catch (error) {
    console.error(`Erreur lors de la récupération du produit ${productId}:`, error);
    return null;
  }
};

// Obtenir les produits d'un vendeur
export const getProductsBySeller = async (sellerId: number) => {
  try {
    const response = await api.get(`/api/products/seller/${sellerId}`);
    return response.data;
  } catch (error) {
    console.error(`Erreur lors de la récupération des produits du vendeur ${sellerId}:`, error);
    return [];
  }
};

// Obtenir les produits par catégorie
export const getProductsByCategory = async (category: string) => {
  try {
    const response = await api.get(`/api/products/category/${category}`);
    return response.data;
  } catch (error) {
    console.error(`Erreur lors de la récupération des produits de la catégorie ${category}:`, error);
    return [];
  }
};
