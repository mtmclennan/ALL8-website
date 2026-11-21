"use client";

import Link from "next/link";
import { ArrowRight, Search } from "lucide-react";

import { useLeadModal } from "@/app/(site)/_components/LeadModalProvider";
import Button from "@/app/(site)/_components/ui/Button";

type AboutHeroData = {
  pill: string;
  titlePrefix: string;
  titleEm: string;
  subtitle: string;
  subtitleStrong: string;
  primaryLabel: string;
  secondaryLabel: string;
  secondaryHref: string;
  micro: string;
};

export default function AboutHero({ data }: { data: AboutHeroData }) {
  const { openModal } = useLeadModal();

  return (
    <section className="relative overflow-hidden pt-[68px]" id="hero">
      <div className="absolute inset-0 bg-background" />
      <div
        className="absolute inset-0"
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

      <div className="relative z-[2] mx-auto max-w-[1160px] px-6 py-24 sm:px-10 sm:py-[96px]">
        <div className="max-w-[840px]">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-[rgba(0,118,255,.22)] bg-[rgba(0,118,255,.1)] py-1.5 pl-2.5 pr-3.5 text-[12.5px] font-semibold tracking-[.05em] text-accent-blue">
            <span className="h-[7px] w-[7px] flex-shrink-0 rounded-full bg-accent-blue" />
            {data.pill}
          </div>

          <h1 className="mb-[22px] all8-h1 font-black leading-[1] tracking-[-.03em]">
            {data.titlePrefix}
            <span className="text-accent-blue">{data.titleEm}</span>
          </h1>

          <p className="mb-[30px] max-w-[680px] text-lg leading-relaxed text-white/70">
            {data.subtitle}{" "}
            <strong className="font-bold text-white">
              {data.subtitleStrong}
            </strong>
          </p>

          <div className="mb-[22px] flex flex-wrap items-center gap-3.5">
            <Button onClick={openModal}>
              <Search size={16} strokeWidth={2.5} />
              {data.primaryLabel}
            </Button>
            <Link
              className="group inline-flex items-center gap-[7px] px-1 py-3.5 text-[15px] font-bold text-accent-blue hover:text-[#8ec5ff]"
              href={data.secondaryHref}
            >
              {data.secondaryLabel}
              <ArrowRight
                aria-hidden="true"
                className="transition-transform group-hover:translate-x-[3px] motion-reduce:group-hover:translate-x-0"
                size={14}
                strokeWidth={2.5}
              />
            </Link>
          </div>

          <p className="text-[13px] text-ink-faint">{data.micro}</p>
        </div>
      </div>
    </section>
  );
}
