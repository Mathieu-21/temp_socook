import { MapContainer, TileLayer, Marker, Popup, Circle } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import customMarkerUrl from '../assets/custom-marker.svg';
import { useEffect } from "react";
import { useMap } from "react-leaflet";

const customIcon = new L.Icon({
  iconUrl: customMarkerUrl,
  iconSize: [38, 38],
  iconAnchor: [19, 38],
  popupAnchor: [0, -38],
});

import type { ProducerMapItem } from "../types/seller";

interface MapSectionProps {
  producers: ProducerMapItem[];
  userLocation?: { lat: number; lng: number } | null;
  distanceFilter: number;
  maxDistance: number;
}



export default function MapSection({ producers, userLocation, distanceFilter }: MapSectionProps) {
  // Affiche un loader tant que la position utilisateur n'est pas connue
  if (userLocation === null) {
    return (
      <div className="flex justify-center items-center h-[70vh] text-lg text-blue-700">
        Chargement de la position…
      </div>
    );
  }
  // Centre sur position utilisateur si dispo, sinon moyenne des producteurs
  const defaultCenter = userLocation
    ? [userLocation.lat, userLocation.lng]
    : producers.length
      ? [
          producers.reduce((sum, p) => sum + p.latitude, 0) / producers.length,
          producers.reduce((sum, p) => sum + p.longitude, 0) / producers.length,
        ]
      : [48.8566, 2.3522];

  // Icône custom pour l'utilisateur (bleu)
  const userIcon = new L.Icon({
    iconUrl:
      'data:image/svg+xml;utf8,<svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg"><ellipse cx="16" cy="26" rx="6" ry="2" fill="%23000" fill-opacity="0.13"/><path d="M16 3C10.477 3 6 7.477 6 13c0 6.627 7.5 15 9.5 15S26 19.627 26 13c0-5.523-4.477-10-10-10zm0 13.5a3.5 3.5 0 1 1 0-7 3.5 3.5 0 0 1 0 7z" fill="%233498db" stroke="%231a4f7a" stroke-width="1.5"/><circle cx="16" cy="13.5" r="2" fill="%23fff"/></svg>',
    iconSize: [38, 38],
    iconAnchor: [19, 38],
    popupAnchor: [0, -38],
  });

  function InnerMapSection() {
    const map = useMap();
    // Effet pour centrer dynamiquement la carte sur l'utilisateur UNIQUEMENT la première fois où la position est dispo
    function CenterOnUser() {
      useEffect(() => {
        if (userLocation) {
          map.setView([userLocation.lat, userLocation.lng], map.getZoom(), { animate: true });
        }
      }, [userLocation, map]);
      return null;
    }

    // Bouton flottant pour recentrer sur la vue initiale (zoom/dimensions d'origine)
    function RecenterButton() {
      const handleClick = () => {
        if (userLocation) {
          map.setView([userLocation.lat, userLocation.lng], map.getZoom(), { animate: true });
        } else {
          // Si pas de position utilisateur, recentre sur Paris (ou centre par défaut)
          map.setView([48.8566, 2.3522], 12, { animate: true });
        }
      };
      return (
        <button
          onClick={handleClick}
          disabled={!userLocation}
          style={{
            position: 'absolute',
            bottom: 24,
            right: 24,
            zIndex: 1000,
            background: '#fff',
            border: '1px solid #ccc',
            borderRadius: '50%',
            width: 48,
            height: 48,
            boxShadow: '0 2px 8px rgba(0,0,0,0.13)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: userLocation ? 'pointer' : 'not-allowed',
            opacity: userLocation ? 1 : 0.5,
            pointerEvents: userLocation ? 'auto' : 'none',
          }}
          title="Recentrer sur votre position"
        >
          {/* Icône cible SVG */}
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#3498db" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="8"/><circle cx="12" cy="12" r="2"/><line x1="12" y1="2" x2="12" y2="6"/><line x1="12" y1="18" x2="12" y2="22"/><line x1="2" y1="12" x2="6" y2="12"/><line x1="18" y1="12" x2="22" y2="12"/></svg>
        </button>
      );
    }
    return <>
      <CenterOnUser />
      <RecenterButton />
      {/* Marker utilisateur */}
      {userLocation && (
        <>
          <Marker position={[userLocation.lat, userLocation.lng]} icon={userIcon}>
            <Popup>
              <span className="font-bold text-blue-700">Vous êtes ici</span>
            </Popup>
          </Marker>
          {/* Cercle de filtre de distance */}
          <Circle
            center={[userLocation.lat, userLocation.lng]}
            radius={distanceFilter * 1000}
            pathOptions={{ color: '#3498db', fillColor: '#3498db', fillOpacity: 0.12 }}
          />
        </>
      )}
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png"
      />
      {/* Markers producteurs filtrés par distance */}
      {producers.filter(prod => (prod.distance ?? 0) <= distanceFilter).map((prod, i) => (
        <Marker
          key={prod.id_seller || i}
          position={[prod.latitude, prod.longitude]}
          icon={customIcon}
          eventHandlers={{
            click: () => {
              map.setView([prod.latitude, prod.longitude], map.getZoom(), { animate: true });
            },
          }}
        >
          <Popup>
            <div className="font-bold text-green-700">{prod.seller_name}</div>
            <div className="text-xs text-gray-400 mt-1">{prod.distance} km</div>
            <div className="text-xs text-yellow-600 mt-1">Note : {prod.average_seller_rate} ⭐</div>
          </Popup>
        </Marker>
      ))}
    </>;
  }

  return (
    <MapContainer
      center={defaultCenter as [number, number]}
      zoom={12}
      className="h-full w-full rounded-xl relative z-[1]"
      scrollWheelZoom
    >
      <InnerMapSection />
    </MapContainer>
  );
}
