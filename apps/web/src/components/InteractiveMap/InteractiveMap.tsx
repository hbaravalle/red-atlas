import { useEffect, useRef } from 'react';
import { useSelector } from 'react-redux';
import * as maplibregl from 'maplibre-gl';
import workerUrl from 'maplibre-gl/dist/maplibre-gl-worker.mjs?url';
import type { Property } from '@red-atlas/shared';

import 'maplibre-gl/dist/maplibre-gl.css';

// MapLibre looks for its worker next to its own file, but Vite bundles the
// library elsewhere, so point it at the worker Vite serves as an asset.
maplibregl.setWorkerUrl(workerUrl);

// Free OpenStreetMap vector tiles, no API key required
const MAP_STYLE = 'https://tiles.openfreemap.org/styles/liberty';

// Puerto Rico with Vieques and Culebra; every property in the dataset is inside
const PUERTO_RICO_BOUNDS: maplibregl.LngLatBoundsLike = [
  [-67.3, 17.8],
  [-65.2, 18.5],
];
const GAP = 20;
// Below this, the free area is too small to frame the island in
const MIN_VISIBLE_SIZE = 150;

// The search bar and the property list float over the map. Measure them so
// Puerto Rico is framed in the area they leave uncovered: the list is a column
// on the right on desktop and a sheet at the bottom on smaller screens.
function getUncoveredPadding(): maplibregl.PaddingOptions {
  const padding = { top: GAP, right: GAP, bottom: GAP, left: GAP };
  const nav = document.querySelector('header nav');
  const list = document.getElementById('propertyList');

  if (nav) {
    padding.top = nav.getBoundingClientRect().bottom + GAP;
  }

  if (list) {
    const rect = list.getBoundingClientRect();
    const isSideColumn = rect.left > window.innerWidth / 3;

    if (isSideColumn) {
      padding.right = window.innerWidth - rect.left + GAP;
    } else {
      padding.bottom = window.innerHeight - rect.top + GAP;
    }
  }

  if (window.innerWidth - padding.left - padding.right < MIN_VISIBLE_SIZE) {
    padding.right = GAP;
  }
  if (window.innerHeight - padding.top - padding.bottom < MIN_VISIBLE_SIZE) {
    padding.top = GAP;
    padding.bottom = GAP;
  }

  return padding;
}

function framePuertoRico(map: maplibregl.Map) {
  map.fitBounds(PUERTO_RICO_BOUNDS, {
    padding: getUncoveredPadding(),
    duration: 0,
  });
}

const InteractiveMap = () => {
  const mapContainerRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<maplibregl.Map | null>(null);
  const markersRef = useRef<maplibregl.Marker[]>([]);

  const properties = useSelector(
    (state: { properties: { list: Property[] } }) => state.properties.list
  );

  useEffect(() => {
    if (!mapContainerRef.current) return;

    if (!mapRef.current) {
      const map = new maplibregl.Map({
        container: mapContainerRef.current,
        style: MAP_STYLE,
        bounds: PUERTO_RICO_BOUNDS,
        fitBoundsOptions: { padding: getUncoveredPadding() },
      });

      // The panels change size with the window, so frame the island again
      map.on('resize', () => framePuertoRico(map));
      mapRef.current = map;
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
