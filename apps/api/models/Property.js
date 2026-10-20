import { asc, desc, eq, ilike, or, sql } from 'drizzle-orm';
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
import db from '../config/db.js';

// DDL can't take bind parameters. Safe to inline: the values are our constants
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

// Sort keys map to columns, so user input never reaches the SQL. id breaks ties
const ORDER_BY = {
  price_asc: [asc(properties.price), asc(properties.id)],
  price_desc: [desc(properties.price), desc(properties.id)],
};
const DEFAULT_ORDER = [desc(properties.createdAt), desc(properties.id)];

// Any UUID version: ids are v7
const UUID_PATTERN =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

// null instead of NaN, so NOT NULL rejects bad input
function toNumber(value) {
  const number = Number(value);
  return value == null || value === '' || Number.isNaN(number) ? null : number;
}

// Match %, _ and \ literally, not as wildcards
function escapeLike(text) {
  return text.replace(/[\\%_]/g, '\\$&');
}

// Table row → API JSON
function toProperty(row) {
  const { id, lat, lng, price, area, ownerName, ownerContact, ...rest } = row;

  return {
    _id: id,
    ...rest,
    location: { lat, lng },
    price: toNumber(price),
    area: toNumber(area),
    owner: { name: ownerName, contact: ownerContact },
  };
}

// API JSON → table row. Undefined values fall back to the column defaults
function toRow(property) {
  const { location, owner, createdAt, updatedAt } = property;

  return {
    title: property.title,
    description: property.description,
    address: property.address,
    lat: toNumber(location?.lat),
    lng: toNumber(location?.lng),
    images: property.images,
    type: property.type,
    status: property.status,
    isActive: property.isActive,
    price: toNumber(property.price),
    area: toNumber(property.area),
    ownerName: owner?.name,
    ownerContact: owner?.contact,
    createdAt: createdAt ? new Date(createdAt) : undefined,
    updatedAt: updatedAt ? new Date(updatedAt) : undefined,
  };
}

async function findPage({ query, sort, page, limit }) {
  const pattern = query && `%${escapeLike(query)}%`;
  const where = pattern
    ? or(ilike(properties.title, pattern), ilike(properties.address, pattern))
    : undefined;

  const [rows, total] = await Promise.all([
    db
      .select()
      .from(properties)
      .where(where)
      .orderBy(...(ORDER_BY[sort] ?? DEFAULT_ORDER))
      .limit(limit)
      .offset((page - 1) * limit),
    db.$count(properties, where),
  ]);

  return { properties: rows.map(toProperty), total };
}

async function findById(id) {
  if (!UUID_PATTERN.test(id)) return null;

  const [row] = await db.select().from(properties).where(eq(properties.id, id));
  return row ? toProperty(row) : null;
}

async function count() {
  return db.$count(properties);
}

async function create(property) {
  const [row] = await db.insert(properties).values(toRow(property)).returning();
  return toProperty(row);
}

async function createMany(list) {
  await db.insert(properties).values(list.map(toRow));
}

async function destroy(id) {
  if (!UUID_PATTERN.test(id)) return false;

  const deleted = await db
    .delete(properties)
    .where(eq(properties.id, id))
    .returning({ id: properties.id });
  return deleted.length > 0;
}

async function destroyAll() {
  await db.delete(properties);
}

export default {
  findPage,
  findById,
  count,
  create,
  createMany,
  destroy,
  destroyAll,
};
