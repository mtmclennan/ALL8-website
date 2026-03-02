// app/components/Analytics.tsx
'use client';
import { usePathname, useSearchParams } from 'next/navigation';
import { useEffect } from 'react';
import Script from 'next/script';

// ---- Types ----
type ConsentValue = 'granted' | 'denied';
export type ConsentDefaults = {
  ad_storage?: ConsentValue;
  analytics_storage?: ConsentValue;
  ad_user_data?: ConsentValue;
  ad_personalization?: ConsentValue;
};

// ---- Env IDs (set per project/client to make tracking optional) ----
const GA_ID = process.env.NEXT_PUBLIC_GA_ID; // e.g. G-XXXXXXX
const ADS_ID = process.env.NEXT_PUBLIC_GOOGLE_ADS_ID; // e.g. AW-YYYYYYY
const GTM_ID = process.env.NEXT_PUBLIC_GTM_ID; // e.g. GTM-ABCDE

// Consent Mode v2 defaults — safest default is "denied" until user accepts
const CONSENT_DEFAULTS: ConsentDefaults = {
  ad_storage:
    (process.env.NEXT_PUBLIC_CONSENT_AD_STORAGE as ConsentValue) || 'denied',
  analytics_storage:
    (process.env.NEXT_PUBLIC_CONSENT_ANALYTICS_STORAGE as ConsentValue) ||
    'denied',
  ad_user_data:
    (process.env.NEXT_PUBLIC_CONSENT_AD_USER_DATA as ConsentValue) || 'denied',
  ad_personalization:
    (process.env.NEXT_PUBLIC_CONSENT_AD_PERSONALIZATION as ConsentValue) ||
    'denied',
};

// ---- Global typings ----
declare global {
  interface Window {
    dataLayer?: Object[] | undefined;
    gtag: (...args: any[]) => void;
  }
}

/**
 * Analytics component
 * - If GTM ID is provided → loads GTM (recommended: manage GA4 + Ads inside GTM)
 * - Else loads gtag.js directly and configures GA4 and/or Google Ads per env vars
 * - Handles SPA page_view on route change
 * - Initializes Consent Mode v2 to your chosen defaults
 */
export function Analytics() {
  const pathname = usePathname();
  const search = useSearchParams();

  const hasGTM = Boolean(GTM_ID);
  const hasGtag = Boolean(GA_ID || ADS_ID);

  // SPA page view on route changes (GA4)
  useEffect(() => {
    if (typeof window === 'undefined') return;
    if (!window.gtag || !GA_ID) return;

    const query = search?.toString();
    const page_path = query ? `${pathname}?${query}` : pathname || '/';
    window.gtag('config', GA_ID, { page_path });
  }, [pathname, search]);

  return (
    <>
      {hasGTM ? (
        // ---- Google Tag Manager path ----
        <>
          {/* Initialize dataLayer, gtag alias, and Consent defaults */}
          <Script id="gtm-init" strategy="afterInteractive">
            {`
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);} // expose gtag helper
              gtag('consent', 'default', ${JSON.stringify(CONSENT_DEFAULTS)});
            `}
          </Script>
          {/* Load GTM */}
          <Script
            id="gtm-loader"
            strategy="afterInteractive"
            dangerouslySetInnerHTML={{
              __html: `
                (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
                new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
                j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
                'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
                })(window,document,'script','dataLayer','${GTM_ID}');
              `,
            }}
          />
        </>
      ) : hasGtag ? (
        // ---- Direct gtag.js path (no GTM) ----
        <>
          <Script
            src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID || ADS_ID}`}
            strategy="afterInteractive"
          />
          <Script id="gtag-init" strategy="afterInteractive">
            {`
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);} // GA/Ads helper
              gtag('js', new Date());
              gtag('consent', 'default', ${JSON.stringify(CONSENT_DEFAULTS)});
              ${GA_ID ? `gtag('config', '${GA_ID}');` : ''}
              ${ADS_ID ? `gtag('config', '${ADS_ID}');` : ''}
            `}
          </Script>
        </>
      ) : null}
    </>
  );
}

/**
 * Place immediately after the opening <body> in app/layout.tsx when using GTM.
 */
export function GTMNoScript() {
  if (!GTM_ID) return null;
  return (
    <noscript>
      <iframe
        src={`https://www.googletagmanager.com/ns.html?id=${GTM_ID}`}
        height="0"
        width="0"
        style={{ display: 'none', visibility: 'hidden' }}
      />
    </noscript>
  );
}

// ---- Lightweight helpers you can import in client components ----
export function adsConversion(sendTo: string, params?: Record<string, any>) {
  if (typeof window === 'undefined' || !window.gtag) return;
  window.gtag('event', 'conversion', {
    send_to: sendTo, // e.g. "AW-XXXX/YYYY"
    ...(params || {}),
  });
}

export function logEvent(name: string, params?: Record<string, any>) {
  if (typeof window === 'undefined' || !window.gtag) return;
  window.gtag('event', name, params || {});
}

export function updateConsent(choices: Partial<ConsentDefaults>) {
  if (typeof window === 'undefined' || !window.gtag) return;
  window.gtag('consent', 'update', choices);
}

// ----------------------------------
// USAGE (App Router):
// 1) Save this file as app/components/Analytics.tsx
// 2) In app/layout.tsx
//
// import type { Metadata } from "next";
// import { Analytics, GTMNoScript } from "./components/Analytics";
//
// export default function RootLayout({ children }: { children: React.ReactNode }) {
//   return (
//     <html lang="en" className="h-full">
//       <head />
//       <body className="min-h-screen">
//         {/* If using GTM, include the noscript iframe for non-JS users */}
//         <GTMNoScript />
//         {/* Load GA4 / Ads / GTM per env vars */}
//         <Analytics />
//         {children}
//       </body>
//     </html>
//   );
// }
//
// 3) Set whichever env IDs you want per client (leave others blank to disable):
//    NEXT_PUBLIC_GTM_ID=GTM-XXXXX
//    NEXT_PUBLIC_GA_ID=G-XXXXXXX
//    NEXT_PUBLIC_GOOGLE_ADS_ID=AW-YYYYYYY
//
// Optional Consent defaults (v2):
//    NEXT_PUBLIC_CONSENT_AD_STORAGE=denied|granted
//    NEXT_PUBLIC_CONSENT_ANALYTICS_STORAGE=denied|granted
//    NEXT_PUBLIC_CONSENT_AD_USER_DATA=denied|granted
//    NEXT_PUBLIC_CONSENT_AD_PERSONALIZATION=denied|granted
//
// 4) Fire a Google Ads conversion (example in a client component):
//    import { adsConversion } from "@/app/components/Analytics";
//    adsConversion("AW-YYYYYYY/CONVERSION_LABEL", { value: 100, currency: "CAD" });
//
// 5) Log a GA4 event:
//    import { logEvent } from "@/app/components/Analytics";
//    logEvent("generate_lead", { method: "contact_form" });
//
// 6) Update consent after user action (cookie banner):
//    import { updateConsent } from "@/app/components/Analytics";
//    updateConsent({ ad_storage: "granted", analytics_storage: "granted" });
// ----------------------------------
