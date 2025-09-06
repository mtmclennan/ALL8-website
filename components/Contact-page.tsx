import { Fragment } from 'react';

import ServiceArea from './ServiceArea';

import Faq from './Faq';
import ContactIntakeForm from './ContactIntakeForm';
// import logo from '../public/assets/all8-webworks-web-design-and-development-logo.png';
import { contactPageData } from '../data/contactPage';
import { faqItems } from '@/data/faq';
import { TrustChipsRow } from '../app/contact/components/TrustChipRow';
import { NextStepsSection } from '../app/contact/components/NextStepsSections';
import ContactPageHero from '@/app/contact/components/ContactPageHero';

const Contact = () => {
  const { headline, brandName, tagline, description, subheading, phone } =
    contactPageData;

  return (
    <Fragment>
      <ContactPageHero />
      <TrustChipsRow />
      <ContactIntakeForm />
      <NextStepsSection />
      <ServiceArea colorDark={true} />
      <Faq items={faqItems} phone="876-354-6754" />
    </Fragment>
  );
};

export default Contact;
