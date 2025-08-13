import Hero from '../components/Hero';
import WhyChooseUs from '@/components/WhyChooseUs';
import { whyChooseUs } from './data/WhyChooseUs';
import ServiceArea from '../components/ServiceArea';
import CallToAction from '@/components/CallToAction';
import {
  ReviewSection,
  TestimonialSection,
} from '@/components/DynamicReviewsTestimonials';
import { reviews, testimonials } from './data/ReviewsTestimonials';

export default function Home() {
  return (
    <>
      <Hero
        heading="Reliable Contracting Services You Can Count On"
        subHeading="Serving homeowners and contractors with fast, professional service across Southern Ontario."
        ctaText="Get a Free Quote"
      />
      <WhyChooseUs items={whyChooseUs} />
      <ServiceArea />
      <ReviewSection reviews={reviews} />
      <TestimonialSection testimonials={testimonials} />
      <CallToAction />
    </>
  );
}
