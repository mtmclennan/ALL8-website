import { Fragment } from 'react';

import ServiceArea from '../../components/ServiceArea';

import Faq from '../../components/Faq';
import ContactIntakeForm from '../../components/ContactIntakeForm';
// import logo from '../public/assets/all8-webworks-web-design-and-development-logo.png';
import { contactPageData } from '@/data/contactPage';
import { faqItems } from '@/data/faq';
import { TrustChipsRow } from '@/app/(site)/contact/components/TrustChipRow';
import { NextStepsSection } from '@/app/(site)/contact/components/NextStepsSections';
import ContactPageHero from '@/app/(site)/contact/components/ContactPageHero';

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
