// /utils/replacePlaceholders.ts
import { legalVars } from '@/config/legal.config';

export function replacePlaceholders(text: string): string {
  // Handle the "OR" logic before global replacements
  text = text.replace(
    /{{dpoEmail \|\| email}}/g,
    legalVars.dpoEmail ?? legalVars.email
  );
  text = text.replace(
    /{{legalName \|\| companyName}}/g,
    legalVars.legalName ?? legalVars.companyName
  );

  // Replace standard placeholders
  const vars = {
    '{{companyName}}': legalVars.companyName,
    '{{legalName}}': legalVars.legalName ?? legalVars.companyName,
    '{{address}}': legalVars.address,
    '{{country}}': legalVars.country,
    '{{provinceOrState}}': legalVars.provinceOrState ?? '',
    '{{email}}': legalVars.email,
    '{{websiteUrl}}': legalVars.websiteUrl,
    '{{dpoEmail}}': legalVars.dpoEmail ?? legalVars.email,
    '{{lastUpdatedISO}}': legalVars.lastUpdatedISO,
    '{{gaMeasurementId}}': legalVars.gaMeasurementId ?? '',
    '{{googleAdsId}}': legalVars.googleAdsId ?? '',
  };

  let result = text;
  for (const [key, value] of Object.entries(vars)) {
    result = result.replace(new RegExp(key, 'g'), String(value));
  }
  return result;
}
