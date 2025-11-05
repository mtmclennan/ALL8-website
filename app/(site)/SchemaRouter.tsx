// app/(site)/SchemaRouter.tsx  (SERVER version)
import pages from '@/data/pages.json';
import Script from 'next/script';

export default function SchemaRouter({ pathname }: { pathname: string }) {
  const entry = (pages as any[]).find((p) => p.path === pathname);
  if (!entry?.structuredData) return null;

  const id = `jsonld-${pathname === '/' ? 'home' : pathname.replace(/\W+/g, '-')}`;

  return (
    <Script
      id={id}
      type="application/ld+json"
      strategy="afterInteractive"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(entry.structuredData) }}
    />
  );
}
