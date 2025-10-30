'use client';

import dynamic from 'next/dynamic';

// ✅ Import the default export *from* your providers file
const ProvidersClient = dynamic(
  () => import('./providers').then((m) => m.Providers),
  {
    ssr: false,
  }
);

export default ProvidersClient;
