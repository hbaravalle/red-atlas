import 'dotenv/config';
import cors from 'cors';
import express from 'express';
import { ZodError } from 'zod';
import propertiesRoutes from './routes/propertyRoutes.js';

const PORT = process.env.APP_PORT || process.env.PORT || 3000;

const app = express();
app.use(
  cors({
    origin: '*',
  })
);
app.use(express.json());
// Serves the favicon locally; on Vercel the CDN does it
app.use(express.static('public'));

app.use('/api/properties', propertiesRoutes);

app.use(function (req, res) {
  return res.status(404).json({ message: 'Not found' });
});

// Express 5 sends errors from async handlers here. Every error is { message }
app.use(function (error, req, res, next) {
  if (error instanceof ZodError) {
    const message = error.issues.map((issue) => issue.message).join('; ');
    return res.status(400).json({ message });
  }

  // Malformed JSON, rejected by express.json()
  if (error.type === 'entity.parse.failed') {
    return res.status(400).json({ message: 'Invalid JSON body' });
  }

  console.error(error);
  return res.status(500).json({ message: 'Server error' });
});

// On Vercel the app runs as a function; listen only when run directly
if (!process.env.VERCEL) {
  app.listen(PORT, () => {
    console.log(`[Server] Listening on http://localhost:${PORT}`);
    console.log(`[Server] Properties: http://localhost:${PORT}/api/properties`);
  });
}

export default app;
