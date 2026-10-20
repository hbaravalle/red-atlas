import type { z } from 'zod';
import {
  DEFAULT_PAGE_SIZE,
  type PaginatedProperties,
  type Property,
  type SortOption,
} from '@red-atlas/shared';
import type { newProperty } from '@red-atlas/shared/schemas';
import { API_URL } from '../lib/api';

// Every API call goes through here: URLs, errors and types live in one place

export class ApiError extends Error {
  constructor(
    readonly status: number,
    message: string
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const response = await fetch(`${API_URL}${path}`, init);

  if (!response.ok) {
    // The API sends { message } on 400 and 404
    const body = await response.json().catch(() => null);
    throw new ApiError(
      response.status,
      body?.message ?? `Request failed with status ${response.status}`
    );
  }

  return response.json();
}

interface PageOptions {
  page?: number;
  limit?: number;
  sort?: SortOption;
  signal?: AbortSignal;
}

function pageParams({ page = 1, limit = DEFAULT_PAGE_SIZE, sort }: PageOptions) {
  const params = new URLSearchParams({
    page: String(page),
    limit: String(limit),
  });
  // "date" is the API default and is not sent
  if (sort && sort !== 'date') params.set('sort', sort);
  return params;
}

export function getProperties(options: PageOptions = {}) {
  return request<PaginatedProperties>(`/properties?${pageParams(options)}`, {
    signal: options.signal,
  });
}

export function searchProperties(query: string, options: PageOptions = {}) {
  const params = pageParams(options);
  params.set('query', query);
  return request<PaginatedProperties>(`/properties/search?${params}`, {
    signal: options.signal,
  });
}

// null when no property has this id
export async function getProperty(
  id: string,
  { signal }: { signal?: AbortSignal } = {}
): Promise<Property | null> {
  try {
    return await request<Property>(`/properties/${encodeURIComponent(id)}`, {
      signal,
    });
  } catch (error) {
    if (error instanceof ApiError && error.status === 404) return null;
    throw error;
  }
}

// A property that already passed the shared schema
export type NewProperty = z.output<typeof newProperty>;

export function createProperty(property: NewProperty) {
  return request<Property>('/properties', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(property),
  });
}
