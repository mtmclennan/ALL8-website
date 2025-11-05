'use client';

import dynamic from 'next/dynamic';

// Lazy-load the real Navbar on the client
export const NavbarClient = dynamic(
  () => import('@/app/(site)/components/Navbar').then((m) => m.Navbar),
  {
    ssr: false,
    loading: () => (
      <div className="sticky top-0 h-16 w-full bg-background/80 backdrop-blur" />
    ), // placeholder to prevent layout shift
  }
);
