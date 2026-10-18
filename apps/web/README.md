# Red Atlas — Web app

React 18 + TypeScript front end for Red Atlas: property list with pagination and sorting, Mapbox map, search, detail modal and create form.

See the [main README](../../README.md) for the full project, architecture and setup.

```bash
# from the repository root
pnpm dev:web
```

| Env variable | Description |
|---|---|
| `VITE_MAPBOX_TOKEN` | Mapbox access token (required for the map) |
| `VITE_API_URL` | API base URL. Defaults to the production API |

```
src/
├── components/   # InteractiveMap, ModalCreate, ModalDetail, Nav, PropertyList
├── lib/          # API base URL, UI labels for shared domain values
├── redux/        # Store, properties & modal slices
└── types/        # App-only types (modal state)
```
