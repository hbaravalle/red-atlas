import 'dotenv/config';
import cors from 'cors';
import express from 'express';
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
  return res.status(404).json('Not found');
});

// Postgres errors caused by bad input (not null, check, bad text, out of range)
const INVALID_DATA_CODES = ['23502', '23514', '22P02', '22003'];

// Express 5 sends errors from async handlers here
app.use(function (error, req, res, next) {
  if (INVALID_DATA_CODES.includes(error.cause?.code)) {
    return res.status(400).json({ message: error.cause.message });
  }

  // Malformed JSON, rejected by express.json()
  if (error.type === 'entity.parse.failed') {
    return res.status(400).json({ message: 'Invalid JSON body' });
  }

  console.error(error);
  return res.status(500).json('Server error');
});

// On Vercel the app runs as a function; listen only when run directly
if (!process.env.VERCEL) {
  app.listen(PORT, () => {
    console.log(`[Server] Listening on http://localhost:${PORT}`);
    console.log(`[Server] Properties: http://localhost:${PORT}/api/properties`);
  });
}

export default app;
