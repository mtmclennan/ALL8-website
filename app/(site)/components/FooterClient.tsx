'use client';

import dynamic from 'next/dynamic';

// Lazy-load the real Footer on the client
export const FooterClient = dynamic(() => import('./Footer'), {
  ssr: false,
  loading: () => <div className="h-[260px] bg-background/10" />,
});
