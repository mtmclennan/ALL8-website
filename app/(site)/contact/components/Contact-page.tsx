import { Fragment } from 'react';

import ContactIntakeForm from './ContactIntakeForm';
import contactData from '@/data/pages/contact.json';
// import { contactPageData } from '@/data/contactPage';
import ContactPageHero from '@/app/(site)/contact/components/ContactPageHero';
import ProcessSection from '../../components/OurProcess';
import CallToAction from '../../components/CallToAction';

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
