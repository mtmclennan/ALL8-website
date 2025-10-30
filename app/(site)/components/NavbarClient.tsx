'use client';

import dynamic from 'next/dynamic';

// Lazy-load the real Navbar on the client
export const NavbarClient = dynamic(
  () => import('./Navbar').then((m) => m.Navbar),
  {
    ssr: false,
    loading: () => (
      <div className="sticky top-0 h-[64px] w-full bg-background/80 backdrop-blur" />
    ), // placeholder to prevent layout shift
  }
);
