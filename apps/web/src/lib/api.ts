// Base URL of the Red Atlas API. Point VITE_API_URL at http://localhost:3000/api
// to develop against the local API in apps/api; defaults to production.
export const API_URL: string =
  import.meta.env.VITE_API_URL ?? 'https://api-red-atlas-livid.vercel.app/api';
