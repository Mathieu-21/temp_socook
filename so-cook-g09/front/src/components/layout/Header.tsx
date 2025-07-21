import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { FaShoppingCart, FaUser, FaBars, FaTimes } from 'react-icons/fa';

export function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();

  // Ne pas afficher le Header principal sur la page d'accueil
  if (location.pathname === '/') {
    return null;
  }

  return (
    <header className="bg-white shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Logo et navigation principale */}
          <div className="flex items-center">
            <Link to="/home" className="flex-shrink-0 flex items-center">
              <span className="text-2xl font-bold text-green-600">So-Cook</span>
            </Link>
            
            {/* Navigation desktop */}
            <div className="hidden md:ml-8 md:flex md:space-x-8">
              <Link 
                to="/home" 
                className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium ${location.pathname === '/home' ? 'border-green-500 text-gray-900' : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'}`}
              >
                Produits
              </Link>
              <Link 
                to="/recipe/new" 
                className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium ${location.pathname === '/recipe/new' ? 'border-green-500 text-gray-900' : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'}`}
              >
                Ajouter une recette
              </Link>
            </div>
          </div>

          {/* Actions - Panier et Profil */}
          <div className="hidden md:flex items-center">
            <div className="flex-shrink-0 flex items-center">
              <Link to="/cart" className="p-2 rounded-full text-gray-600 hover:text-gray-900 relative">
                <FaShoppingCart size={20} />
                <span className="absolute -top-1 -right-1 bg-green-500 text-white text-xs w-5 h-5 flex items-center justify-center rounded-full">3</span>
              </Link>
              <Link to="/profile" className="ml-4 p-2 rounded-full text-gray-600 hover:text-gray-900">
                <FaUser size={20} />
              </Link>
              <Link to="/login" className="ml-4 px-4 py-2 rounded-md text-sm font-medium text-white bg-green-600 hover:bg-green-700">
                Connexion
              </Link>
            </div>
          </div>

          {/* Bouton menu mobile */}
          <div className="-mr-2 flex items-center md:hidden">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none"
            >
              <span className="sr-only">Ouvrir le menu</span>
              {isMobileMenuOpen ? <FaTimes size={20} /> : <FaBars size={20} />}
            </button>
          </div>
        </div>
      </div>

      {/* Menu mobile */}
      {isMobileMenuOpen && (
        <div className="md:hidden">
          <div className="pt-2 pb-4 space-y-1">
            <Link 
              to="/home" 
              className={`block pl-3 pr-4 py-2 border-l-4 text-base font-medium ${location.pathname === '/home' ? 'bg-green-50 border-green-500 text-green-700' : 'border-transparent text-gray-600 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-800'}`}
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Produits
            </Link>
            <Link 
              to="/recipe/new" 
              className={`block pl-3 pr-4 py-2 border-l-4 text-base font-medium ${location.pathname === '/recipe/new' ? 'bg-green-50 border-green-500 text-green-700' : 'border-transparent text-gray-600 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-800'}`}
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Ajouter une recette
            </Link>
            <Link 
              to="/cart" 
              className={`block pl-3 pr-4 py-2 border-l-4 text-base font-medium ${location.pathname === '/cart' ? 'bg-green-50 border-green-500 text-green-700' : 'border-transparent text-gray-600 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-800'}`}
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Mon panier
            </Link>
            <Link 
              to="/profile" 
              className={`block pl-3 pr-4 py-2 border-l-4 text-base font-medium ${location.pathname === '/profile' ? 'bg-green-50 border-green-500 text-green-700' : 'border-transparent text-gray-600 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-800'}`}
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Mon profil
            </Link>
            <Link 
              to="/login" 
              className="block pl-3 pr-4 py-2 border-l-4 border-transparent text-base font-medium text-gray-600 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-800"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Connexion
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
