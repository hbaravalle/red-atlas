# Red Atlas — Property Finder

A responsive real estate app to browse, search and publish property listings on an interactive map — with the REST API I designed to power it. Built as my solution to the **Red Atlas Front-End Challenge**.

**🚀 [Live demo](https://mid-frontend-challenge.vercel.app/)** · **🔌 [API](https://api-red-atlas-livid.vercel.app/api/properties)**

![React](https://img.shields.io/badge/React_18-20232A?style=flat-square&logo=react&logoColor=61DAFB)
![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=flat-square&logo=typescript&logoColor=white)
![Redux Toolkit](https://img.shields.io/badge/Redux_Toolkit-764ABC?style=flat-square&logo=redux&logoColor=white)
![MapLibre](https://img.shields.io/badge/MapLibre_GL-396CB2?style=flat-square&logo=maplibre&logoColor=white)
![Node.js](https://img.shields.io/badge/Node.js-339933?style=flat-square&logo=nodedotjs&logoColor=white)
![Express](https://img.shields.io/badge/Express-000000?style=flat-square&logo=express&logoColor=white)
![MongoDB](https://img.shields.io/badge/MongoDB-47A248?style=flat-square&logo=mongodb&logoColor=white)
![pnpm](https://img.shields.io/badge/pnpm_workspaces-F69220?style=flat-square&logo=pnpm&logoColor=white)

<!-- TIP: add a screenshot or GIF here, e.g. ![Red Atlas](./docs/demo.gif) -->

## The challenge

Build a front end to list, manage and locate real estate properties: React + TypeScript, global state, routing, a responsive layout and an interactive map. The challenge shipped with a static dataset of **10,000 properties** (`apps/api/seeders/properties.json`), which seeds the API's database.

## The key decision: build my own API

Sorting, paginating and searching 10,000 records in the browser means downloading all of them up front and doing the heavy lifting on the user's device — slow on first load and worse on phones.

So I moved that work to the server. I designed a small REST API with Node.js, Express and MongoDB Atlas that handles **pagination, sorting and text search** and returns exactly one page at a time, with the metadata the UI needs (`totalPages`, `prevPage`, `nextPage`). The front end stays thin: it asks for a page and renders it.

This repo keeps both halves together, so the whole story — and the contract between them — lives in one place.

## ✨ Features

**Web app** (`apps/web`)
- Property list with server-side pagination and sorting by date or price
- Interactive map (MapLibre GL + free OpenStreetMap tiles from OpenFreeMap, no API key) with a marker for every listed property
- Search by title or address, resolved by the API
- Property detail as a routed modal (`/detail/:id`), so every property has a shareable URL
- Create a property (`/create`) with a form validated by React Hook Form
- Toast feedback and a fully responsive layout

**API** (`apps/api`)
- Paginated listing with navigation metadata
- Sorting by newest, price ascending or price descending
- Case-insensitive search across title and address
- Create and delete endpoints, plus a seeder with sample data
- Serverless deployment on Vercel, database on MongoDB Atlas

## 🧱 Architecture

```
red-atlas/
├── apps/
│   ├── web/          # React 18 + TypeScript + Vite + Redux Toolkit + MapLibre
│   └── api/          # Node.js + Express + Mongoose
├── packages/
│   └── shared/       # Property domain shared by both apps
└── pnpm-workspace.yaml
```

**One source of truth for the domain.** `@red-atlas/shared` defines the property types (`apartment`, `house`, `office`, `land`), statuses (`sale`, `rent`), sort options and page size, plus the TypeScript types for a `Property` and the paginated response.

- The **API** uses those values as its Mongoose enums, so it rejects anything outside them.
- The **web app** uses the same values for its types and UI labels. The label maps are typed as `Record<PropertyType, string>`, so adding a new property type to the shared package makes TypeScript flag every place in the UI that needs a label.

The package is plain JavaScript with hand-written type declarations, so the API runs on Node without a build step and the web app still gets full types.

**State and routing.** Redux Toolkit holds the property list and modal state. Routes drive the modals, so the browser's back button works as users expect.

## 📖 API reference

Base URL: `https://api-red-atlas-livid.vercel.app/api`

| Method | Route | Description |
|---|---|---|
| `GET` | `/properties` | List properties (paginated) |
| `GET` | `/properties/search` | Search by title or address |
| `GET` | `/properties/:id` | Get a single property |
| `POST` | `/properties` | Create a property |
| `POST` | `/properties/count` | Total number of properties |
| `DELETE` | `/properties/:id` | Delete a property |

Query parameters for listing and search:

| Param | Default | Description |
|---|---|---|
| `page` | `1` | Page number |
| `limit` | `10` | Items per page |
| `sort` | newest first | `price_asc` or `price_desc` |
| `query` | — | **Required for `/search`**: text to match in title or address |

```bash
curl "https://api-red-atlas-livid.vercel.app/api/properties/search?query=suite&sort=price_asc&limit=5"
```

## 🚀 Running locally

**Prerequisites:** Node.js 20+, [pnpm](https://pnpm.io/installation), a MongoDB connection string ([Atlas](https://www.mongodb.com/atlas) free tier works). The map needs no API key.

```bash
git clone https://github.com/hbaravalle/red-atlas.git
cd red-atlas
pnpm install

# Environment variables
cp apps/api/.env.example apps/api/.env   # set DB_CONNECTION
cp apps/web/.env.example apps/web/.env   # optional: VITE_API_URL

# Load sample data (optional)
pnpm seed

# Run the API (localhost:3000) and the web app (localhost:5173) together
pnpm dev
```

`VITE_API_URL` in `apps/web/.env` points the web app at the local API. Remove it to use the production API instead — handy if you only want to work on the front end.

| Script | Description |
|---|---|
| `pnpm dev` | Run web and API in parallel |
| `pnpm dev:web` / `pnpm dev:api` | Run one app |
| `pnpm build` | Type-check and build the web app |
| `pnpm lint` | Lint the web app |
| `pnpm seed` | Seed MongoDB with sample properties |

## ☁️ Deployment

Both apps deploy to Vercel as two projects from this repository:

| Project | Root directory | Notes |
|---|---|---|
| Web | `apps/web` | Framework preset: Vite. No env vars required |
| API | `apps/api` | Uses `apps/api/vercel.json`. Env: `DB_CONNECTION` |

## 🗺️ Roadmap

- [ ] Edit-property form and `PUT /properties/:id` (route reserved, handler pending)
- [ ] Advanced filters (type, status, price range) on both API and UI
- [ ] Request validation and consistent error responses in the API
- [ ] Custom hooks to share data-fetching logic in the web app
- [ ] Code-split MapLibre to shrink the initial bundle

## 👤 Author

**Hernán Baravalle** — Design Engineer
[GitHub](https://github.com/hbaravalle)
