import Services from './components/Services';
import { Benefit } from './components/WhyWorkWithUs';
import CallToAction from './components/CallToAction';
import WhyWorkWithUs from './components/WhyWorkWithUs';
import { ProcessSection } from './components/OurProcess';
// import processData from '@/data/home/process.json';
import homeData from '@/data/home.json';
import HeroBlueprint from './components/HeroBluePrint';

const benefits: Benefit[] = [
  {
    title: 'Fast sites that make the phone ring',
    description:
      'Opens in ~2 seconds on a normal phone. Big call and text buttons so customers reach you fast.',
    icon: 'zap',
  },
  {
    title: 'Show up where customers search',
    description:
      'Google Maps and local search set up properly. Services and areas displayed the way Google expects.',
    icon: 'search',
  },
  {
    title: 'Turn clicks into booked jobs',
    description:
      'Short 3-field estimate form, reviews, and clear CTAs. More people finish, more jobs booked.',
    icon: 'target',
  },
  {
    title: 'Stays up, stays safe, and it’s yours',
    description:
      'Secure hosting, daily backups, basic firewalling, and monitoring. Smaller attack surface than plugin stacks.',
    icon: 'shield',
  },
];
export default function Home() {
  return (
    <>
      <HeroBlueprint />

      <WhyWorkWithUs
        title="How Our Websites Help Your Business"
        titleHighlight="Grow"
        subtitle="We don’t just build websites — we build revenue machines that work 24/7."
        ctaHref="/contact"
        ctaLabel="Get Your Free Consultation"
        benefits={benefits}
        imageSrc="/assets/all8-webworks-contractor-website-design-developer-laptop-construction-tools.webp" // optional
        imageAlt="Web developer coding a contractor website on a laptop, with level, tape measure, gloves and safety vest on a blueprint desk."
        tone="dark" // or "light"
      />
      <Services />
      {/* <SocialProofSection /> */}
      <ProcessSection
        steps={homeData.process.steps}
        title={homeData.process.title}
        subtitle={homeData.process.subtitle}
      />

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
}
