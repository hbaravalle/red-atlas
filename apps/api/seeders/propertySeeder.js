import 'dotenv/config';

import Property from '../models/Property.js';
import connectDB from '../config/mongoose.config.js';
import list from './list.js';

connectDB();

async function propertySeeder() {
  for (const property of list) {
    await Property.create(property);
  }

  console.log('[Seeder] Product created!');
  process.exit(1);
}

propertySeeder();
