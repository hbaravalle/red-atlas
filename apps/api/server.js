import 'dotenv/config';
import cors from 'cors';
import express from 'express';
import connectDB from './config/mongoose.config.js';
import propertiesRoutes from './routes/propertyRoutes.js';

const PORT = process.env.APP_PORT || process.env.PORT || 3000;

const app = express();
app.use(
  cors({
    origin: '*',
  })
);
app.use(express.json());
connectDB();

app.use('/api/properties', propertiesRoutes);

app.get('*', function (req, res) {
  return res.status(404).json('Not found');
});

app.listen(PORT, () => {
  console.log(`[Server] API running at http://localhost:${PORT}/api/properties`);
});
