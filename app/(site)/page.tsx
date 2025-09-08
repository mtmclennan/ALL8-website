// import Hero from '../components/Hero';
import Services from './components/Services';
import CallToAction from './components/CallToAction';
import {
  ReviewSection,
  TestimonialSection,
} from './components/DynamicReviewsTestimonials';
import { reviews, testimonials } from '../../data/ReviewsTestimonials';
import WhyWorkWithUs from './components/WhyWorkWithUs';
import SocialProofSection from './components/SocialProof';
import ProcessSection from './components/OurProcess';
import HeroBlueprint from './components/HeroBluePrint';

export default function Home() {
  return (
    <>
      {/* <Hero
        heading="High-Performance Websites That Run on All 8 Cylinders"
        subHeading="Custom-built sites designed for speed, SEO, and Google Ads performance — built by a Canadian full-stack dev who understands your business"
        ctaText="Get a Free Quote"
      /> */}
      <HeroBlueprint />
      <WhyWorkWithUs />
      <Services />
      <SocialProofSection />
      <ProcessSection />

      <CallToAction />
    </>
  );
}
