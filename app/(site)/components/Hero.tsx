import React from 'react';
import { title, subtitle } from '@/app/(site)/components/primitives';
import { button as buttonStyles } from '@heroui/theme';
import { Link } from '@heroui/link';
import Image from 'next/image';
import hero from '../public/assets/all8-webworks-performance-dashboard-faster-converting-websites.png';

interface HeroProps {
  heading: string;
  subHeading: string;
  ctaText: string;
}

export default function Hero({ heading, subHeading, ctaText }: HeroProps) {
  return (
    <section className="w-full h-screen bg-gradient-to-br from-black via-gray-900 to-[#0e1a2b] flex flex-col md:flex-row gap-4 min-h-screen">
      <div className="flex w-full items-center justify-center gap-10">
        <div className="flex flex-col max-w-xl text-center justify-center">
          <h1 className={title({ size: 'lg' })}>{heading}</h1>
          <p className={subtitle({ class: 'mt-4' })}>{subHeading}</p>
          <div className="flex justify-center gap-5">
            <Link
              className={buttonStyles({
                color: 'primary',
                radius: 'sm',
                variant: 'shadow',
              })}
              href="/contact"
            >
              {ctaText}
            </Link>
            <Link
              className={buttonStyles({ variant: 'bordered', radius: 'sm' })}
              href="/about"
            >
              Learn more
            </Link>
          </div>
        </div>
        <div className="flex">
          <Image
            width={500}
            height={500}
            src={hero}
            alt="ALL8 Webworks performance dashboard showing high Lighthouse score, improved SEO rankings, reduced bounce rate, and increased leads for faster, higher-converting websites"
          />
        </div>
      </div>
    </section>
  );
}
