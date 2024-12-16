import { useEffect, useRef } from 'react';
import { useSelector } from 'react-redux';
import mapboxgl from 'mapbox-gl';
import { Property } from '../../types/property';

import 'mapbox-gl/dist/mapbox-gl.css';

const Mapbox = () => {
  const mapContainerRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<mapboxgl.Map | null>(null);

  const properties = useSelector(
    (state: { properties: { list: Property[] } }) => state.properties.list
  );

  useEffect(() => {
    if (!mapContainerRef.current) return;

    mapboxgl.accessToken = import.meta.env.VITE_MAPBOX_TOKEN;

    mapRef.current = new mapboxgl.Map({
      container: mapContainerRef?.current,
      center: [-66.18364529517915, 18.21364781851135],
      zoom: 8,
    });

    for (const property of properties) {
      new mapboxgl.Marker()
        .setLngLat([
          Number(property.location.lng),
          Number(property.location.lat),
        ])
        .addTo(mapRef.current);
    }

    // return () => {
    //   mapRef.current?.remove();
    // };
  }, []);

  return (
    <div
      style={{ height: '100vh', width: '100vw' }}
      ref={mapContainerRef}
      className='map-container'
    ></div>
  );
};

export default Mapbox;
