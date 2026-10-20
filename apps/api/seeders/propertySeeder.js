import 'dotenv/config';

import Property from '../models/Property.js';
import list from './properties.json' with { type: 'json' };

// 500 rows x 15 columns stays under Postgres' 65,535 bind parameters
const BATCH_SIZE = 500;

async function propertySeeder() {
  try {
    // Empty the table so the seeder can run again
    await Property.destroyAll();

    for (let start = 0; start < list.length; start += BATCH_SIZE) {
      await Property.createMany(list.slice(start, start + BATCH_SIZE));
    }

    console.log(`[Seeder] ${list.length} properties created!`);
    process.exit(0);
  } catch (error) {
    console.log('[Seeder] Seeding error');
    console.log(error);
    process.exit(1);
  }
}

propertySeeder();
