import 'dotenv/config';

import Property from '../models/Property.js';
import list from './properties.json' with { type: 'json' };

// One multi-row INSERT per batch instead of one request per property.
// 500 rows x 15 columns stays well under Postgres' 65,535 bind parameters.
const BATCH_SIZE = 500;

async function propertySeeder() {
  try {
    // Start from an empty table so the seeder can run more than once
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
