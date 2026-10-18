import type { PropertyStatus, PropertyType } from '@red-atlas/shared';

// Typed as Record over the shared unions: adding a value to the shared
// package makes TypeScript require its label here.
export const PROPERTY_TYPE_LABELS: Record<PropertyType, string> = {
  apartment: 'Apartamento',
  house: 'Casa',
  office: 'Oficina',
  land: 'Terreno',
};

export const PROPERTY_STATUS_LABELS: Record<PropertyStatus, string> = {
  sale: 'Venta',
  rent: 'Alquiler',
};
