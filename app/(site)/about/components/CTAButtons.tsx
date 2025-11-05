// components/CTAButtons.tsx
'use client';

import Link from 'next/link';
import { Button } from '@heroui/button';
import { ButtonGradientWrapper } from '@/app/(site)/components/SectionWrapper';

interface CTAButtonsProps {
  ctaHref: string;
  ctaLabel: string;
}

export function CTAButtons({ ctaHref, ctaLabel }: CTAButtonsProps) {
  return (
    <div className="mt-10 flex flex-wrap justify-center gap-4 sm:justify-start">
      <ButtonGradientWrapper>
        <Button
          as={Link}
          href={ctaHref}
          size="lg"
          color="primary"
          className="min-w-[180px] bg-chrome-cta hover:bg-chrome-cta-hover focus-visible:ring-2 focus-visible:ring-chrome"
          radius="md"
        >
          {ctaLabel}
        </Button>
      </ButtonGradientWrapper>

      <ButtonGradientWrapper>
        <Button
          as={Link}
          href="/contact"
          size="lg"
          className="min-w-[160px] border-white/20 text-white hover:bg-white/10 focus-visible:ring-2 focus-visible:ring-primary"
          radius="md"
        >
          Contact Us
        </Button>
      </ButtonGradientWrapper>
    </div>
  );
}
