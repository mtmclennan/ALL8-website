'use client';

import dynamic from 'next/dynamic';
import { Benefit } from './_components/WhyWorkWithUs';

import homeData from '@/data/home.json';
import BuiltForContractors from './_components/home/BuiltForContractorsSection';
import WhyAll8Strip from './_components/home/WhyAll8Strip';
import FAQBlock from './_components/FAQBlock';

const WhyWorkWithUs = dynamic(() => import('./_components/WhyWorkWithUs'), {
  ssr: false,
});

const ServicesShowcase = dynamic(() => import('./_components/Services'), {
  ssr: false,
});

const ProcessSection = dynamic(() => import('./_components/OurProcess'), {
  ssr: false,
});

const CallToAction = dynamic(() => import('./_components/CallToAction'), {
  ssr: false,
});

const benefits: Benefit[] = [
  {
    title: 'Fast sites that get more calls',
    description:
      'Loads in under 2 seconds on mobile. Phone and text buttons are impossible to miss, so customers contact you immediately.',
    icon: 'zap',
  },
  {
    title: 'Show up where customers actually search',
    description:
      'Optimized for Google Maps and local search. Services and service areas structured the way Google expects.',
    icon: 'search',
  },
  {
    title: 'Turn visitors into booked jobs',
    description:
      'Short estimate forms, visible reviews, and strong calls-to-action that move people from browsing to booking.',
    icon: 'target',
  },
  {
    title: 'Secure, monitored, and fully owned by you',
    description:
      'Managed hosting, daily backups, firewall protection, and monitoring. No bloated plugin stacks. Lower risk. Cleaner performance.',
    icon: 'shield',
  },
];

const HomePage = () => {
  return (
    <>
      <BuiltForContractors
        data={homeData.builtForContractors}
        className="py-20 sm:py-24 lg:py-32"
      />
      <WhyAll8Strip
        data={homeData.whyAll8Strip}
        className="py-20 sm:py-24 lg:py-32"
      />
      <WhyWorkWithUs
        title="Structured for"
        titleHighlight="Results"
        subtitle="Clear messaging, fast performance, and conversion-focused layouts that move visitors toward contacting you."
        ctaHref="/tune-up"
        ctaLabel="Find Out What’s Costing You Leads"
        benefits={benefits}
        imageSrc="/assets/all8-webworks-contractor-website-design-developer-laptop-construction-tools.webp"
        imageAlt="Web developer coding a contractor website on a laptop, with level, tape measure, gloves and safety vest on a blueprint desk."
        tone="dark"
      />
      <ServicesShowcase
        title="Ways We Help You Get More Leads"
        subtitle="Pick a starting point: a quick performance tune-up, ongoing maintenance, or a full rebuild."
      />
      {/* <SocialProofSection /> */}
      <ProcessSection
        steps={homeData.process.steps}
        title={homeData.process.title}
        subtitle={homeData.process.subtitle}
      />
      <FAQBlock faqs={homeData.faqs} tone="base" />
      <CallToAction
        ctaHref={homeData.cta.ctaHref}
        ctaLabel={homeData.cta.ctaLabel}
        highlight={homeData.cta.highlight}
        subtitle={homeData.cta.subtitle}
        titlePrefix={homeData.cta.titlePrefix}
        titleSuffix={homeData.cta.titleSuffix}
      />
    </>
  );
};
export default HomePage;
