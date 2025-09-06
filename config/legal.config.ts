export type LegalVars = {
  companyName: string;
  legalName?: string;
  address: string;
  country: 'CA' | 'US' | 'Other';
  provinceOrState?: string;
  email: string;
  websiteUrl: string;
  dpoEmail?: string; // privacy contact
  lastUpdatedISO: string; // YYYY-MM-DD
  gaMeasurementId?: string; // e.g., 'G-XXXXXXXXXX'
  googleAdsId?: string; // e.g., 'AW-XXXXXXXXX'
};

export const legalVars: LegalVars = {
  companyName: 'ALL8 Webworks',
  legalName: 'ALL8 Webworks',
  address: 'Paris, Ontario, Canada',
  country: 'CA',
  provinceOrState: 'ON',
  email: 'hello@all8.ca',
  websiteUrl: 'https://all8.ca',
  dpoEmail: 'privacy@all8.ca',
  lastUpdatedISO: '2025-08-20',
  gaMeasurementId: process.env.NEXT_PUBLIC_GA_ID,
  googleAdsId: process.env.NEXT_PUBLIC_GOOGLE_ADS_ID,
};
