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
  address: 'Ontario, Canada',
  country: 'CA',
  provinceOrState: 'ON',
  email: 'info@all8webworks.com',
  websiteUrl: 'https://all8webworks.com',
  dpoEmail: 'privacy@all8webworks.com',
  lastUpdatedISO: '2025-11-01',
  gaMeasurementId: process.env.NEXT_PUBLIC_GA_ID,
  googleAdsId: process.env.NEXT_PUBLIC_GOOGLE_ADS_ID,
};
