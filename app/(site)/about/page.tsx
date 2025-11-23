import { Metadata } from 'next';
import { validateMetadata } from '@/lib/utils/seoValidation';
import { buildStaticMetadata } from '@/lib/utils/buildStaticMetadata';
import AboutHero from './components/AboutHero';
import aboutData from '@/data/pages/about.json';
import AboutClient from './AboutClient';
import ServicesOverviewRefactored from '../components/Services';

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
      <AboutClient />
    </div>
  );
}
