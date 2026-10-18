export declare const PROPERTY_TYPES: readonly ['apartment', 'house', 'office', 'land'];
export declare const PROPERTY_STATUSES: readonly ['sale', 'rent'];
export declare const SORT_OPTIONS: readonly ['date', 'price_asc', 'price_desc'];
export declare const DEFAULT_PAGE_SIZE: number;

export type PropertyType = (typeof PROPERTY_TYPES)[number];
export type PropertyStatus = (typeof PROPERTY_STATUSES)[number];
export type SortOption = (typeof SORT_OPTIONS)[number];

/** A property as returned by the API. */
export interface Property {
  _id: string;
  title: string;
  description: string;
  location: {
    lat: string;
    lng: string;
  };
  address: string;
  images: string[];
  type: PropertyType;
  status: PropertyStatus;
  isActive: boolean;
  price: number;
  area: number;
  createdAt: string;
  updatedAt: string;
  owner: {
    name: string;
    contact: string;
  };
}

/** Response of GET /api/properties and GET /api/properties/search. */
export interface PaginatedProperties {
  properties: Property[];
  totalProperties: number;
  totalPages: number;
  currentPage: number;
  prevPage: number | null;
  nextPage: number | null;
}
