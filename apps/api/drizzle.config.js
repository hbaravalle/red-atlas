import 'dotenv/config';
import { defineConfig } from 'drizzle-kit';

export default defineConfig({
  dialect: 'postgresql',
  schema: './models/Property.js',
  out: './migrations',
  dbCredentials: {
    url: process.env.DATABASE_URL,
  },
});
