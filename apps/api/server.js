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
// Files in public/ (the favicon). On Vercel the CDN serves them before the
// request reaches the app; locally express.static does it
app.use(express.static('public'));

app.use('/api/properties', propertiesRoutes);

app.get('*', function (req, res) {
  return res.status(404).json('Not found');
});

// On Vercel the exported app runs as a function and Vercel handles the port;
// listen only when running the server ourselves
if (!process.env.VERCEL) {
  app.listen(PORT, () => {
    console.log(`[Server] Listening on http://localhost:${PORT}`);
    console.log(`[Server] Properties: http://localhost:${PORT}/api/properties`);
  });
}

export default app;
