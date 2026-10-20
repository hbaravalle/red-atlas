import type { PropertyStatus, PropertyType } from '@red-atlas/shared';

// Record over the shared unions, so a new value requires its label
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
