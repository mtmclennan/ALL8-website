import { title } from '../components/primitives';
import { Metadata } from 'next';
import { StatGrid } from './components/StatGrid';
import { validateMetadata } from '@/lib/utils/seoValidation';
import { buildStaticMetadata } from '@/lib/utils/page-meta';
import { AboutHero } from './components/AboutHero';
import { WhyAll8 } from './components/WhyAll8';
import { ServicesSnapshot } from './components/ServiceSnapshot';
import { ProcessSteps } from './components/ProcessSteps';
import { P } from '@upstash/redis/zmscore-CgRD7oFR';
import { PrinciplesGrid } from './components/PrinciplesGrid';
import { SocialProof } from './components/SocalProof';
import { CtaBand } from './components/CtaBand';

export const metadata: Metadata = buildStaticMetadata('/about');

validateMetadata(metadata.title, metadata.description);

export default function AboutPage() {
  return (
    <div className="bg-[#0b0f1a] text-white">
      <AboutHero />
      <section className="mx-auto max-w-7xl px-6 pb-8 pt-0 md:pb-12">
        <StatGrid />
      </section>
      <WhyAll8 />
      <ServicesSnapshot />
      <ProcessSteps />
      <PrinciplesGrid />
      <SocialProof />
      <CtaBand />
    </div>
  );
}
