import {
  DEFAULT_PAGE_SIZE,
  type PaginatedProperties,
  type Property,
  type PropertyStatus,
  type PropertyType,
  type SortOption,
} from '@red-atlas/shared';
import { API_URL } from '../lib/api';

// Every call to the properties API goes through this module, so URLs,
// encoding, error handling and response types are defined once.

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
    // The API sends { message } for 400 and 404; fall back to the status
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

// What POST /properties accepts. Numbers may arrive as strings from form
// inputs; the API converts them.
export interface NewProperty {
  title: string;
  address?: string;
  description?: string;
  location: { lat: number | string; lng: number | string };
  images?: string[];
  type: PropertyType;
  status: PropertyStatus;
  isActive?: boolean;
  price: number | string;
  area?: number | string;
  owner?: { name?: string; contact?: string };
}

export function createProperty(property: NewProperty) {
  return request<Property>('/properties', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(property),
  });
}
