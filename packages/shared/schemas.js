// Used by POST /properties and the create form. Its own entry point keeps Zod
// out of the main import
import { z } from 'zod';
import { PROPERTY_STATUSES, PROPERTY_TYPES } from './index.js';

// The JSDoc keeps the types the web app infers from this file precise

/**
 * Form inputs send numbers as strings
 * @template {z.ZodType} T
 * @param {T} schema
 */
const numeric = (schema) =>
  z.preprocess(
    (value) =>
      typeof value === 'string' && value.trim() !== '' ? Number(value) : value,
    schema
  );

// An unchecked radio group sends null, an empty input ''
const isMissing = (/** @type {unknown} */ value) =>
  value == null || value === '';

/**
 * @param {string} label
 * @param {string} expected
 */
const typeError = (label, expected) => (/** @type {{ input: unknown }} */ issue) =>
  isMissing(issue.input) ? `${label} is required` : `${label} must be ${expected}`;

const number = (/** @type {string} */ label) =>
  z.number({ error: typeError(label, 'a number') });

const text = (/** @type {string} */ label) =>
  z.string({ error: typeError(label, 'text') });

/**
 * @template {readonly [string, ...string[]]} T
 * @param {string} label
 * @param {T} values
 */
const oneOf = (label, values) =>
  z.enum(values, { error: typeError(label, `one of: ${values.join(', ')}`) });

/**
 * Form inputs send an empty field as ''
 * @template {z.ZodType} T
 * @param {T} schema
 */
const optional = (schema) =>
  z.preprocess((value) => (value === '' ? undefined : value), schema.optional());

export const newProperty = z.object(
  {
    title: text('Title').trim().min(1, 'Title is required'),
    description: optional(text('Description')),
    address: text('Address').trim().min(1, 'Address is required'),
    location: z.object(
      {
        lat: numeric(
          number('Latitude')
            .min(-90, 'Latitude must be between -90 and 90')
            .max(90, 'Latitude must be between -90 and 90')
        ),
        lng: numeric(
          number('Longitude')
            .min(-180, 'Longitude must be between -180 and 180')
            .max(180, 'Longitude must be between -180 and 180')
        ),
      },
      { error: 'Location is required' }
    ),
    images: z
      .array(z.url({ error: 'Image must be a URL' }), {
        error: 'Images must be a list of URLs',
      })
      .optional(),
    type: oneOf('Type', PROPERTY_TYPES),
    status: oneOf('Listing', PROPERTY_STATUSES),
    isActive: z.boolean({ error: 'Active must be true or false' }).optional(),
    // Maximums fit the numeric(12,2) and numeric(10,2) columns
    price: numeric(
      number('Price')
        .nonnegative('Price must be 0 or more')
        .lt(1e10, 'Price must be less than 10,000,000,000')
    ),
    area: optional(
      numeric(
        number('Area')
          .positive('Area must be greater than 0')
          .lt(1e8, 'Area must be less than 100,000,000')
      )
    ),
    owner: z
      .object(
        {
          name: optional(text('Owner name')),
          contact: optional(text('Owner contact')),
        },
        { error: 'Owner must be an object' }
      )
      .optional(),
  },
  { error: 'The body must be a JSON object' }
);
