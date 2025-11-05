import Image from 'next/image';
import aboutImage from '@/public/assets/all8-webworks-web-design-and-development-logo.png';
import { CTAButtons } from './CTAButtons';

interface AboutHeroProps {
  title: string;
  subtitle: string;
  body?: string;
  ctaLabel: string;
  ctaHref: string;
}

export default function AboutHero({
  title,
  subtitle,
  body,
  ctaLabel,
  ctaHref,
}: AboutHeroProps) {
  return (
    <section className="relative isolate overflow-hidden text-white min-h-[80vh] bg-blueprint bg-primary/5">
      {/* Background grid & glow */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 z-0"
      >
        <div className="absolute inset-0 opacity-70 mix-blend-overlay" />
        <div className="absolute inset-x-0 top-0 h-60 bg-gradient-to-b from-primary/30 to-transparent" />
      </div>

      {/* Content */}
      <div className="relative z-10 mx-auto max-w-[1600px] px-6 py-20 md:py-28 2xl:py-36">
        <div className="grid grid-cols-1 md:grid-cols-12 md:ml-4 items-center gap-4 2xl:gap-20">
          {/* Text */}
          <div className="max-w-3xl md:col-span-7">
            <h1 className="text-4xl md:text-6xl 2xl:text-7xl font-bold tracking-tight">
              {title}
            </h1>
            <p className="mt-6 text-base md:text-lg text-foreground/80 max-w-xl">
              {subtitle}
            </p>
            {body && (
              <p className="mt-6 text-base md:text-lg text-foreground/80 max-w-xl">
                {body}
              </p>
            )}

            {/* CTAs */}
            <CTAButtons ctaHref={ctaHref} ctaLabel={ctaLabel} />
          </div>

          {/* Image */}
          <div className="relative md:col-span-5 aspect-[5/4] w-full">
            <Image
              src={aboutImage}
              alt="ALL8 Webworks team building high-performance websites"
              fill
              sizes="(min-width: 1280px) 600px, (min-width: 768px) 50vw, 90vw"
              className="object-contain rounded-2xl shadow-lg"
              priority
              quality={75}
              placeholder="blur"
            />
            <div
              className="pointer-events-none absolute inset-0 -z-10 blur-3xl opacity-30"
              style={{
                background:
                  'radial-gradient(40% 40% at 60% 50%, rgba(0,118,255,0.5), transparent 70%)',
              }}
            />
          </div>
        </div>
      </div>
    </section>
  );
}
