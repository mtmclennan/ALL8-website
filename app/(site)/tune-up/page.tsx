import { Section } from '@/app/(site)/_components/SectionWrapper';
import tuneUpPage from '@/data/pages/tuneUpPage.json';
import TuneUpReviewForm from './_components/TuneUpReviewForm';
import TuneUpHeroWithCompactForm from './_components/TuneUpPageHero';
import OurProcessSection from '@/app/(site)/_components/OurProcess';
import SimpleBulletsSection from '../_components/SimpleBulletsSection';
import { OutcomesAndBestFor } from './_components/OutcomesAndBestFor';
import CallToAction from '../_components/CallToAction';
import FAQBlock from '../_components/FAQBlock';

export default function Page() {
  return (
    <>
      <Section tone="gradient" pattern="grid">
        <div className="mx-auto max-w-6xl px-0 py-12 md:py-20 sm:px-6 ">
          <TuneUpHeroWithCompactForm
            hero={tuneUpPage.hero}
            form={<TuneUpReviewForm />}
          />
        </div>
      </Section>
      <OurProcessSection
        title={tuneUpPage.whatHappensNext.title}
        steps={tuneUpPage.whatHappensNext.steps}
        tone="alt"
        pattern="none"
      />
      <OutcomesAndBestFor
        outcomes={{
          title: tuneUpPage.outcomes.title,
          items: tuneUpPage.outcomes.items,
        }}
        bestFor={{
          title: tuneUpPage.bestFor.title,
          items: tuneUpPage.bestFor.items,
        }}
      />
      <FAQBlock faqs={tuneUpPage.faqs} />
      <CallToAction
        titlePrefix="Ready to get"
        highlight="clarity"
        titleSuffix="on your website?"
        subtitle="Request a focused review and we'll reply within 1 business day."
        ctaLabel="Request Your Review"
        ctaHref="#tuneup-form"
      />
    </>
  );
}
