import { useEffect, useRef } from 'react';
import { useSelector } from 'react-redux';
import mapboxgl from 'mapbox-gl';
import { Property } from '../../types/property';

import 'mapbox-gl/dist/mapbox-gl.css';

const Mapbox = () => {
  const mapContainerRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<mapboxgl.Map | null>(null);
  const markersRef = useRef<mapboxgl.Marker[]>([]);

  const properties = useSelector(
    (state: { properties: { list: Property[] } }) => state.properties.list
  );

  useEffect(() => {
    if (!mapContainerRef.current) return;

    const mapWidth = window.innerWidth;
    const offset = (mapWidth * 0.1) / 100;

    if (!mapRef.current) {
      mapboxgl.accessToken = import.meta.env.VITE_MAPBOX_TOKEN;

      mapRef.current = new mapboxgl.Map({
        container: mapContainerRef.current,
        center: [-66.18364529517915 + offset, 18.21364781851135],
        zoom: 7,
      });
    }

    // Limpiar los marcadores previos
    markersRef.current.forEach((marker) => marker.remove());
    markersRef.current = []; // Resetear lista de marcadores

    // Crear nuevos marcadores
    for (const property of properties) {
      if (property.location?.lng && property.location?.lat) {
        const marker = new mapboxgl.Marker()
          .setLngLat([
            Number(property.location.lng),
            Number(property.location.lat),
          ])
          .addTo(mapRef.current);

        markersRef.current.push(marker);
      }
    }

    // No es necesario eliminar el mapa, solo los marcadores
    return () => {
      markersRef.current.forEach((marker) => marker.remove());
      markersRef.current = []; // Limpiar los marcadores cuando se desmonte el componente
    };
  }, [properties]);

  return (
    <div
      style={{ height: '100vh', width: '100vw' }}
      ref={mapContainerRef}
      className='map-container'
    />
  );
};

export default Mapbox;
