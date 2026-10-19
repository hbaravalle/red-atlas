# Red Atlas — Web app

React 18 + TypeScript front end for Red Atlas: property list with pagination, sorting and loading skeletons, MapLibre map (OpenFreeMap tiles, no API key), search, a property detail modal with a location map, and a create form.

See the [main README](../../README.md) for the full project, architecture and setup.

```bash
# from the repository root
pnpm dev:web
```

| Env variable | Description |
|---|---|
| `VITE_API_URL` | API base URL. Defaults to the production API |

```
src/
├── components/   # InteractiveMap, ModalCreate, ModalDetail, Nav, PropertyList
├── lib/          # API base URL, MapLibre setup, number and date formats, UI labels
├── redux/        # Store, properties & modal slices
└── types/        # App-only types (modal state)
```
