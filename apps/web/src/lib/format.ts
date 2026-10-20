import { formatDistanceToNowStrict } from 'date-fns';

const LOCALE = 'en-US';

const priceFormat = new Intl.NumberFormat(LOCALE, {
  style: 'currency',
  currency: 'USD',
  maximumFractionDigits: 0,
});

const pricePerAreaFormat = new Intl.NumberFormat(LOCALE, {
  style: 'currency',
  currency: 'USD',
  maximumFractionDigits: 2,
});

const areaFormat = new Intl.NumberFormat(LOCALE, { maximumFractionDigits: 2 });

export const formatPrice = (price: number) => priceFormat.format(price);

export const formatArea = (area: number) => `${areaFormat.format(area)} sq ft`;

export const formatPricePerArea = (price: number, area: number) =>
  `${pricePerAreaFormat.format(price / area)}/sq ft`;

// Strict: "2 years ago", not "about 2 years ago"
export const formatTimeAgo = (date: string) =>
  formatDistanceToNowStrict(new Date(date), { addSuffix: true });
