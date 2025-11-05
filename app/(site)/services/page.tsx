import React from 'react';
import type { Metadata } from 'next';
import Services from '../components/Services';
import servicePageData from '@/data/pages/servicesPage.json';

import { validateMetadata } from '@/lib/utils/seoValidation';
import { buildStaticMetadata } from '@/lib/utils/buildStaticMetadata';
import ServicesPageHero from './components/ServicesPageHero';
import ServicesShowcase from './components/ServicesShowcase';
import ProcessSection from '../components/OurProcess';
import CallToAction from '@/app/(site)/components/CallToAction';

export const metadata: Metadata = buildStaticMetadata('/services');

validateMetadata(metadata.title, metadata.description);

export default function ServicesPage() {
  return (
    <>
      <ServicesPageHero hero={servicePageData.hero} />
      <ServicesShowcase
        title={servicePageData.servicesSection.title}
        subtitle={servicePageData.servicesSection.subtitle}
      />
      <ProcessSection
        steps={servicePageData.processSection.steps}
        title={servicePageData.processSection.title}
        subtitle={servicePageData.processSection.subtitle}
      />
      <CallToAction
        titlePrefix={servicePageData.cta.titlePrefix}
        titleSuffix={servicePageData.cta.titleSuffix}
        highlight={servicePageData.cta.highlight}
        subtitle={servicePageData.cta.subtitle}
        ctaLabel={servicePageData.cta.ctaLabel}
        ctaHref={servicePageData.cta.ctaHref}
      />
    </>
  );
}
