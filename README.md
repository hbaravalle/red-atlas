# Red Atlas — Property Finder

A responsive real estate app to browse, search and publish property listings on an interactive map — with the REST API I designed to power it. Built as my solution to the **Red Atlas Front-End Challenge**.

**🚀 [Live demo](https://red-atlas-web.vercel.app/)** · **🔌 [API](https://red-atlas-api.vercel.app/api/properties)**

![React](https://img.shields.io/badge/React_18-20232A?style=flat-square&logo=react&logoColor=61DAFB)
![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=flat-square&logo=typescript&logoColor=white)
![Redux Toolkit](https://img.shields.io/badge/Redux_Toolkit-764ABC?style=flat-square&logo=redux&logoColor=white)
![MapLibre](https://img.shields.io/badge/MapLibre_GL-396CB2?style=flat-square&logo=maplibre&logoColor=white)
![Node.js](https://img.shields.io/badge/Node.js-339933?style=flat-square&logo=nodedotjs&logoColor=white)
![Express](https://img.shields.io/badge/Express_5-000000?style=flat-square&logo=express&logoColor=white)
![Zod](https://img.shields.io/badge/Zod-3E67B1?style=flat-square&logo=zod&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-4169E1?style=flat-square&logo=postgresql&logoColor=white)
![Neon](https://img.shields.io/badge/Neon-00E599?style=flat-square&logo=neon&logoColor=black)
![Drizzle ORM](https://img.shields.io/badge/Drizzle_ORM-C5F74F?style=flat-square&logo=drizzle&logoColor=black)
![pnpm](https://img.shields.io/badge/pnpm_workspaces-F69220?style=flat-square&logo=pnpm&logoColor=white)

<!-- TIP: add a screenshot or GIF here, e.g. ![Red Atlas](./docs/demo.gif) -->

## The challenge

Build a front end to list, manage and locate real estate properties: React + TypeScript, global state, routing, a responsive layout and an interactive map. The challenge shipped with a static dataset of **10,000 properties** (`apps/api/seeders/properties.json`), which seeds the API's database.

The challenge only required the front end. Building a back end to serve the data was listed as an **optional extra**, one that Red Atlas said would add value to the solution.

## 🧑‍💻 User stories

- As a house hunter, I want to **browse listings page by page**, sorted by newest or by price, so I can scan 10,000 properties without waiting for all of them to load.
- As a house hunter, I want to **see the listed properties on a map**, so I understand where each one is.
- As a house hunter, I want to **search by title or address** and jump straight to a match.
- As a house hunter, I want to **open a property's detail**: photo, location, price per square foot, description and owner contact, so I can decide whether to get in touch.
- As a house hunter, I want **every property to have its own URL**, so I can share it or come back to it, and close it with the browser's back button.
- As an owner or agent, I want to **publish a new property** with a form that tells me what's missing before I submit it.
- As a developer, I want a **documented REST API** with pagination, sorting and search, so another client can use the same data.

## Design & interaction

**The map frames what you can actually see.** The list and the panels cover part of the screen, so centering the map on Puerto Rico would hide half the island behind them. The map measures the space they leave free and fits the island inside it. When the panels would leave too little room, as on small screens, it ignores them and uses the whole map.

**Loading looks like the content.** While a page of properties or a detail loads, skeleton cards with the same layout take its place, so the screen doesn't jump when the data arrives.

**Every view has a URL.** The property detail and the create form are routed modals (`/detail/:id`, `/create`). A property can be shared or bookmarked, the browser's back button closes the modal, and Escape does too.

**A search that guides you.** Results appear as you type, the search asks for at least three characters before querying, and it closes when you click outside it. Escape or the clear button empties it and keeps the focus in the input, so you can type the next search right away.

**Errors that say what to fix.** The create form checks every field before sending anything, and each problem shows up next to its field. If the API still rejects the data, the toast shows the API's own reason instead of a generic "something went wrong".

## The key decision: build my own API

I took on that extra because the dataset made the case for it. Sorting, paginating and searching 10,000 records in the browser means downloading all of them up front and doing the heavy lifting on the user's device — slow on first load and worse on phones.

So I moved that work to the server. I designed a small REST API with Node.js, Express and Postgres that handles **pagination, sorting and text search** and returns exactly one page at a time, with the metadata the UI needs (`totalPages`, `prevPage`, `nextPage`). The front end stays thin: it asks for a page and renders it.

This repo keeps both halves together, so the whole story — and the contract between them — lives in one place.

## From MongoDB to Postgres

The API first ran on MongoDB Atlas with Mongoose. I later moved it to **Postgres on [Neon](https://neon.com)** with **[Drizzle ORM](https://orm.drizzle.team)**, without changing the API contract, so the web app did not have to change.

- **The data is relational and fixed in shape.** Every property has the same fields, so a table with typed columns and constraints fits better than documents.
- **The database enforces the rules.** `NOT NULL` and `CHECK` constraints reject bad data no matter where it comes from, not only requests that go through the app.
- **Exact numbers where they matter.** Price and area are stored as `numeric`, so price per square foot is never off by a rounding error.
- **Built for serverless.** Neon's HTTP driver sends each query as a request, so there are no connections to open or leak from Vercel functions, and the database scales to zero when the demo is idle.
- **Versioned migrations.** Drizzle generates the SQL for each schema change, so the database history lives in the repo next to the code.

## ✨ Features

**Web app** (`apps/web`)
- Property list with server-side pagination, sorting by date or price, and skeleton cards while a page loads
- Interactive map (MapLibre GL + free OpenStreetMap tiles from OpenFreeMap, no API key) with a marker for every listed property, framed on Puerto Rico in the area the panels leave visible
- Search by title or address, resolved by the API, with a clear button and keyboard support
- Property detail as a routed modal (`/detail/:id`), so every property has a shareable URL: photo, location map, key facts including price per square foot, description and owner contact
- Create a property (`/create`) with a form validated by React Hook Form
- Toast feedback and a fully responsive layout

**API** (`apps/api`)
- Paginated listing with navigation metadata, with page size capped at 100
- Sorting by newest, price ascending or price descending, with a tiebreaker so pages stay stable
- Case-insensitive search across title and address, with `%` and `_` matched literally
- Requests validated with Zod: invalid data gets a `400` that names each problem, unknown ids a `404`, and every error has the same `{ message }` shape
- Batched seeder that loads the 10,000-property dataset
- Serverless deployment on Vercel, database on Neon

## 🧱 Architecture

```
red-atlas/
├── apps/
│   ├── web/          # React 18 + TypeScript + Vite + Redux Toolkit + MapLibre
│   └── api/          # Node.js + Express + Drizzle ORM + Neon Postgres
├── packages/
│   └── shared/       # Property domain shared by both apps
└── pnpm-workspace.yaml
```

**One source of truth for the domain.** `@red-atlas/shared` defines the property types (`apartment`, `house`, `office`, `land`), statuses (`sale`, `rent`), sort options and page size, plus the TypeScript types for a `Property` and the paginated response.

- The **API** validates requests against those values and turns them into `CHECK` constraints in the database, so nothing outside them can be stored.
- The **web app** uses the same values for its types and UI labels. The label maps are typed as `Record<PropertyType, string>`, so adding a new property type to the shared package makes TypeScript flag every place in the UI that needs a label.

The package is plain JavaScript with hand-written type declarations, so the API runs on Node without a build step and the web app still gets full types.

**Layers in the API.** Routes map URLs to the controller, which only deals with HTTP: reading the request and choosing the status code. Zod schemas (`schemas/propertySchema.js`) validate the body and the query params, and when one fails, a single error handler answers `400`, so no handler needs its own checks or `try/catch`. Every query lives in the model (`models/Property.js`), next to the Drizzle table definition and the mapping between table rows and the JSON the web app expects.

**State and routing.** The web app keeps server state and client state apart. **RTK Query** caches every API response by its arguments: the list, the map and the detail modal ask for the same page and share one request, and creating a property invalidates the cached lists so the page on screen reloads by itself. A small Redux slice holds the only client state the components share: the page and sort the user picked. All requests go through one service module (`src/services/properties.ts`) that builds the URLs and types the responses with the shared contract. Routes drive the modals, so the browser's back button works as users expect.

## 📖 API reference

Base URL: `https://red-atlas-api.vercel.app/api`

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
| `limit` | `10` | Items per page, up to `100` |
| `sort` | newest first | `price_asc` or `price_desc` |
| `query` | — | **Required for `/search`**: text to match in title or address |

Invalid `page`, `limit` or `sort` values fall back to the defaults. Every error answers `{ "message": "..." }`:

- `400` when the body of `POST /properties` breaks a rule, listing every problem: `"title is required; price must be a number"`. Numbers can be sent as strings, as form inputs do. `/search` without `query` also answers `400`.
- `404` when no property has the id in `GET` or `DELETE /properties/:id`, or the route doesn't exist.

```bash
curl "https://red-atlas-api.vercel.app/api/properties/search?query=suite&sort=price_asc&limit=5"
```

## 🚀 Running locally

**Prerequisites:** Node.js 20+, [pnpm](https://pnpm.io/installation) and a Postgres connection string. A [Neon](https://neon.com) free project works; a separate Neon branch for development keeps production data untouched. The map needs no API key.

```bash
git clone https://github.com/hbaravalle/red-atlas.git
cd red-atlas
pnpm install

# Environment variables
cp apps/api/.env.example apps/api/.env   # set DATABASE_URL
cp apps/web/.env.example apps/web/.env   # optional: VITE_API_URL

# Create the table, then load the 10,000 properties
pnpm migrate
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
| `pnpm migrate` | Apply pending database migrations |
| `pnpm seed` | Replace the table contents with the 10,000-property dataset |
| `pnpm migrate:prod` / `pnpm seed:prod` | The same against production, using `apps/api/.env.production.local` |

## ☁️ Deployment

Both apps deploy to Vercel as two projects from this repository:

| Project | Root directory | Notes |
|---|---|---|
| Web | `apps/web` | Framework preset: Vite. `vercel.json` sends every route to `index.html`, so `/detail/:id` works on reload. Env: `VITE_API_URL` |
| API | `apps/api` | Framework preset: Express, no config file: Vercel runs the app `server.js` exports as a function. Env: `DATABASE_URL` (Neon `main` branch) |

Vercel installs from the workspace root, so both apps resolve `@red-atlas/shared`. Pushes to `main` deploy to production; any other branch gets a preview URL.

Each environment has its own database, through Neon branches:

| Where | `DATABASE_URL` points at |
|---|---|
| Local (`apps/api/.env`) and Vercel **Preview** | Neon `dev` branch |
| Vercel **Production** and `apps/api/.env.production.local` | Neon `main` branch |

Migrations are not run on deploy. Before merging a schema change to `main`, run `pnpm migrate:prod`.

## 👤 Author

**Hernán Baravalle** — Design Engineer · Buenos Aires, Argentina
[Portfolio](https://hernanbaravalle.com) · [GitHub](https://github.com/hbaravalle)
