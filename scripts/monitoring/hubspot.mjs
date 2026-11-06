import { jsonRequest, required, retry } from './http.mjs';

export const hubspotSecrets = ['MONITOR_HUBSPOT_TOKEN', 'MONITOR_HS_PORTAL_ID', 'MONITOR_HS_FORM_GUID'];
const properties = ['email', 'firstname', 'company', 'website', 'all8_project_type',
  'all8_primary_goal', 'all8_timeline', 'all8_budget_range', 'all8_notes', 'all8_lead_source'];

export async function hubspotConfiguration(env, { json = jsonRequest, wait } = {}) {
  required(env, hubspotSecrets);
  const headers = { Authorization: `Bearer ${env.MONITOR_HUBSPOT_TOKEN}` };
  // GET metadata only. Never read customer records or invoke form submissions.
  const get = (path) => retry(() => json(`https://api.hubapi.com${path}`, { method: 'GET', headers }), { wait });
  const account = await get('/account-info/v3/details');
  if (String(account.portalId) !== env.MONITOR_HS_PORTAL_ID) throw new Error('HubSpot account does not match the intended portal');
  const form = await get(`/marketing/v3/forms/${encodeURIComponent(env.MONITOR_HS_FORM_GUID)}`);
  if (form.id !== env.MONITOR_HS_FORM_GUID || form.archived) throw new Error('Intended HubSpot form is missing or archived');
  const fields = new Set((form.fieldGroups ?? []).flatMap((group) => group.fields ?? []).map((field) => field.name));
  const missingFields = properties.filter((name) => name !== 'all8_lead_source' && !fields.has(name));
  if (missingFields.length) throw new Error(`HubSpot form missing mapped fields: ${missingFields.join(', ')}`);
  const schema = await get('/crm/v3/properties/contacts');
  const names = new Set((schema.results ?? []).map((property) => property.name));
  const missing = properties.filter((name) => !names.has(name));
  if (missing.length) throw new Error(`HubSpot contact schema missing mapped properties: ${missing.join(', ')}`);
  return 'Read-only account, form and contact schema verified; production submission and CRM writes are untested';
}
