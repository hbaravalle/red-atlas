import * as maplibregl from 'maplibre-gl';
import workerUrl from 'maplibre-gl/dist/maplibre-gl-worker.mjs?url';

import 'maplibre-gl/dist/maplibre-gl.css';

// Vite moves the bundle, so MapLibre can't find its worker on its own
maplibregl.setWorkerUrl(workerUrl);

// Free OpenStreetMap tiles, no API key
export const MAP_STYLE = 'https://tiles.openfreemap.org/styles/liberty';

export { maplibregl };
