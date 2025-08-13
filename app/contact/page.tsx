import React from 'react';
import Contact from '../../components/Contact-page';
import { Metadata } from 'next';
import { validateMetadata } from '@/lib/utils/seoValidation';

export const metadata: Metadata = {
  title: 'Contact Bellhouse Excavating | Brant County Excavation',
  description:
    'Get in touch with Bellhouse Excavating for reliable excavation services in Brant County, Brantford, Hamilton, Waterloo, Oxford, Halton & nearby areas.',
};

validateMetadata(metadata.title, metadata.description);

export default function page() {
  return <Contact />;
}
