// src/services/authService.ts
import api from './api';

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  name: string;
  email: string;
  password: string;
}

export interface AuthResponse {
  token?: string;
  user?: {
    id_user: number;
    name: string;
    email: string;
  };
  error?: string;
}

// Connexion utilisateur
export const login = async (credentials: LoginRequest): Promise<AuthResponse> => {
  try {
    const response = await api.post('/api/auth/login', credentials);
    const { token, user } = response.data;
    
    // Stocker le token dans le localStorage
    if (token) {
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));
    }
    
    return response.data;
  } catch (error) {
    console.error('Erreur de connexion:', error);
    return { error: 'Identifiants invalides' };
  }
};

// Inscription utilisateur
export const register = async (userData: RegisterRequest): Promise<AuthResponse> => {
  try {
    const response = await api.post('/api/auth/register', userData);
    const { token, user } = response.data;
    
    // Stocker le token dans le localStorage
    if (token) {
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));
    }
    
    return response.data;
  } catch (error) {
    console.error('Erreur d\'inscription:', error);
    return { error: 'L\'inscription a échoué' };
  }
};

// Déconnexion
export const logout = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
};

// Vérifier si l'utilisateur est connecté
export const isAuthenticated = (): boolean => {
  return localStorage.getItem('token') !== null;
};

// Récupérer l'utilisateur courant
export const getCurrentUser = () => {
  const userStr = localStorage.getItem('user');
  return userStr ? JSON.parse(userStr) : null;
};
