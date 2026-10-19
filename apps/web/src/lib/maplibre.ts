import * as maplibregl from 'maplibre-gl';
import workerUrl from 'maplibre-gl/dist/maplibre-gl-worker.mjs?url';

import 'maplibre-gl/dist/maplibre-gl.css';

// MapLibre looks for its worker next to its own file, but Vite bundles the
// library elsewhere, so point it at the worker Vite serves as an asset.
maplibregl.setWorkerUrl(workerUrl);

// Free OpenStreetMap vector tiles, no API key required
export const MAP_STYLE = 'https://tiles.openfreemap.org/styles/liberty';

export { maplibregl };
