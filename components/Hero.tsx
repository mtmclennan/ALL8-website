import React from 'react';
import { title, subtitle } from '@/components/primitives';
import { button as buttonStyles } from '@heroui/theme';
import { Link } from '@heroui/link';

interface HeroProps {
  heading: string;
  subHeading: string;
  ctaText: string;
}

export default function Hero({ heading, subHeading, ctaText }: HeroProps) {
  return (
    <section className="flex flex-col items-center justify-center gap-4 py-8 md:py-10">
      <div className="inline-block max-w-xl text-center justify-center">
        <h1 className={title()}>{heading}</h1>
        <p className={subtitle({ class: 'mt-4' })}>{subHeading}</p>
      </div>
      <div className="flex gap-3">
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
    </section>
  );
}
