import { Fragment } from 'react';

import ContactIntakeForm from './ContactIntakeForm';
import contactData from '@/data/pages/contact.json';
// import { contactPageData } from '@/data/contactPage';
import ContactPageHero from '@/app/(site)/contact/components/ContactPageHero';
import ProcessSection from '../../_components/OurProcess';
import CallToAction from '../../_components/CallToAction';
import ServicesOverviewRefactored from '../../_components/Services';
import FAQBlock from '../../_components/FAQBlock';

type FAQTone = 'base' | 'alt' | 'dim';

type ContactPageJson = {
  faqs?: {
    title?: string;
    subtitle?: string;
    tone?: FAQTone;
    items?: { q: string; a: string }[];
  };
};

const page = contactData as ContactPageJson;

const Contact = () => {
  return (
    <Fragment>
      <ContactPageHero hero={contactData.hero} />
      {/* <TrustChipsRow /> */}
      <ContactIntakeForm />
      <ProcessSection
        steps={contactData.process.steps}
        title={contactData.process.title}
        subtitle={contactData.process.subtitle}
      />
      <FAQBlock
        subtitle={page.faqs?.subtitle}
        faqs={page.faqs?.items ?? []}
        title={page.faqs?.title}
        tone={page.faqs?.tone}
      />
      <CallToAction
        titlePrefix={contactData.cta.titlePrefix}
        titleSuffix={contactData.cta.titleSuffix}
        highlight={contactData.cta.highlight}
        subtitle={contactData.cta.subtitle}
        ctaHref={contactData.cta.ctaHref}
        ctaLabel={contactData.cta.ctaLabel}
      />
      <ServicesOverviewRefactored
        title="What We Build for You"
        subtitle="Websites, SEO, hosting, and more — everything tuned for speed, search, and results."
      />
    </Fragment>
  );
};

export default Contact;
