import React from 'react';
import type { Metadata } from 'next';
import { OpenGraphType } from 'next/dist/lib/metadata/types/opengraph-types';
import { notFound } from 'next/navigation';
import ServiceHero from './components/ServiceHero';
import { getServiceBySlug, SERVICES } from '@/data/services';
import { getIconByName } from '@/lib/icons';
import CallToAction from '@/app/(site)/components/CallToAction';
import ProcessSection from '@/app/(site)/components/OurProcess';
import ServiceOverview from './components/ServiceOverview';
import BenefitsBlock from './components/BenefitsBlock';
import ProblemBlock from './components/ProblemBlock';
import SolutionBlock from './components/SolutionBlock';
import ComparisonBlock from './components/ComparisonBlock';
import FAQBlock from '../../components/FAQBlock';
import ServicesOverviewRefactored from '../../components/Services';

type Params = { slug: string };

export function generateStaticParams() {
  return SERVICES.map((s) => ({ slug: s.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Params;
}): Promise<Metadata> {
  const { slug } = await params;
  const service = getServiceBySlug(slug);

  if (!service?.seo) {
    return {
      title: 'ALL8 Webworks',
      description: 'High-performance websites for contractors and trades.',
    };
  }

  const { seo } = service;

  return {
    title: seo?.title,
    description: seo?.description,
    keywords: seo?.keywords,
    openGraph: {
      title: seo?.title,
      description: seo?.description,
      url: seo?.url || `https://all8webworks.com/services/${service.slug}`,
      type: (seo?.type as OpenGraphType) || 'website',
      siteName: seo?.siteName || 'ALL8 Webworks',
      images: [
        {
          url: seo?.image || '/images/og-default.jpg',
          width: 1200,
          height: 630,
          alt: seo?.title || service.title,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: seo?.title,
      description: seo?.description,
      images: [seo?.image || '/images/og-default.jpg'],
    },
  };
}

export default async function ServiceDetailPage({
  params,
}: {
  params: Params;
}) {
  const { slug } = await params;
  const service = getServiceBySlug(slug);
  if (!service) return notFound();

  const Icon = getIconByName(service.icon);

  return (
    <>
      {service.hero && <ServiceHero hero={service.hero} />}
      {/* Process (if defined in JSON) */}
      {service.problem && <ProblemBlock problems={service.problem} />}
      {service.solution && <SolutionBlock solution={service.solution} />}
      {service.overview && <ServiceOverview overview={service.overview} />}
      {service.benefits && service.benefits.length > 0 && (
        <BenefitsBlock benefits={service.benefits} />
      )}
      {service.process && (
        <ProcessSection
          title={service.process.title}
          subtitle={service.process.subtitle}
          steps={service.process.steps}
        />
      )}
      {service.comparison && (
        <ComparisonBlock comparison={service.comparison} />
      )}
      {/* Process (if defined in JSON) */}

      {/* Final CTA */}
      {service.cta && (
        <CallToAction
          titleSuffix={service.cta?.titleSuffix}
          titlePrefix={service.cta.titlePrefix}
          highlight={service.cta.highlight}
          subtitle={service.cta.subtitle}
          ctaLabel={service.cta.ctaLabel}
          ctaHref={service.cta.ctaHref}
        />
      )}
      {service.faqs && service.faqs.length > 0 && (
        <FAQBlock faqs={service.faqs} />
      )}
      <ServicesOverviewRefactored
        title="Keep Your Business Running on All 8"
        subtitle="Check out more high-performance services built to power your growth online."
      />
    </>
  );
}
