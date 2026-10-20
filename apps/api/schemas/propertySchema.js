import { z } from 'zod';
import { DEFAULT_PAGE_SIZE, SORT_OPTIONS } from '@red-atlas/shared';

// Query params only. The body's schema is in @red-atlas/shared/schemas

const MAX_PAGE_SIZE = 100;

// Invalid values fall back to the defaults
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
  // ?query=a&query=b arrives as an array and fails too
  query: z
    .string({
      error: (issue) =>
        issue.input === undefined ? 'query is required' : 'query must be text',
    })
    .trim()
    .min(1, 'query is required'),
});
