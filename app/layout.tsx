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
  const gtmId = process.env.NEXT_PUBLIC_GTM_ID!;
  const hsPortal = process.env.NEXT_PUBLIC_HS_PORTAL_ID;

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

        {/* GTM (after consent) */}
        <GoogleTagManager gtmId={gtmId} />

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
        </ProvidersClient>

        {/* Structured data combined for fewer parse events */}
        <Script
          dangerouslySetInnerHTML={{
            __html: JSON.stringify([orgSchema, siteSchema]),
          }}
          id="jsonld"
          strategy="afterInteractive"
          type="application/ld+json"
        />

        <noscript>
          <iframe
            height="0"
            src={`https://www.googletagmanager.com/ns.html?id=${gtmId}`}
            style={{ display: "none", visibility: "hidden" }}
            title="Google Tag Manager"
            width="0"
          />
        </noscript>
      </body>
    </html>
  );
}
