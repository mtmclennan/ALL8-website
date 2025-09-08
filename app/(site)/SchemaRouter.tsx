// app/(site)/SchemaRouter.tsx
'use client';

import { usePathname } from 'next/navigation';
import Script from 'next/script';
import pages from '@/data/pages.json';

export default function SchemaRouter() {
  const pathname = usePathname() || '/';
  const entry = (pages as any[]).find((p) => p.path === pathname);
  if (!entry?.structuredData) {
    console.log('no meta');
    return null;
  }
  // You can generate stable ids from the path to avoid duplicates
  const id = `jsonld-${pathname === '/' ? 'home' : pathname.replace(/\W+/g, '-')}`;

  return (
    <Script
      id={id}
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(entry.structuredData) }}
    />
  );
}
