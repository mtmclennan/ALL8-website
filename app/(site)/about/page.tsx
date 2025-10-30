import { Metadata } from 'next';
import { StatGrid } from './components/StatGrid';
import Services from '../components/Services';
import { validateMetadata } from '@/lib/utils/seoValidation';
import { buildStaticMetadata } from '@/lib/utils/buildStaticMetadata';
import AboutHero from './components/AboutHero';
import WhyAll8 from './components/WhyAll8';
import CallToAction from '../components/CallToAction';
import { ProcessSection } from '../components/OurProcess';
import aboutData from '@/data/pages/about.json';
import OurStory from './components/AboutStory';

export const metadata: Metadata = buildStaticMetadata('/about');

validateMetadata(metadata.title, metadata.description);

export default function AboutPage() {
  return (
    <div className="bg-[#0b0f1a] text-white">
      <AboutHero
        body={aboutData.hero.body}
        ctaHref={aboutData.hero.ctaHref}
        ctaLabel={aboutData.hero.ctaLabel}
        subtitle={aboutData.hero.subtitle}
        title={aboutData.hero.title}
      />
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
      {/* <PrinciplesGrid /> */}
      {/* <SocialProof /> */}
      <CallToAction
        titlePrefix={aboutData.cta.titlePrefix}
        highlight={aboutData.cta.highlight}
        titleSuffix={aboutData.cta.titleSuffix}
        subtitle={aboutData.cta.subtitle}
        ctaHref={aboutData.cta.ctaHref}
        ctaLabel={aboutData.cta.ctaLabel}
        microText={aboutData.cta.microText}
      />
    </div>
  );
}
