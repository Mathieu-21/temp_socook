import { useState } from "react";

interface BasketItem {
  id_product_basket: number;
  id_product: number;
  id_seller: number;
  product_title: string;
  product_description: string;
  product_price: number;
  product_seller_name?: string; // Ajouté pour affichage producteur
  product_seller_address?: string; // Ajouté pour affichage adresse
}

import mockBasket from "../mocks/mockBasket.json";

// Ajout d'un fallback pour les mocks : injecte des infos producteur fictives si absentes
const initialBasket: BasketItem[] = (mockBasket as BasketItem[]).map(item => ({
  ...item,
  product_seller_name: item.product_seller_name,
  product_seller_address: item.product_seller_address}));

import { useNavigate } from "react-router-dom";

export default function CartPage() {
  const [basket, setBasket] = useState<BasketItem[]>(initialBasket);
  const navigate = useNavigate();

  const handleRemove = (id_product_basket: number) => {
    setBasket(basket.filter(item => item.id_product_basket !== id_product_basket))
  };

  const total = basket.reduce((sum, item) => sum + item.product_price, 0);

  return (
    <div className="max-w-5xl mx-auto mt-10 mb-8 p-4">
      <h1 className="text-2xl font-bold mb-8">Mon panier</h1>
      <div className="flex flex-col md:flex-row gap-8">
        {/* Colonne gauche : liste des articles */}
        <div className="flex-1">
          {basket.length === 0 ? (
            <div className="text-center text-gray-500">Votre panier est vide.</div>
          ) : (
            <div className="space-y-4">
              {basket.map(item => (
                <div
                  key={item.id_product_basket}
                  className="flex flex-col sm:flex-row sm:items-center justify-between bg-white rounded-xl shadow p-4 border border-gray-100"
                >
                  <div className="flex-1">
                    <div className="font-semibold text-lg">{item.product_title}</div>
                    <div className="text-green-700 font-medium">{item.product_seller_name}</div>
                    <div className="text-gray-500 italic mb-1">{item.product_seller_address}</div>
                    <div className="text-gray-600 mb-1">{item.product_description}</div>
                    <span className="font-bold text-gray-900">{item.product_price.toFixed(2)} €</span>
                  </div>
                  <button
                    onClick={() => handleRemove(item.id_product_basket)}
                    className="mt-3 sm:mt-0 sm:ml-6 flex items-center gap-2 bg-red-600 shadow-md hover:shadow-lg hover:scale-105 transition-all duration-200 text-white font-semibold py-2 px-4 rounded-full disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                    Retirer
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
        {/* Colonne droite : résumé + paiement */}
        <div className="w-full md:w-80 lg:w-96 md:sticky md:top-24">
          <div className="bg-white border border-green-200 rounded-2xl shadow-lg p-8 flex flex-col items-center">
            <div className="mb-6 flex flex-col items-center">
              <h2 className="text-xl font-bold text-green-700">Résumé du panier</h2>
            </div>
            <hr className="w-full border-green-200 mb-6" />
            <div className="flex w-full justify-between items-center mb-4">
              <span className="font-semibold text-lg">Total</span>
              <span className="font-bold text-green-700 text-2xl">{total.toFixed(2)} €</span>
            </div>
            <button
              className="mt-2 max-w-sm w-full flex items-center justify-center gap-2 bg-green-600 shadow-md hover:shadow-lg hover:scale-105 transition-all duration-200 text-white text-base font-bold py-2 px-4 h-10 rounded-full disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={basket.length === 0}
              onClick={() => navigate('/checkout')}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M17 9V7a5 5 0 00-10 0v2M5 11h14a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2z" />
              </svg>
              Payer
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}