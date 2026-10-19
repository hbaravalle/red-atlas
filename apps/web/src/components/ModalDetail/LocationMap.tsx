import { useEffect, useRef } from 'react';
import { MAP_STYLE, maplibregl } from '../../lib/maplibre';

interface LocationMapProps {
  lat: number;
  lng: number;
}

// Small, non-interactive map centered on one property
export default function LocationMap({ lat, lng }: LocationMapProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const map = new maplibregl.Map({
      container: containerRef.current,
      style: MAP_STYLE,
      center: [lng, lat],
      zoom: 15,
      interactive: false,
      attributionControl: { compact: true },
    });
    new maplibregl.Marker().setLngLat([lng, lat]).addTo(map);

    // Each modal gets its own map, so free its WebGL context on close
    return () => map.remove();
  }, [lat, lng]);

  return (
    <div
      ref={containerRef}
      className='location-map'
      role='img'
      aria-label='Ubicación de la propiedad en el mapa'
    />
  );
}
