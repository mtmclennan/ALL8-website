'use client';

import dynamic from 'next/dynamic';
import aboutData from '@/data/pages/about.json';

// Dynamically import all heavy components
const OurStory = dynamic(() => import('./components/AboutStory'), {
  loading: () => <div className="h-48 animate-pulse bg-white/5 rounded-2xl" />,
});
const StatGrid = dynamic(() => import('./components/StatGrid'), {
  ssr: false,
  loading: () => <div className="h-40 animate-pulse bg-white/5 rounded-2xl" />,
});
const WhyAll8 = dynamic(() => import('./components/WhyAll8'), {
  loading: () => <div className="h-80 animate-pulse bg-white/5 rounded-2xl" />,
});
const Services = dynamic(() => import('../components/Services'), {
  loading: () => <div className="h-80 animate-pulse bg-white/5 rounded-2xl" />,
});
const ProcessSection = dynamic(() => import('../components/OurProcess'), {
  loading: () => <div className="h-80 animate-pulse bg-white/5 rounded-2xl" />,
});
const CallToAction = dynamic(() => import('../components/CallToAction'), {
  loading: () => <div className="h-60 animate-pulse bg-white/5 rounded-2xl" />,
});

export default function AboutClient() {
  return (
    <>
      <OurStory
        body={aboutData.aboutStory.paragraphs}
        heading={aboutData.aboutStory.heading}
      />

      <section className="mx-auto max-w-7xl px-6 pb-8 pt-0 md:pb-12">
        <StatGrid />
      </section>

      <WhyAll8
        benefits={aboutData.why.benefits}
        why={aboutData.why}
        cta={aboutData.why.cta}
        imageSrc={aboutData.why.imageSrc}
        imageAlt={aboutData.why.imageAlt}
      />

      <Services
        title={aboutData.services.title}
        subtitle={aboutData.services.subtitle}
      />

      <ProcessSection
        steps={aboutData.process.steps}
        title={aboutData.process.title}
        subtitle={aboutData.process.subtitle}
      />

      <CallToAction
        titlePrefix={aboutData.cta.titlePrefix}
        highlight={aboutData.cta.highlight}
        titleSuffix={aboutData.cta.titleSuffix}
        subtitle={aboutData.cta.subtitle}
        ctaHref={aboutData.cta.ctaHref}
        ctaLabel={aboutData.cta.ctaLabel}
        microText={aboutData.cta.microText}
      />
    </>
  );
}
