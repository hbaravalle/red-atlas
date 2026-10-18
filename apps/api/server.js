import 'dotenv/config';
import cors from 'cors';
import express from 'express';
import connectDB from './config/mongoose.config.js';
import propertiesRoutes from './routes/propertyRoutes.js';

const PORT = process.env.PORT || 3000;

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

app.listen(process.env.APP_PORT, () => {
  console.log('Servidor corriendo en el puerto 3000');
});
