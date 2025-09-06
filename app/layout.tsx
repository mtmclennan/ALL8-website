// import '@/styles/globals.css';
// import { Metadata, Viewport } from 'next';
// import { metadataMap } from '../data/metadata';
// import { Link } from '@heroui/link';
// import clsx from 'clsx';
// import Script from 'next/script';
import { Orbitron, DM_Sans } from 'next/font/google';
// import { Providers } from './providers';
// import schema from '../data/schema.json';
// import { fontSans } from '@/config/fonts';
// import { Navbar } from '@/components/navbar';
// import Footer from '@/components/Footer';
// import { Analytics, GTMNoScript } from '@/components/Analytics';
// import ConsentBanner from '@/components/ConsentBanner';

// export const metadata: Metadata = {
//   title: metadataMap.home.title,
//   description: metadataMap.home.description,
//   icons: {
//     icon: '/favicon.ico',
//   },
// };

const orbitron = Orbitron({
  subsets: ['latin'],
  weight: ['400', '700', '900'], // pick only what you need
  variable: '--font-orbitron',
  display: 'swap',
});

const dmSans = DM_Sans({
  subsets: ['latin'],
  weight: ['100', '200', '300', '400', '500', '600', '700'],
  variable: '--font-dmsans',
  display: 'swap',
});

// export const viewport: Viewport = {
//   themeColor: [
//     { media: '(prefers-color-scheme: light)', color: 'white' },
//     { media: '(prefers-color-scheme: dark)', color: 'black' },
//   ],
// };

// export default function RootLayout({
//   children,
// }: {
//   children: React.ReactNode;
// }) {
//   return (
//     <html suppressHydrationWarning lang="en">
//       <head>
//         {/* Local Business Schema */}
//         <Script
//           id="local-business-schema"
//           type="application/ld+json"
//           dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
//         />
//       </head>
//       <body
//         className={clsx(
//           'min-h-screen text-foreground bg-background font-sans antialiased',
//           fontSans.variable
//         )}
//       >
//         <GTMNoScript />
//         <Analytics />
//         <Providers themeProps={{ attribute: 'class', defaultTheme: 'dark' }}>
//           <div className="relative flex flex-col h-screen">
//             <Navbar />
//             <main className="flex-grow">{children}</main>
//             <Footer />
//           </div>
//           <ConsentBanner />
//         </Providers>
//       </body>
//     </html>
//   );
// }

// app/layout.tsx
import '@/styles/globals.css';
import type { Metadata, Viewport } from 'next';
// import { metadataMap } from '../data/metadata';
import { site, siteUrl } from '@/config/site.config';
import clsx from 'clsx';
import Script from 'next/script';
import schema from '../data/schema.json';
import { Providers } from './providers';
import { fontSans } from '@/config/fonts';
import { Navbar } from '@/components/navbar';
import Footer from '@/components/Footer';
import ConsentBanner from '@/components/ConsentBanner';
import { GoogleTagManager, GoogleAnalytics } from '@next/third-parties/google';

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl()),
  title: { default: site.name, template: `%s · ${site.name}` },
  description: site.description,
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
  alternates: { canonical: '/' },
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
  const gaId = process.env.NEXT_PUBLIC_GA_ID; // optional (only if you also want gtag.js)

  return (
    <html suppressHydrationWarning lang="en">
      <head>
        {/* Local Business / Organization JSON-LD */}
        <Script
          id="jsonld-local-business"
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
        />

        {/* Consent Mode + dataLayer bootstrap (runs before GTM) */}
        <Script id="consent-init" strategy="beforeInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            // Consent defaults (adjust to your banner choices)
            gtag('consent', 'default', {
              'ad_storage': 'denied',
              'ad_user_data': 'denied',
              'ad_personalization': 'denied',
              'analytics_storage': 'granted',
              'wait_for_update': 500
            });
          `}
        </Script>
      </head>
      <body
        className={clsx(
          'min-h-screen text-foreground bg-background font-sans antialiased',
          fontSans.variable
        )}
      >
        {/* GTM (loads after the consent bootstrap) */}
        <GoogleTagManager gtmId={gtmId} />

        {/* Optional: GA4 direct (most will configure GA4 *inside* GTM instead) */}
        {gaId ? <GoogleAnalytics gaId={gaId} /> : null}

        <Providers themeProps={{ attribute: 'class', defaultTheme: 'dark' }}>
          <div className="relative flex flex-col h-screen">
            <Navbar />
            <main className="flex-grow">{children}</main>
            <Footer />
          </div>

          {/* Show banner BEFORE user interacts; your banner should call window.gtag('consent','update', {...}) */}
          <ConsentBanner />
        </Providers>

        {/* <noscript> fallback for GTM */}
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
