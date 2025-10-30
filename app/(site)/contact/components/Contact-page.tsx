import { Fragment } from 'react';

import ServiceArea from '../../components/ServiceArea';

import Faq from '../../components/Faq';
import ContactIntakeForm from './ContactIntakeForm';
import contactData from '@/data/pages/contact.json';
// import logo from '../public/assets/all8-webworks-web-design-and-development-logo.png';
import { contactPageData } from '@/data/contactPage';
import { faqItems } from '@/data/faq';
import { TrustChipsRow } from '@/app/(site)/contact/components/TrustChipRow';
import { NextStepsSection } from '@/app/(site)/contact/components/NextStepsSections';
import ContactPageHero from '@/app/(site)/contact/components/ContactPageHero';
import { ProcessSection } from '../../components/OurProcess';
import CallToAction from '../../components/CallToAction';

const Contact = () => {
  const { headline, brandName, tagline, description, subheading, phone } =
    contactPageData;

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
      <CallToAction
        titlePrefix={contactData.cta.titlePrefix}
        titleSuffix={contactData.cta.titleSuffix}
        highlight={contactData.cta.highlight}
        subtitle={contactData.cta.subtitle}
        ctaHref={contactData.cta.ctaHref}
        ctaLabel={contactData.cta.ctaLabel}
      />
    </Fragment>
  );
};

export default Contact;
