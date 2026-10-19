import { createApi, fakeBaseQuery } from '@reduxjs/toolkit/query/react';
import type {
  PaginatedProperties,
  Property,
  SortOption,
} from '@red-atlas/shared';
import {
  ApiError,
  createProperty,
  getProperties,
  getProperty,
  searchProperties,
  type NewProperty,
} from '../services/properties';

// Server state: RTK Query caches each response by its arguments, shares one
// request between every component that asks for the same data, and refetches
// what a mutation invalidates. The requests themselves stay in the service.

export interface QueryError {
  status: number | 'NETWORK_ERROR';
  message: string;
}

function toQueryError(error: unknown): QueryError {
  if (error instanceof ApiError) {
    return { status: error.status, message: error.message };
  }
  return { status: 'NETWORK_ERROR', message: String(error) };
}

export interface ListParams {
  page: number;
  sort: SortOption;
}

export const propertiesApi = createApi({
  reducerPath: 'propertiesApi',
  baseQuery: fakeBaseQuery<QueryError>(),
  // "List" covers every page and search result, so a new property refreshes
  // whatever list is on screen
  tagTypes: ['List', 'Property'],
  endpoints: (build) => ({
    getProperties: build.query<PaginatedProperties, ListParams>({
      async queryFn(params, { signal }) {
        try {
          return { data: await getProperties({ ...params, signal }) };
        } catch (error) {
          return { error: toQueryError(error) };
        }
      },
      providesTags: ['List'],
    }),

    searchProperties: build.query<PaginatedProperties, string>({
      async queryFn(query, { signal }) {
        try {
          return { data: await searchProperties(query, { signal }) };
        } catch (error) {
          return { error: toQueryError(error) };
        }
      },
      providesTags: ['List'],
    }),

    // null when no property has this id
    getProperty: build.query<Property | null, string>({
      async queryFn(id, { signal }) {
        try {
          return { data: await getProperty(id, { signal }) };
        } catch (error) {
          return { error: toQueryError(error) };
        }
      },
      providesTags: (_result, _error, id) => [{ type: 'Property', id }],
    }),

    createProperty: build.mutation<Property, NewProperty>({
      async queryFn(property) {
        try {
          return { data: await createProperty(property) };
        } catch (error) {
          return { error: toQueryError(error) };
        }
      },
      invalidatesTags: ['List'],
    }),
  }),
});

export const {
  useGetPropertiesQuery,
  useSearchPropertiesQuery,
  useGetPropertyQuery,
  useCreatePropertyMutation,
} = propertiesApi;
