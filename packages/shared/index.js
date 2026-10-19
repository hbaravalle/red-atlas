// Single source of truth for the property domain. The API uses these values
// to validate requests and build its CHECK constraints, and the web app uses
// them to render labels and type its data, so both sides can never drift apart.

export const PROPERTY_TYPES = ['apartment', 'house', 'office', 'land'];

export const PROPERTY_STATUSES = ['sale', 'rent'];

// "date" is the API default (newest first) and is not sent as a query param.
export const SORT_OPTIONS = ['date', 'price_asc', 'price_desc'];

export const DEFAULT_PAGE_SIZE = 10;
