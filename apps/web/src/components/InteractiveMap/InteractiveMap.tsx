import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router';
import type { Property } from '@red-atlas/shared';
import { formatArea, formatPrice } from '../../lib/format';
import { PROPERTY_STATUS_LABELS, PROPERTY_TYPE_LABELS } from '../../lib/labels';
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

// Keeps the tooltip clear of the pin, whichever side it opens on
const TOOLTIP_OFFSET: maplibregl.Offset = {
  top: [0, 8],
  bottom: [0, -44],
  left: [16, -22],
  right: [-16, -22],
  'top-left': [8, 8],
  'top-right': [-8, 8],
  'bottom-left': [8, -40],
  'bottom-right': [-8, -40],
  center: [0, 0],
};

// textContent, not HTML: titles come from users
function tooltipContent(property: Property) {
  const content = document.createElement('div');
  const title = document.createElement('p');
  const details = document.createElement('p');

  title.className = 'title';
  title.textContent = property.title;
  details.textContent = [
    formatPrice(property.price),
    PROPERTY_TYPE_LABELS[property.type],
    PROPERTY_STATUS_LABELS[property.status],
    property.area ? formatArea(property.area) : null,
  ]
    .filter(Boolean)
    .join(' · ');

  content.append(title, details);
  return content;
}

const InteractiveMap = () => {
  const mapContainerRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<maplibregl.Map | null>(null);
  const markersRef = useRef(new Map<string, maplibregl.Marker>());
  const [tooltip] = useState(
    () =>
      new maplibregl.Popup({
        closeButton: false,
        closeOnClick: false,
        offset: TOOLTIP_OFFSET,
        className: 'pin-tooltip',
      })
  );

  // useNavigate changes with the location; a ref keeps the markers from
  // being rebuilt on every route change
  const navigate = useNavigate();
  const navigateRef = useRef(navigate);
  useEffect(() => {
    navigateRef.current = navigate;
  }, [navigate]);

  // Same arguments as PropertyList, so both share one request
  const listParams = useAppSelector((state) => state.properties);
  const { data } = useGetPropertiesQuery(listParams);
  const properties = data?.properties ?? NO_PROPERTIES;
  const highlightedId = useAppSelector((state) => state.highlight.id);

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

    const map = mapRef.current;
    const markers = markersRef.current;

    for (const property of properties) {
      if (property.location?.lng && property.location?.lat) {
        const lngLat: maplibregl.LngLatLike = [
          Number(property.location.lng),
          Number(property.location.lat),
        ];
        const marker = new maplibregl.Marker().setLngLat(lngLat).addTo(map);
        const pin = marker.getElement();

        const showTooltip = () =>
          tooltip
            .setLngLat(lngLat)
            .setDOMContent(tooltipContent(property))
            .addTo(map);
        const openDetail = () => navigateRef.current(`/detail/${property._id}`);

        // A focusable button, so the pin works from the keyboard too
        pin.tabIndex = 0;
        pin.setAttribute('role', 'button');
        pin.setAttribute('aria-label', `Open ${property.title}`);
        pin.addEventListener('mouseenter', showTooltip);
        pin.addEventListener('focus', showTooltip);
        pin.addEventListener('mouseleave', () => tooltip.remove());
        pin.addEventListener('blur', () => tooltip.remove());
        pin.addEventListener('click', openDetail);
        pin.addEventListener('keydown', (event) => {
          if (event.key === 'Enter' || event.key === ' ') {
            event.preventDefault();
            openDetail();
          }
        });

        markers.set(property._id, marker);
      }
    }

    return () => {
      tooltip.remove();
      markers.forEach((marker) => marker.remove());
      markers.clear();
    };
  }, [properties, tooltip]);

  // Runs after the markers effect, so new markers get the class too
  useEffect(() => {
    markersRef.current.forEach((marker, id) => {
      marker.getElement().classList.toggle('active', id === highlightedId);
    });
  }, [properties, highlightedId]);

  return <div ref={mapContainerRef} className='map-container' />;
};

export default InteractiveMap;
