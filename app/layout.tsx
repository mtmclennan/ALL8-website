import "@/styles/globals.css";
import type { Metadata, Viewport } from "next";

import clsx from "clsx";
import Script from "next/script";
import { GoogleTagManager } from "@next/third-parties/google";

import orgSchema from "../data/schema/organization.schema.json";
import siteSchema from "../data/schema/website.schema.json";

import { FooterClient } from "./(site)/_components/FooterClient";
import { NavbarClient } from "./(site)/_components/NavbarClient";
import VisualsLoader from "./(site)/_components/VisualsLoader";
import ProvidersClient from "./(site)/ProvidersClient";
import { LeadModalProvider } from "./(site)/_components/LeadModalProvider";
import StickyCta from "./(site)/_components/StickyCta";
import AnalyticsBridge from "./(site)/_components/analytics/AnalyticsBridge";

import HubspotLoader from "@/app/(site)/_components/HubspotLoader";
import { fontArchivo, fontDmSans, fontOrbitron } from "@/config/fonts";
import { site, siteUrl } from "@/config/site.config";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl()),
  title:
    "High-Performance Websites for Contractors & Service Businesses | ALL8 Webworks",
  description:
    "ALL8 Webworks creates high-performance websites for contractors and service pros—built for speed, SEO, and conversions to fuel real business growth.",
  openGraph: {
    type: "website",
    url: siteUrl(),
    siteName: site.name,
    title: site.name,
    description: site.description,
    locale: site.locale,
    images: [{ url: site.defaultOgImage, width: 1200, height: 630 }],
  },
  twitter: {
    card: "summary_large_image",
    site: site.social.twitter,
    creator: site.social.twitter,
    title: site.name,
    description: site.description,
    images: [site.defaultOgImage],
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "white" },
    { media: "(prefers-color-scheme: dark)", color: "black" },
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Never render a placeholder/unset GTM ID in production — an unconfigured
  // container is a silent no-op (real request, no tags ever fire), which is
  // worse than not loading GTM at all: it looks wired up but isn't. A format
  // check alone isn't enough — "GTM-XXXXX" (the actual placeholder shipped
  // in .env.local) is made entirely of legal characters, so the suffix must
  // also fail an all-repeated-character check like XXXXX/000000/YYYYYYY.
  const rawGtmId = process.env.NEXT_PUBLIC_GTM_ID ?? "";
  const gtmIdMatch = /^GTM-([A-Z0-9]+)$/.exec(rawGtmId);
  const gtmId =
    gtmIdMatch && !/^(.)\1*$/.test(gtmIdMatch[1]) ? rawGtmId : null;
  // Server-only var (no NEXT_PUBLIC_ prefix needed — read here, on the
  // server, and passed down as a prop; this was previously read as
  // NEXT_PUBLIC_HS_PORTAL_ID, which is never set, so the HubSpot script
  // never loaded).
  const hsPortal = process.env.HS_PORTAL_ID;

  const base = siteUrl();
  const jsonLd = [
    {
      ...orgSchema,
      "@id": `${base}/#organization`,
      url: base,
      logo: new URL(site.defaultOgImage, base).toString(),
      founder: { "@id": `${base}/about#founder` },
    },
    {
      ...siteSchema,
      "@id": `${base}/#website`,
      url: base,
      publisher: { "@id": `${base}/#organization` },
    },
  ];

  return (
    <html suppressHydrationWarning lang="en">
      <head>
        {/* Preconnect and preload critical assets */}
        <link href="https://fonts.googleapis.com" rel="preconnect" />
        <link
          crossOrigin=""
          href="https://fonts.gstatic.com"
          rel="preconnect"
        />

        <meta content="light dark" name="color-scheme" />
      </head>

      <body
        className={clsx(
          "min-h-screen text-foreground bg-background font-sans antialiased",
          fontArchivo.variable,
          fontOrbitron.variable,
          fontDmSans.variable,
        )}
      >
        {/* Consent must load before GTM */}
        <Script id="consent-init" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('consent', 'default', {
              'ad_storage': 'denied',
              'ad_user_data': 'denied',
              'ad_personalization': 'denied',
              'analytics_storage': 'granted',
              'wait_for_update': 500
            });
          `}
        </Script>

        {/* GTM (after consent) — only ever rendered with a real container ID */}
        {gtmId && <GoogleTagManager gtmId={gtmId} />}

        <ProvidersClient
          themeProps={{ attribute: "class", defaultTheme: "dark" }}
        >
          <LeadModalProvider>
            <div className="relative flex flex-col min-h-screen">
              <NavbarClient />
              <main className="flex-grow">{children}</main>
              <FooterClient />
            </div>
            <StickyCta />
          </LeadModalProvider>
          <HubspotLoader portalId={hsPortal} />
          <VisualsLoader />
          <AnalyticsBridge />
        </ProvidersClient>

        {/* Structured data combined for fewer parse events */}
        <Script
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(jsonLd),
          }}
          id="jsonld"
          strategy="afterInteractive"
          type="application/ld+json"
        />

        {gtmId && (
          <noscript>
            <iframe
              height="0"
              src={`https://www.googletagmanager.com/ns.html?id=${gtmId}`}
              style={{ display: "none", visibility: "hidden" }}
              title="Google Tag Manager"
              width="0"
            />
          </noscript>
        )}
      </body>
    </html>
  );
}
