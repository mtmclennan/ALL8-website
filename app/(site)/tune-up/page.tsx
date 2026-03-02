import { Section } from '@/app/(site)/_components/SectionWrapper';
import tuneUpPage from '@/data/pages/tuneUpPage.json';
import TuneUpReviewForm from './_components/TuneUpReviewForm';
import TuneUpHeroWithCompactForm from './_components/TuneUpPageHero';

export default function Page() {
  return (
    <main>
      <Section tone="dim" pattern="none">
        <div className="mx-auto max-w-6xl px-6 py-12 md:py-20">
          <TuneUpHeroWithCompactForm
            hero={tuneUpPage.hero}
            form={<TuneUpReviewForm />}
          />
        </div>
      </Section>

      {/* next sections below if needed */}
    </main>
  );
}
