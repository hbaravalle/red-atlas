import { useEffect, useRef } from 'react';
import mapboxgl from 'mapbox-gl';

import 'mapbox-gl/dist/mapbox-gl.css';

const Mapbox = () => {
  const mapContainerRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<mapboxgl.Map | null>(null);

  useEffect(() => {
    if (!mapContainerRef.current) return; // Verifica que el contenedor exista antes de continuar

    mapboxgl.accessToken = import.meta.env.VITE_MAPBOX_TOKEN;

    mapRef.current = new mapboxgl.Map({
      container: mapContainerRef?.current,
      center: [-66.18364529517915, 18.21364781851135],
      zoom: 8,
    });

    // Agregar marcadores
    new mapboxgl.Marker()
      .setLngLat([-66.492857, 18.449804])
      .addTo(mapRef.current);
    new mapboxgl.Marker()
      .setLngLat([-65.255856, 18.231558])
      .addTo(mapRef.current);
    new mapboxgl.Marker()
      .setLngLat([-66.77331, 17.971569])
      .addTo(mapRef.current);

    // return () => {
    //   mapRef.current?.remove();
    // };
  }, []);

  return (
    <div
      style={{ height: '100vh', width: '100vw' }}
      ref={mapContainerRef}
      className='map-container'
    />
  );
};

export default Mapbox;
