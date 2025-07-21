import { useEffect, useState, useMemo } from "react";
import MapSection from "./MapSection";
import { getAllSellers, getNearbySellers } from "../services/sellerService";

// Hook pour la géolocalisation utilisateur
function useUserLocation() {
  const [location, setLocation] = useState<{lat: number, lng: number} | null>(null);
  useEffect(() => {
    if (!navigator.geolocation) return;
    navigator.geolocation.getCurrentPosition(
      (pos) => setLocation({ lat: pos.coords.latitude, lng: pos.coords.longitude }),
      () => setLocation(null)
    );
  }, []);
  return location;
}

export default function HomePage() {
  // Panier local : clé unique = id_seller + product_title
  const [cart, setCart] = useState<Record<string, number>>({});
  const getCartKey = (prod: any) => `${prod.id_seller}__${prod.product_title}`;
  const getQty = (prod: any) => cart[getCartKey(prod)] || 0;
  const addToCart = (prod: any) => setCart(c => ({ ...c, [getCartKey(prod)]: 1 }));
  const incQty = (prod: any) => setCart(c => ({ ...c, [getCartKey(prod)]: (c[getCartKey(prod)] || 0) + 1 }));
  const decQty = (prod: any) => setCart(c => {
    const key = getCartKey(prod);
    const qty = (c[key] || 0) - 1;
    if (qty <= 0) {
      const { [key]: _, ...rest } = c;
      return rest;
    }
    return { ...c, [key]: qty };
  });
  const [producers, setProducers] = useState<any[]>([]);
  const [search, setSearch] = useState("");

  const userLocation = useUserLocation();

  // Calcul de la distance Haversine (en km)
  function getDistanceKm(lat1: number, lon1: number, lat2: number, lon2: number) {
    const R = 6371; // Rayon de la Terre en km
    const dLat = ((lat2 - lat1) * Math.PI) / 180;
    const dLon = ((lon2 - lon1) * Math.PI) / 180;
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos((lat1 * Math.PI) / 180) *
        Math.cos((lat2 * Math.PI) / 180) *
        Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  }

  // Ajoute la distance dynamique à chaque prod selon la position utilisateur
  const producersWithDistance = useMemo(() => {
    let userLat = userLocation?.lat;
    let userLng = userLocation?.lng;
    return producers.map(prod => {
      let distance = prod.distance;
      if (userLat !== undefined && userLng !== undefined) {
        distance = getDistanceKm(userLat, userLng, prod.latitude, prod.longitude);
      }
      return { ...prod, distance };
    });
  }, [producers, userLocation]);

  // Valeur max du slider (distance max des producteurs calculée dynamiquement)
  const maxDistance = useMemo(() =>
    producersWithDistance.length ? Math.ceil(Math.max(...producersWithDistance.map(p => p.distance))) : 10,
    [producersWithDistance]
  );
  const [distanceFilter, setDistanceFilter] = useState<number>(maxDistance);
  useEffect(() => {
    setDistanceFilter(maxDistance);
  }, [maxDistance]);

  // Liste filtrée et triée
  const filteredProducers = useMemo(() => {
    let list = producersWithDistance
      .filter(prod => prod.distance <= distanceFilter)
      .sort((a, b) => a.distance - b.distance);
    if (search.trim() !== "") {
      const query = search.trim().toLowerCase();
      // Filtrer les produits qui matchent la recherche sur le titre ou la description
      return list
        .filter(prod => (
          (prod.product_title && prod.product_title.toLowerCase().includes(query)) ||
          (prod.product_description && prod.product_description.toLowerCase().includes(query))
        ))
        .map(prod => ({
          id_seller: prod.id_seller,
          product_images: prod.product_images,
          seller_name: prod.seller_name,
          latitude: prod.latitude,
          longitude: prod.longitude,
          average_seller_rate: prod.average_seller_rate,
          product_price: prod.product_price,
          product_description: prod.product_description,
          product_title: prod.product_title
        }))
        // On n'affiche que les produits complets (titre, desc, prix, au moins une image)
        .filter(prod => prod.product_title && prod.product_description && prod.product_price !== undefined && Array.isArray(prod.product_images) && prod.product_images.length > 0);
    }
    return list;
  }, [distanceFilter, producersWithDistance, search]);

  // Charger les données depuis l'API
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Récupérer les vendeurs à proximité si la position utilisateur est disponible
        if (userLocation) {
          const nearbySellers = await getNearbySellers(
            userLocation.lat,
            userLocation.lng,
            50 // Distance maximale par défaut (50km)
          );
          setProducers(nearbySellers);
        } else {
          // Si pas de géolocalisation, récupérer tous les vendeurs
          const allSellers = await getAllSellers();
          setProducers(allSellers);
        }
      } catch (error) {
        console.error("Erreur lors du chargement des données:", error);
        // Fallback aux données mock en cas d'erreur
        const mockData = await import("../mocks/producers.json");
        setProducers(mockData.default || mockData);
      }
    };
    
    fetchData();
  }, [userLocation]); // Recharger quand la position utilisateur change

  // Réajuste le filtre si maxDistance change (ex: chargement asynchrone)
  useEffect(() => {
    setDistanceFilter(maxDistance);
  }, [maxDistance]);


  return (
    <div className="flex flex-col h-screen w-full">
      {/* Split layout */}
      <div className="flex flex-1 h-full">
        {/* Liste à gauche */}
        <div className="w-1/2 overflow-y-auto border-r p-6 bg-white">
      {/* Filtre distance */}
      
          {/* Barre de recherche locale */}
          <div className="mb-2">
            <input
              type="text"
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Recherche un produit spécifique"
              className="w-full px-3 py-2 border rounded shadow-sm"
            />
          </div>
          <div className="flex items-center gap-3 px-6 py-2 bg-white border-b">
        <label htmlFor="distance-slider" className="text-sm font-medium text-gray-700">Distance max :</label>
        <input
          id="distance-slider"
          type="range"
          min={1}
          max={maxDistance}
          value={distanceFilter}
          onChange={e => setDistanceFilter(Number(e.target.value))}
          className="w-48 accent-green-600"
        />
        <span className="text-green-700 font-semibold">{distanceFilter} km</span>
        <span className="text-xs text-gray-500 ml-2">(Vendeur le plus loin : {maxDistance} km)</span>
      </div>
          <h2 className="text-xl font-bold mb-4">Producteurs & Cookers</h2>
          {filteredProducers.length === 0 && (
            <div className="text-gray-500">Aucun résultat.</div>
          )}
          <ul className="space-y-4">

            {filteredProducers.map((prod, idx) => (
              search.trim() !== "" ? (
                // Affichage strict format produit lors de la recherche
                <li key={prod.id_seller + '-' + idx} className="p-4 rounded border shadow-sm hover:bg-green-50 transition flex items-center gap-6">
                  {/* Image produit principale à gauche */}
                  <img
                    src={prod.product_images[0]}
                    alt={prod.product_title + ' image principale'}
                    className="w-32 h-32 object-cover rounded-xl border bg-white flex-shrink-0 mr-2 shadow"
                  />
                  {/* Texte produit au centre */}
                  <div className="flex-1 flex flex-col gap-1 min-w-0">
                    <div className="font-bold text-xl mb-1 truncate">{prod.product_title}</div>
                    <div className="text-gray-700 text-sm mb-1 truncate">{prod.product_description}</div>
                    <div className="text-green-800 font-bold text-lg mb-1">{prod.product_price} €</div>
                    <div className="font-semibold text-base text-green-700">{prod.seller_name}</div>
                    <div className="text-xs text-yellow-600 mt-1">Note : {prod.average_seller_rate} ⭐</div>
                  </div>
                  {/* Panier à droite */}
                  <div className="flex flex-col items-end min-w-[140px]">
                    {getQty(prod) === 0 ? (
                      <button
                        onClick={() => addToCart(prod)}
                        className="w-full flex items-center justify-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg font-bold shadow hover:bg-green-700 transition-all duration-150 text-base"
                      >
                        <svg xmlns='http://www.w3.org/2000/svg' className='w-5 h-5' fill='none' viewBox='0 0 24 24' stroke='currentColor'><path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M3 3h2l.4 2M7 13h10l4-8H5.4M7 13l-1.35 2.7a1 1 0 00.9 1.45h12.2a1 1 0 00.9-1.45L17 13M7 13V6a1 1 0 011-1h5a1 1 0 011 1v7' /></svg>
                        Ajouter au panier
                      </button>
                    ) : (
                      <div className="flex flex-col items-center bg-green-50 rounded-xl shadow px-4 py-3 min-w-[120px]">
                        <div className="flex items-center gap-3 mb-1">
                          <button
                            onClick={() => decQty(prod)}
                            className="w-9 h-9 flex items-center justify-center bg-green-200 text-green-800 rounded-full text-xl font-bold shadow hover:bg-green-300 active:scale-90 transition-all duration-100"
                            aria-label="Diminuer la quantité"
                          >
                            <svg xmlns='http://www.w3.org/2000/svg' className='w-5 h-5' fill='none' viewBox='0 0 24 24' stroke='currentColor'><path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M20 12H4' /></svg>
                          </button>
                          <span className="font-extrabold text-2xl text-green-700 w-8 text-center select-none">{getQty(prod)}</span>
                          <button
                            onClick={() => incQty(prod)}
                            className="w-9 h-9 flex items-center justify-center bg-green-600 text-white rounded-full text-xl font-bold shadow hover:bg-green-700 active:scale-90 transition-all duration-100"
                            aria-label="Augmenter la quantité"
                          >
                            <svg xmlns='http://www.w3.org/2000/svg' className='w-5 h-5' fill='none' viewBox='0 0 24 24' stroke='currentColor'><path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M12 4v16m8-8H4' /></svg>
                          </button>
                        </div>
                        <div className="text-green-900 text-sm font-semibold mt-1">Total : <span className="font-bold">{(getQty(prod) * prod.product_price).toFixed(2)} €</span></div>
                      </div>
                    )}
                  </div>
                </li>
              ) : (
                // Affichage complet hors recherche
                <li key={prod.id_seller} className="p-4 rounded border shadow-sm hover:bg-green-50 transition">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-4">
                      <img
                        src={prod.profile_image}
                        alt={prod.seller_name + ' profil'}
                        className="w-12 h-12 object-cover rounded-full border-2 border-green-400 bg-white mr-2"
                      />
                      <div>
                        <div className="font-semibold text-lg">{prod.seller_name}</div>
                        <div className="text-xs text-yellow-600 mt-1">Note : {prod.average_seller_rate} ⭐</div>
                      </div>
                    </div>
                    <div className="text-green-700 font-bold text-sm">{prod.distance?.toFixed(1)} km</div>
                  </div>
                  {/* Galerie produits glissante */}
                  <div className="mt-3 overflow-x-auto">
                    <div className="flex gap-2 w-max">
                      {prod.product_images.map((img: string, idx: number) => (
                        <img
                          key={idx}
                          src={img}
                          alt={prod.seller_name + ' produit ' + (idx+1)}
                          className="w-36 h-36 object-cover rounded-lg border bg-white flex-shrink-0"
                        />
                      ))}
                    </div>
                  </div>
                </li>
              )))}
          </ul>
        </div>
        {/* Map à droite */}
        <div className="w-1/2 h-full bg-gray-50 flex flex-col items-center justify-center overflow-hidden">
          <div className="w-full h-full flex items-center justify-center">
            <MapSection
              producers={filteredProducers}
              userLocation={userLocation}
              distanceFilter={distanceFilter}
              maxDistance={maxDistance}
            />
          </div>
        </div>
      </div>
    </div>
  );
}