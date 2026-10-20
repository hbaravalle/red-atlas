// Shared by the API (validation, CHECK constraints) and the web app (labels,
// types), so the two can't drift apart

export const PROPERTY_TYPES = ['apartment', 'house', 'office', 'land'];

export const PROPERTY_STATUSES = ['sale', 'rent'];

// "date" (newest first) is the API default and is never sent
export const SORT_OPTIONS = ['date', 'price_asc', 'price_desc'];

export const DEFAULT_PAGE_SIZE = 10;
