'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Fragment, useRef } from 'react';
import { Phone } from 'lucide-react';
import ServiceArea from './ServiceArea';
import Faq from './Faq';
import ContactForm from './ContactForm';
import logo from '../public/assets/BellhouseLogo-text.png';
import { contactPageData } from '../app/data/contactPage';
import { faqItems } from '@/app/data/faq';

const Contact = () => {
  const contactFormRef = useRef<{ scrollToForm: () => void } | null>(null);

  const { headline, brandName, tagline, description, subheading, phone } =
    contactPageData;

  return (
    <Fragment>
      <section className="bg-gray-900 text-white py-20 px-6 text-center relative">
        <div className="max-w-3xl mx-auto space-y-6">
          <div className="flex justify-center">
            <Image
              src={logo}
              alt={`${brandName} logo`}
              quality={80}
              width={200}
              height={155}
              sizes="(max-width: 375px) 120px, (max-width: 768px) 160px, 200px"
              priority
            />
          </div>

          <h1 className="text-4xl font-bold">
            {headline}{' '}
            <span className="font-light">{brandName.split(' ')[0]}</span>
            <span className="text-yellow-400"> {brandName.split(' ')[1]}</span>
          </h1>

          <p className="italic text-lg text-gray-300">{tagline}</p>

          <p className="text-white/90">{description}</p>

          <h3 className="text-2xl font-semibold">{subheading}</h3>

          <Link
            href={`tel:${phone}`}
            className="flex justify-center items-center gap-2"
          >
            <Phone size={48} color="#ffc302" />
            <h2 className="text-yellow-400 text-2xl font-bold">({phone})</h2>
          </Link>

          <div className="mt-6">
            <button
              onClick={() => contactFormRef.current?.scrollToForm()}
              className="bg-yellow-400 hover:bg-yellow-300 text-black font-bold py-3 px-6 rounded-full shadow transition"
            >
              Contact Us Now
            </button>
          </div>
        </div>
      </section>

      <ContactForm ref={contactFormRef} />
      <ServiceArea colorDark={true} />
      <Faq items={faqItems} phone="876-354-6754" />
    </Fragment>
  );
};

export default Contact;
