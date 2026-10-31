import raw from './business.json';
import { isHttpsUrl, launchIssues } from './launch.mjs';

export interface Treatment {
  id: string;
  name: string;
  description: string;
  experience: string;
  suitableFor: string;
  image: string;
  durationMinutes: number | null;
  priceSek: number | null;
  confirmed: boolean;
  bookingUrl: string | null;
}
export interface Business {
  name: string;
  launchReady: boolean;
  copyApproved: boolean;
  practitionerName: string | null;
  practitionerBio: string | null;
  email: string | null;
  phone: string | null;
  addressConfirmed: boolean;
  bookingUrlConfirmed: boolean;
  streetAddress: string | null;
  postalCode: string | null;
  city: string | null;
  directions: string | null;
  bookingUrl: string | null;
  treatments: Treatment[];
}

export const business: Business = raw;
export const isDraft = launchIssues(business).length > 0;
export const navigation = [
  { href: '/', label: 'Hem' },
  { href: '/behandlingar/', label: 'Behandlingar' },
  { href: '/om-armonia/', label: 'Om Armonia' },
  { href: '/kontakt/', label: 'Kontakt' },
];
export const bookingHref = (url?: string | null) =>
  isHttpsUrl(url)
    ? url!
    : isHttpsUrl(business.bookingUrl)
      ? business.bookingUrl!
      : '/kontakt/#bokning';
export const price = (value: number) =>
  new Intl.NumberFormat('sv-SE', {
    style: 'currency',
    currency: 'SEK',
    maximumFractionDigits: 0,
  }).format(value);
