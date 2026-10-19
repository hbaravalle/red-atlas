import { sql } from 'drizzle-orm';
import {
  boolean,
  check,
  doublePrecision,
  index,
  numeric,
  snakeCase,
  text,
  timestamp,
  uuid,
} from 'drizzle-orm/pg-core';
import { PROPERTY_STATUSES, PROPERTY_TYPES } from '@red-atlas/shared';

// DDL can't take bind parameters, so the allowed values are inlined as SQL
// literals. Safe here: they come from our own constants, never from user input.
const oneOf = (column, values) =>
  sql`${column} IN (${sql.raw(values.map((value) => `'${value}'`).join(', '))})`;

export const properties = snakeCase.table(
  'properties',
  {
    id: uuid()
      .primaryKey()
      .default(sql`uuidv7()`),
    title: text().notNull(),
    description: text(),
    address: text(),
    lat: doublePrecision().notNull(),
    lng: doublePrecision().notNull(),
    images: text()
      .array()
      .notNull()
      .default(sql`'{}'`),
    type: text().notNull(),
    status: text().notNull(),
    isActive: boolean().notNull().default(true),
    price: numeric({ precision: 12, scale: 2 }).notNull(),
    area: numeric({ precision: 10, scale: 2 }),
    ownerName: text(),
    ownerContact: text(),
    createdAt: timestamp({ withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp({ withTimezone: true })
      .notNull()
      .defaultNow()
      .$onUpdate(() => new Date()),
  },
  (table) => [
    check('properties_type_check', oneOf(table.type, PROPERTY_TYPES)),
    check('properties_status_check', oneOf(table.status, PROPERTY_STATUSES)),
    index('properties_created_at_idx').on(table.createdAt),
    index('properties_price_idx').on(table.price),
  ],
);
