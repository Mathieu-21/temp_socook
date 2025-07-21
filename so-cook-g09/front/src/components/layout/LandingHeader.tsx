import { Link } from 'react-router-dom';
import { FaArrowRight } from 'react-icons/fa';

export function LandingHeader() {
  return (
    <header className="bg-white border-b">
      <div className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <div className="flex-shrink-0">
            <span className="text-3xl font-extrabold text-green-600">So-Cook</span>
            <span className="ml-2 text-sm text-gray-500">Du producteur à l'assiette</span>
          </div>
          
          {/* Boutons */}
          <div className="flex items-center space-x-4">
            <Link 
              to="/login" 
              className="inline-block px-4 py-2 text-base font-medium text-green-600 hover:text-green-800"
            >
              Connexion
            </Link>
            <Link 
              to="/home" 
              className="inline-flex items-center px-4 py-2 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700"
            >
              Découvrir <FaArrowRight className="ml-2" />
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}
