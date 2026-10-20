import { z } from 'zod';
import {
  DEFAULT_PAGE_SIZE,
  PROPERTY_STATUSES,
  PROPERTY_TYPES,
  SORT_OPTIONS,
} from '@red-atlas/shared';

const MAX_PAGE_SIZE = 100;

// Form inputs send numbers as strings
const numeric = (schema) =>
  z.preprocess(
    (value) =>
      typeof value === 'string' && value.trim() !== '' ? Number(value) : value,
    schema
  );

const typeError = (name, expected) => (issue) =>
  issue.input === undefined || issue.input === ''
    ? `${name} is required`
    : `${name} must be ${expected}`;

const number = (name) => z.number({ error: typeError(name, 'a number') });

const text = (name) => z.string({ error: typeError(name, 'text') });

// Form inputs send an empty field as ''
const optional = (schema) =>
  z.preprocess((value) => (value === '' ? undefined : value), schema.optional());

export const newProperty = z.object(
  {
    title: text('title').trim().min(1, 'title is required'),
    description: optional(text('description')),
    address: optional(text('address')),
    location: z.object(
      {
        lat: numeric(
          number('location.lat')
            .min(-90, 'location.lat must be between -90 and 90')
            .max(90, 'location.lat must be between -90 and 90')
        ),
        lng: numeric(
          number('location.lng')
            .min(-180, 'location.lng must be between -180 and 180')
            .max(180, 'location.lng must be between -180 and 180')
        ),
      },
      { error: 'location is required' }
    ),
    images: z
      .array(z.url({ error: 'images must be URLs' }), {
        error: 'images must be a list of URLs',
      })
      .optional(),
    type: z.enum(PROPERTY_TYPES, {
      error: `type must be one of: ${PROPERTY_TYPES.join(', ')}`,
    }),
    status: z.enum(PROPERTY_STATUSES, {
      error: `status must be one of: ${PROPERTY_STATUSES.join(', ')}`,
    }),
    isActive: z.boolean({ error: 'isActive must be true or false' }).optional(),
    // Maximums match the numeric(12,2) and numeric(10,2) columns
    price: numeric(
      number('price')
        .nonnegative('price must be 0 or more')
        .lt(1e10, 'price must be less than 10,000,000,000')
    ),
    area: optional(
      numeric(
        number('area')
          .positive('area must be greater than 0')
          .lt(1e8, 'area must be less than 100,000,000')
      )
    ),
    owner: z
      .object(
        {
          name: optional(text('owner.name')),
          contact: optional(text('owner.contact')),
        },
        { error: 'owner must be an object' }
      )
      .optional(),
  },
  { error: 'The body must be a JSON object' }
);

// Invalid values fall back to the defaults instead of failing the request
export const pageQuery = z.object({
  page: z.coerce.number().int().positive().catch(1),
  limit: z.coerce
    .number()
    .int()
    .positive()
    .catch(DEFAULT_PAGE_SIZE)
    .transform((limit) => Math.min(limit, MAX_PAGE_SIZE)),
  sort: z.enum(SORT_OPTIONS).catch('date'),
});

export const searchQuery = pageQuery.extend({
  // ?query=a&query=b arrives as an array, which fails here too
  query: text('query').trim().min(1, 'query is required'),
});
