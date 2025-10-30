import React from 'react';
import Contact from './components/Contact-page';
import { Metadata } from 'next';
import { validateMetadata } from '@/lib/utils/seoValidation';
import { buildStaticMetadata } from '@/lib/utils/buildStaticMetadata';

export const metadata: Metadata = buildStaticMetadata('/contact');

validateMetadata(metadata.title, metadata.description);

export default function page() {
  return <Contact />;
}
