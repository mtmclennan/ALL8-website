import Image from "next/image";
import Link from "next/link";
import { Search, ArrowRight } from "lucide-react";

import refinement from "../VisualRefinement.module.css";
import LeadReviewButton from "../LeadReviewButton";

import { type Stage } from "@/lib/utils/stage";

type HeroData = {
  pill: string;
  titlePrefix: string;
  titleEm: string;
  subtitle: string;
  subtitleStrong: string;
  badges: { label: string; stage: Stage }[];
  ctaLabel: string;
  secondaryLabel: string;
  secondaryHref: string;
  micro: string;
  geo: string;
  image: { src: string; alt: string; width: number; height: number };
};

const transparentPixel =
  "data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7";

export default function HeroSection({ data }: { data: HeroData }) {
  return (
    <section
      className={`${refinement.homeHero} relative overflow-hidden`}
      id="hero"
    >
      <div className="absolute inset-0 bg-background" />
      <div
        className="absolute inset-0 opacity-100"
        style={{
          backgroundImage:
            "linear-gradient(rgba(0,118,255,.05) 1px, transparent 1px), linear-gradient(90deg, rgba(0,118,255,.05) 1px, transparent 1px)",
          backgroundSize: "44px 44px",
        }}
      />
      <div
        className="absolute right-0 top-0 h-full w-[60%]"
        style={{
          background:
            "radial-gradient(60% 70% at 80% 25%, rgba(0,64,150,.55) 0%, rgba(11,15,26,0) 65%)",
        }}
      />

      <div className="relative z-[2] mx-auto grid w-full max-w-[1280px] items-center gap-10 px-6 sm:px-10 lg:grid-cols-[minmax(0,1fr)_minmax(420px,0.95fr)] lg:gap-14 xl:gap-20">
        <div
          className={`${refinement.heroCopy} relative z-[2] w-full py-20 max-lg:py-10`}
        >
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-[rgba(0,118,255,.22)] bg-[rgba(0,118,255,.1)] py-1.5 pl-2.5 pr-3.5 text-[12.5px] font-semibold tracking-[.05em] text-accent-blue">
            <span className="h-[7px] w-[7px] flex-shrink-0 rounded-full bg-accent-blue" />
            {data.pill}
          </div>

          <h1 className="mb-[22px] all8-display font-black leading-[1] tracking-[-.03em]">
            {data.titlePrefix}
            <span className="text-accent-blue">{data.titleEm}</span>
          </h1>

          <p className="mb-[30px] max-w-[470px] text-lg leading-relaxed text-white/70">
            {data.subtitle}{" "}
            <strong className="font-bold text-white">
              {data.subtitleStrong}
            </strong>
          </p>

          <div className="mb-[22px] flex flex-wrap items-center gap-3.5">
            <LeadReviewButton>
              <Search size={16} strokeWidth={2.5} />
              {data.ctaLabel}
            </LeadReviewButton>
            <Link
              className="group inline-flex items-center gap-[7px] px-1 py-3.5 text-[15px] font-bold text-accent-blue hover:text-[#8ec5ff]"
              href={data.secondaryHref}
            >
              {data.secondaryLabel}
              <ArrowRight
                className="transition-transform group-hover:translate-x-[3px]"
                size={14}
                strokeWidth={2.5}
              />
            </Link>
          </div>

          <p className="text-[13px] text-ink-faint">{data.micro}</p>
        </div>

        <div className="pointer-events-none relative hidden w-full place-items-center sm:grid max-lg:mt-6">
          <div className="relative w-full">
            <div
              className="absolute inset-0 z-0"
              style={{
                background:
                  "radial-gradient(50% 46% at 52% 50%, rgba(0,90,210,.22) 0%, transparent 70%)",
              }}
            />
            <picture>
              <source media="(width < 640px)" srcSet={transparentPixel} />
              <Image
                alt={data.image.alt}
                className="relative z-[1] mx-auto h-auto w-full max-w-[600px] drop-shadow-[0_20px_40px_rgba(0,0,0,.35)] max-lg:w-[88%] max-lg:max-w-[300px]"
                fetchPriority="high"
                height={data.image.height}
                loading="eager"
                sizes="(min-width: 1280px) 550px, (min-width: 1024px) 45vw, 300px"
                src={data.image.src}
                width={data.image.width}
              />
            </picture>
          </div>
        </div>
      </div>
    </section>
  );
}
