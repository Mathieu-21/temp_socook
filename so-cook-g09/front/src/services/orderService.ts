// src/services/orderService.ts
import api from './api';

export interface OrderItem {
  id_product: number;
  quantity: number;
  price: number;
}

export interface Order {
  id_order: number;
  id_user: number;
  total_price: number;
  status: 'pending' | 'processing' | 'completed' | 'canceled';
  created_at: string;
  updated_at: string;
  items?: OrderItem[];
}

// Récupérer les commandes d'un utilisateur
export const getUserOrders = async (userId: number) => {
  try {
    const response = await api.get(`/api/orders/user/${userId}`);
    return response.data;
  } catch (error) {
    console.error("Erreur lors de la récupération des commandes:", error);
    return [];
  }
};

// Récupérer les détails d'une commande spécifique
export const getOrderDetails = async (orderId: number) => {
  try {
    const response = await api.get(`/api/orders/${orderId}`);
    return response.data;
  } catch (error) {
    console.error(`Erreur lors de la récupération des détails de la commande ${orderId}:`, error);
    return null;
  }
};

// Créer une nouvelle commande
export const createOrder = async (userId: number) => {
  try {
    const response = await api.post(`/api/orders/${userId}`);
    return response.data;
  } catch (error) {
    console.error("Erreur lors de la création de la commande:", error);
    throw error;
  }
};

// Mettre à jour le statut d'une commande
export const updateOrderStatus = async (orderId: number, status: 'pending' | 'processing' | 'completed' | 'canceled') => {
  try {
    const response = await api.put(`/api/orders/${orderId}/status`, { status });
    return response.data;
  } catch (error) {
    console.error(`Erreur lors de la mise à jour du statut de la commande ${orderId}:`, error);
    throw error;
  }
};
