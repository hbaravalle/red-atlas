import { formatDistanceToNowStrict } from 'date-fns';
import { es } from 'date-fns/locale';

const LOCALE = 'es-PR';

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

export const formatArea = (area: number) => `${areaFormat.format(area)} pie²`;

export const formatPricePerArea = (price: number, area: number) =>
  `${pricePerAreaFormat.format(price / area)}/pie²`;

// "hace 2 años" instead of "hace casi 2 años": the strict variant rounds and
// drops the approximation words, which keeps cards and stat tiles short
export const formatTimeAgo = (date: string) =>
  formatDistanceToNowStrict(new Date(date), { addSuffix: true, locale: es });
