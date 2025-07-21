import { Link } from 'react-router-dom';
import { LandingHeader } from '../components/layout/LandingHeader';
import { FaLeaf, FaCarrot, FaUtensils } from 'react-icons/fa';

export default function LandingPage() {
  return (
    <div className="min-h-screen flex flex-col bg-white">
      <LandingHeader />
      
      {/* Hero Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl tracking-tight font-extrabold text-gray-900 sm:text-5xl md:text-6xl">
              <span className="block">Du producteur à votre assiette</span>
              <span className="block text-green-600 mt-2">Simplement délicieux</span>
            </h1>
            <p className="mt-3 max-w-md mx-auto text-base text-gray-500 sm:text-lg md:mt-5 md:text-xl md:max-w-3xl">
              Découvrez des produits frais et locaux livrés directement chez vous.
              Soutenez les producteurs locaux tout en vous régalant avec des recettes inspirantes.
            </p>
            <div className="mt-5 max-w-md mx-auto sm:flex sm:justify-center md:mt-8">
              <div className="rounded-md shadow">
                <Link
                  to="/home"
                  className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-green-600 hover:bg-green-700 md:py-4 md:text-lg md:px-10"
                >
                  Découvrir les produits
                </Link>
              </div>
              <div className="mt-3 rounded-md shadow sm:mt-0 sm:ml-3">
                <Link
                  to="/login"
                  className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-green-600 bg-white hover:bg-gray-50 md:py-4 md:text-lg md:px-10"
                >
                  Créer un compte
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-12 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="lg:text-center">
            <h2 className="text-base text-green-600 font-semibold tracking-wide uppercase">Nos valeurs</h2>
            <p className="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-gray-900 sm:text-4xl">
              Une nouvelle façon de consommer
            </p>
            <p className="mt-4 max-w-2xl text-xl text-gray-500 lg:mx-auto">
              So-Cook connecte les consommateurs aux producteurs locaux pour offrir une expérience culinaire unique.
            </p>
          </div>

          <div className="mt-10">
            <div className="space-y-10 md:space-y-0 md:grid md:grid-cols-3 md:gap-x-8 md:gap-y-10">
              <div className="flex flex-col items-center">
                <div className="flex items-center justify-center h-12 w-12 rounded-md bg-green-600 text-white">
                  <FaLeaf size={20} />
                </div>
                <h3 className="mt-4 text-lg leading-6 font-medium text-gray-900">Écologique</h3>
                <p className="mt-2 text-base text-gray-500 text-center">
                  Réduisez votre empreinte carbone en achetant des produits locaux et de saison.
                </p>
              </div>
              
              <div className="flex flex-col items-center">
                <div className="flex items-center justify-center h-12 w-12 rounded-md bg-green-600 text-white">
                  <FaCarrot size={20} />
                </div>
                <h3 className="mt-4 text-lg leading-6 font-medium text-gray-900">Frais et Sain</h3>
                <p className="mt-2 text-base text-gray-500 text-center">
                  Profitez de produits fraîchement récoltés, riches en saveurs et nutriments.
                </p>
              </div>
              
              <div className="flex flex-col items-center">
                <div className="flex items-center justify-center h-12 w-12 rounded-md bg-green-600 text-white">
                  <FaUtensils size={20} />
                </div>
                <h3 className="mt-4 text-lg leading-6 font-medium text-gray-900">Inspirant</h3>
                <p className="mt-2 text-base text-gray-500 text-center">
                  Découvrez des recettes créatives pour tirer le meilleur parti de vos produits frais.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-green-600">
        <div className="max-w-2xl mx-auto text-center py-16 px-4 sm:py-20 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-extrabold text-white sm:text-4xl">
            <span className="block">Prêt à découvrir So-Cook?</span>
            <span className="block">Commencez dès aujourd'hui.</span>
          </h2>
          <p className="mt-4 text-lg leading-6 text-white opacity-90">
            Rejoignez notre communauté de gourmets et de producteurs passionnés.
          </p>
          <Link
            to="/home"
            className="mt-8 w-full inline-flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-md text-green-600 bg-white hover:bg-green-50 sm:w-auto"
          >
            Explorer les produits
          </Link>
        </div>
      </section>
    </div>
  );
}