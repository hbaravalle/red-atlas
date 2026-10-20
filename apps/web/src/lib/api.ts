// Defaults to production. For the local API, set
// VITE_API_URL=http://localhost:3000/api
export const API_URL: string =
  import.meta.env.VITE_API_URL ?? 'https://red-atlas-api.vercel.app/api';
