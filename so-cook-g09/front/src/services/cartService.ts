// src/services/cartService.ts
import api from './api';

export interface CartItem {
  id_product: number;
  quantity: number;
  id_user: number;
}

// Récupérer le panier de l'utilisateur
export const getUserCart = async (userId: number) => {
  try {
    const response = await api.get(`/api/cart/${userId}`);
    return response.data;
  } catch (error) {
    console.error("Erreur lors de la récupération du panier:", error);
    return [];
  }
};

// Ajouter un produit au panier
export const addToCart = async (userId: number, productId: number, quantity: number) => {
  try {
    const response = await api.post(`/api/cart/${userId}`, {
      id_product: productId,
      quantity
    });
    return response.data;
  } catch (error) {
    console.error("Erreur lors de l'ajout au panier:", error);
    throw error;
  }
};

// Mettre à jour la quantité d'un produit dans le panier
export const updateCartItem = async (userId: number, productId: number, quantity: number) => {
  try {
    const response = await api.put(`/api/cart/${userId}/${productId}`, { quantity });
    return response.data;
  } catch (error) {
    console.error("Erreur lors de la mise à jour du panier:", error);
    throw error;
  }
};

// Supprimer un produit du panier
export const removeFromCart = async (userId: number, productId: number) => {
  try {
    const response = await api.delete(`/api/cart/${userId}/${productId}`);
    return response.data;
  } catch (error) {
    console.error("Erreur lors de la suppression du produit du panier:", error);
    throw error;
  }
};

// Vider le panier
export const clearCart = async (userId: number) => {
  try {
    const response = await api.delete(`/api/cart/${userId}`);
    return response.data;
  } catch (error) {
    console.error("Erreur lors du vidage du panier:", error);
    throw error;
  }
};
