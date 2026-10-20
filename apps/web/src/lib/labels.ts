import type { PropertyStatus, PropertyType } from '@red-atlas/shared';

// Record over the shared unions, so a new value requires its label
export const PROPERTY_TYPE_LABELS: Record<PropertyType, string> = {
  apartment: 'Apartment',
  house: 'House',
  office: 'Office',
  land: 'Land',
};

export const PROPERTY_STATUS_LABELS: Record<PropertyStatus, string> = {
  sale: 'For sale',
  rent: 'For rent',
};
