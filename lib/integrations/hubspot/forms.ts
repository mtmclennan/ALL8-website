// lib/integrations/hubspot/forms.ts
export type HubSpotFormPayload = {
  name: string;
  email: string;
  company?: string;
  website?: string;
  projectType:
    | 'website'
    | 'gmb'
    | 'ads'
    | 'intergrations'
    | 'maintenance'
    | 'seo';
  goal: 'leads' | 'sell' | 'seo' | 'other';
  timeline: 'asap' | '1-2m' | '3m+' | 'exploring';
  budget: 'planning' | '2-3k' | '3-5k' | '5k+';
  notes: string;

  // tracking (optional)
  hutk?: string;
  pageUrl?: string;
  pageName?: string;
  utm_source?: string;
  utm_medium?: string;
  utm_campaign?: string;

  // marketing opt-in (optional)
  marketingOptIn?: boolean;
};

export async function submitToHubSpotForm(
  data: HubSpotFormPayload,
  opts?: { portalId?: string; formGuid?: string }
) {
  const portalId = opts?.portalId ?? process.env.HS_PORTAL_ID!;
  const formGuid = opts?.formGuid ?? process.env.HS_FORM_GUID!;
  const token = process.env.HUBSPOT_TOKEN?.trim();

  const url = `https://api.hsforms.com/submissions/v3/integration/secure/submit/${portalId}/${formGuid}`;
  if (!portalId || !formGuid) {
    console.warn('[HubSpot] Missing portalId/formGuid; skipping submit.');
    return;
  }

  const fields = [
    { name: 'email', value: data.email },
    { name: 'firstname', value: data.name },
    { name: 'company', value: data.company ?? '' },
    { name: 'website', value: data.website ?? '' },
    { name: 'all8_project_type', value: data.projectType },
    { name: 'all8_primary_goal', value: data.goal },
    { name: 'all8_timeline', value: data.timeline },
    { name: 'all8_budget_range', value: data.budget },
    { name: 'all8_notes', value: data.notes },
    ...(data.utm_source
      ? [{ name: 'utm_source', value: data.utm_source }]
      : []),
    ...(data.utm_medium
      ? [{ name: 'utm_medium', value: data.utm_medium }]
      : []),
    ...(data.utm_campaign
      ? [{ name: 'utm_campaign', value: data.utm_campaign }]
      : []),
  ];

  // build context piecemeal
  const context: Record<string, any> = {};
  if (data.pageUrl) context.pageUri = data.pageUrl;
  if (data.pageName) context.pageName = data.pageName;
  // only pass hutk if non-empty and looks like a token
  if (data.hutk && /^[a-z0-9-]{20,}$/i.test(data.hutk))
    context.hutk = data.hutk;

  const body: any = { fields };
  if (Object.keys(context).length) body.context = context;

  if (process.env.HS_CONSENT_TEXT) {
    body.legalConsentOptions = {
      consent: {
        consentToProcess: true,
        text: process.env.HS_CONSENT_TEXT,
        communications:
          data.marketingOptIn && process.env.HS_SUBSCRIPTION_ID_MARKETING
            ? [
                {
                  value: true,
                  subscriptionTypeId: Number(
                    process.env.HS_SUBSCRIPTION_ID_MARKETING
                  ),
                  text:
                    process.env.HS_COMM_TEXT || 'I agree to receive updates.',
                },
              ]
            : [],
      },
    };
  }

  // one simple retry on 429/5xx
  for (let attempt = 0; attempt < 2; attempt++) {
    const res = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(body),
      cache: 'no-store',
    });
    if (res.ok || res.status === 204) return;
    if (![429, 500, 502, 503, 504].includes(res.status)) {
      throw new Error(
        `[HubSpot] Submit failed: ${res.status} ${await res.text()}`
      );
    }
    await new Promise((r) => setTimeout(r, 600)); // backoff then retry
  }
  throw new Error('[HubSpot] Submit failed after retry.');
}
