import { FaFacebook, FaInstagram, FaTwitter } from 'react-icons/fa';
import { Link } from 'react-router-dom';

export function Footer() {
  return (
    <footer className="bg-white border-t">
      <div className="max-w-7xl mx-auto px-4 py-10 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* À propos */}
          <div>
            <h3 className="text-lg font-medium text-gray-900">À propos de So-Cook</h3>
            <p className="mt-2 text-sm text-gray-600">
              So-Cook connecte les producteurs locaux et les consommateurs qui recherchent des produits de qualité et des recettes délicieuses.
            </p>
          </div>

          {/* Liens rapides */}
          <div>
            <h3 className="text-lg font-medium text-gray-900">Liens rapides</h3>
            <ul className="mt-2 space-y-2 text-sm">
              <li>
                <Link to="/home" className="text-gray-600 hover:text-green-600">Produits</Link>
              </li>
              <li>
                <Link to="/recipe/new" className="text-gray-600 hover:text-green-600">Ajouter une recette</Link>
              </li>
              <li>
                <Link to="/cart" className="text-gray-600 hover:text-green-600">Mon panier</Link>
              </li>
            </ul>
          </div>

          {/* Aide et Support */}
          <div>
            <h3 className="text-lg font-medium text-gray-900">Aide et Support</h3>
            <ul className="mt-2 space-y-2 text-sm">
              <li>
                <Link to="#" className="text-gray-600 hover:text-green-600">FAQ</Link>
              </li>
              <li>
                <Link to="#" className="text-gray-600 hover:text-green-600">Conditions d'utilisation</Link>
              </li>
              <li>
                <Link to="#" className="text-gray-600 hover:text-green-600">Politique de confidentialité</Link>
              </li>
              <li>
                <Link to="#" className="text-gray-600 hover:text-green-600">Contact</Link>
              </li>
            </ul>
          </div>

          {/* Réseaux sociaux */}
          <div>
            <h3 className="text-lg font-medium text-gray-900">Suivez-nous</h3>
            <div className="mt-4 flex space-x-4">
              <a href="#" className="text-gray-600 hover:text-green-600">
                <FaFacebook size={24} />
              </a>
              <a href="#" className="text-gray-600 hover:text-green-600">
                <FaInstagram size={24} />
              </a>
              <a href="#" className="text-gray-600 hover:text-green-600">
                <FaTwitter size={24} />
              </a>
            </div>
          </div>
        </div>

        <div className="mt-8 border-t border-gray-200 pt-6">
          <p className="text-sm text-center text-gray-500">
            © {new Date().getFullYear()} So-Cook – Tous droits réservés
          </p>
        </div>
      </div>
    </footer>
  );
}