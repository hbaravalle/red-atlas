# Red Atlas — API

Express + MongoDB REST API for Red Atlas, with pagination, sorting and text search. Deployed on Vercel at `https://api-red-atlas-livid.vercel.app/api`.

See the [main README](../../README.md) for the endpoints, the reasoning behind the API and setup.

```bash
# from the repository root
pnpm dev:api   # http://localhost:3000/api/properties
pnpm seed      # load sample properties
```

| Env variable | Description |
|---|---|
| `DB_CONNECTION` | MongoDB connection string |
| `APP_PORT` | Port for local development (default `3000`) |

```
├── config/        # MongoDB connection
├── controllers/   # Request handlers
├── models/        # Mongoose schema (enums from @red-atlas/shared)
├── routes/        # Express router
├── seeders/       # Sample data + seeding script
├── server.js      # Entry point
└── vercel.json    # Serverless deployment config
```
