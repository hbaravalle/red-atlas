import { useEffect, useRef } from 'react';
import { useSelector } from 'react-redux';
import * as maplibregl from 'maplibre-gl';
import type { Property } from '@red-atlas/shared';

import 'maplibre-gl/dist/maplibre-gl.css';

// Free OpenStreetMap vector tiles, no API key required
const MAP_STYLE = 'https://tiles.openfreemap.org/styles/liberty';

const InteractiveMap = () => {
  const mapContainerRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<maplibregl.Map | null>(null);
  const markersRef = useRef<maplibregl.Marker[]>([]);

  const properties = useSelector(
    (state: { properties: { list: Property[] } }) => state.properties.list
  );

  useEffect(() => {
    if (!mapContainerRef.current) return;

    const mapWidth = window.innerWidth;
    const offset = (mapWidth * 0.1) / 100;

    if (!mapRef.current) {
      mapRef.current = new maplibregl.Map({
        container: mapContainerRef.current,
        style: MAP_STYLE,
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
        const marker = new maplibregl.Marker()
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

export default InteractiveMap;
