import { useEffect, useRef } from 'react';
import type { Property } from '@red-atlas/shared';
import { MAP_STYLE, maplibregl } from '../../lib/maplibre';
import { useGetPropertiesQuery } from '../../redux/propertiesApi';
import { useAppSelector } from '../../redux/store';

// Stable reference, so the markers effect doesn't rerun while loading
const NO_PROPERTIES: Property[] = [];

// Puerto Rico, Vieques and Culebra: every property is inside
const PUERTO_RICO_BOUNDS: maplibregl.LngLatBoundsLike = [
  [-67.3, 17.8],
  [-65.2, 18.5],
];
const GAP = 20;
// Below this, ignore the panels and use the whole map
const MIN_VISIBLE_SIZE = 150;

// Frame the island in the area the nav and the list leave uncovered.
// The list is a right column on desktop and a bottom sheet on mobile
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

  // Same arguments as PropertyList, so both share one request
  const listParams = useAppSelector((state) => state.properties);
  const { data } = useGetPropertiesQuery(listParams);
  const properties = data?.properties ?? NO_PROPERTIES;

  useEffect(() => {
    if (!mapContainerRef.current) return;

    if (!mapRef.current) {
      const map = new maplibregl.Map({
        container: mapContainerRef.current,
        style: MAP_STYLE,
        bounds: PUERTO_RICO_BOUNDS,
        fitBoundsOptions: { padding: getUncoveredPadding() },
      });

      // The panels resize with the window, so reframe the island
      map.on('resize', () => framePuertoRico(map));
      mapRef.current = map;
    }

    markersRef.current.forEach((marker) => marker.remove());
    markersRef.current = [];

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

    return () => {
      markersRef.current.forEach((marker) => marker.remove());
      markersRef.current = [];
    };
  }, [properties]);

  return <div ref={mapContainerRef} className='map-container' />;
};

export default InteractiveMap;
