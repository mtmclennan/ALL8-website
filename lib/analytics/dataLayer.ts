// Central GTM dataLayer bridge. GTM (loaded in app/layout.tsx) owns tag/trigger
// config; this module only ever pushes events — it never loads GA4/Ads scripts
// directly, so there is exactly one place where analytics vendors get wired up.

export type LeadFormLocation = "modal" | "contact_page";

function push(event: string, params: Record<string, unknown> = {}) {
  if (typeof window === "undefined") return;
  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push({ event, ...params });
}

export function trackPageView(pagePath: string) {
  push("page_view", {
    page_path: pagePath,
    page_location: window.location.href,
    page_title: document.title,
  });
}

export function trackCtaClick(
  ctaId: string,
  extra: Record<string, unknown> = {},
) {
  push("cta_click", {
    cta_id: ctaId,
    page_path: window.location.pathname,
    ...extra,
  });
}

export function trackEvent(
  eventName: string,
  params: Record<string, unknown> = {},
) {
  push(eventName, {
    page_path: window.location.pathname,
    ...params,
  });
}

export function trackFormStart(
  formLocation: LeadFormLocation,
  leadType = "lead_system_review",
) {
  push(formLocation === "modal" ? "lead_review_start" : "form_start", {
    form_location: formLocation,
    lead_type: leadType,
    page_path: window.location.pathname,
  });
}

export function trackGenerateLead(
  formLocation: LeadFormLocation,
  attribution: {
    utmSource?: string;
    utmMedium?: string;
    utmCampaign?: string;
    utmContent?: string;
    utmTerm?: string;
    pageName?: string;
  } = {},
) {
  push("generate_lead", {
    lead_type: "lead_system_review",
    form_location: formLocation,
    page_path: window.location.pathname,
    utm_source: attribution.utmSource || undefined,
    utm_medium: attribution.utmMedium || undefined,
    utm_campaign: attribution.utmCampaign || undefined,
    utm_content: attribution.utmContent || undefined,
    utm_term: attribution.utmTerm || undefined,
    page_name: attribution.pageName || undefined,
  });
}

export function trackLinkClick(
  kind: "phone_click" | "email_click" | "sms_click",
  href: string,
) {
  push(kind, {
    link_url: href,
    page_path: window.location.pathname,
  });
}

export function trackCustomEvent(
  eventName: string,
  ctaId: string,
  extra: Record<string, unknown> = {},
) {
  push(eventName, {
    cta_id: ctaId,
    page_path: window.location.pathname,
    ...extra,
  });
}
