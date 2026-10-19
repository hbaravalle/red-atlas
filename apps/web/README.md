# Red Atlas — Web app

React 18 + TypeScript front end for Red Atlas: property list with pagination, sorting and loading skeletons, MapLibre map (OpenFreeMap tiles, no API key), search, a property detail modal with a location map, and a create form.

See the [main README](../../README.md) for the full project, architecture and setup.

```bash
# from the repository root
pnpm dev:web
```

| Env variable | Description |
|---|---|
| `VITE_API_URL` | API base URL. Set it to `http://localhost:3000/api` to use the local API; defaults to production. Vite reads it on startup, so restart `pnpm dev` after changing it |

```
src/
├── components/   # InteractiveMap, ModalCreate, ModalDetail, Nav, PropertyList
├── lib/          # API base URL, MapLibre setup, number and date formats, UI labels
├── redux/        # Store, RTK Query API (server state), page and sort slice
└── services/     # Every request to the properties API, typed with the shared contract
```

## Adding an API call

Requests are split in two layers: the service talks to the API, and RTK Query decides when to fetch, what to cache and what to refetch.

1. Add a function to `services/properties.ts` that builds the URL and types the response with `@red-atlas/shared`.
2. Add an endpoint to `redux/propertiesApi.ts` whose `queryFn` calls it. Give it `providesTags`, or `invalidatesTags` for a mutation, so cached lists stay in sync.
3. Use the generated hook (`useXQuery` / `useXMutation`) in the component. Keep `fetch` out of components.
