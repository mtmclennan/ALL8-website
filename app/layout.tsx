import { Orbitron, DM_Sans } from 'next/font/google';
import '@/styles/globals.css';
import type { Metadata, Viewport } from 'next';
import clsx from 'clsx';
import Script from 'next/script';
import { GoogleTagManager } from '@next/third-parties/google';
import { site, siteUrl } from '@/config/site.config';
import { fontSans } from '@/config/fonts';
import { FooterClient } from './(site)/components/FooterClient';
import { NavbarClient } from './(site)/components/NavbarClient';
import VisualsLoader from './(site)/components/VisualsLoader';
import ProvidersClient from './(site)/ProvidersClient';
import HubspotLoader from '@/app/(site)/components/HubspotLoader';

import orgSchema from '../data/schema/organization.schema.json';
import siteSchema from '../data/schema/website.schema.json';

const orbitron = Orbitron({
  subsets: ['latin'],
  weight: ['400', '700', '900'],
  variable: '--font-orbitron',
  display: 'swap',
});

const dmSans = DM_Sans({
  subsets: ['latin'],
  weight: ['100', '200', '300', '400', '500', '600', '700'],
  variable: '--font-dmsans',
  display: 'swap',
});

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl()),
  title:
    'High-Performance Websites for Contractors & Service Businesses | ALL8 Webworks',
  description:
    'ALL8 Webworks creates high-performance websites for contractors and service pros—built for speed, SEO, and conversions to fuel real business growth.',
  openGraph: {
    type: 'website',
    url: siteUrl(),
    siteName: site.name,
    title: site.name,
    description: site.description,
    locale: site.locale,
    images: [{ url: site.defaultOgImage, width: 1200, height: 630 }],
  },
  twitter: {
    card: 'summary_large_image',
    site: site.social.twitter,
    creator: site.social.twitter,
    title: site.name,
    description: site.description,
    images: [site.defaultOgImage],
  },
  alternates: { canonical: siteUrl() },
};

export const viewport: Viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: 'white' },
    { media: '(prefers-color-scheme: dark)', color: 'black' },
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
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin=""
        />

        <meta name="color-scheme" content="light dark" />
      </head>

      <body
        className={clsx(
          'min-h-screen text-foreground bg-background font-sans antialiased',
          fontSans.variable,
          dmSans.variable,
          orbitron.variable
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
          themeProps={{ attribute: 'class', defaultTheme: 'dark' }}
        >
          <div className="relative flex flex-col min-h-screen">
            <NavbarClient />
            <main className="flex-grow">{children}</main>
            <FooterClient />
          </div>
          <HubspotLoader portalId={hsPortal} />
          <VisualsLoader />
        </ProvidersClient>

        {/* Structured data combined for fewer parse events */}
        <Script
          id="jsonld"
          type="application/ld+json"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify([orgSchema, siteSchema]),
          }}
        />

        <noscript>
          <iframe
            src={`https://www.googletagmanager.com/ns.html?id=${gtmId}`}
            height="0"
            width="0"
            style={{ display: 'none', visibility: 'hidden' }}
          />
        </noscript>
      </body>
    </html>
  );
}
