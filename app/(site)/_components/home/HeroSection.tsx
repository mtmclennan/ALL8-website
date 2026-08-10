"use client";

import Image from "next/image";
import Link from "next/link";
import { Search, ArrowRight } from "lucide-react";

import { useLeadModal } from "../LeadModalProvider";
import Button from "../ui/Button";

import { STAGE_HEX, type Stage } from "@/lib/utils/stage";

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

export default function HeroSection({ data }: { data: HeroData }) {
  const { openModal } = useLeadModal();

  return (
    <section
      className="relative flex min-h-screen items-center overflow-hidden pt-[68px] max-[960px]:min-h-0 max-[960px]:flex-col max-[960px]:items-start max-[960px]:pt-[100px]"
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

      <div className="relative z-[2] mx-auto w-full max-w-[1160px] px-6 sm:px-10">
        <div className="relative z-[2] w-[52%] py-20 max-[960px]:w-full max-[960px]:py-10">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-[rgba(0,118,255,.22)] bg-[rgba(0,118,255,.1)] py-1.5 pl-2.5 pr-3.5 text-[12.5px] font-semibold tracking-[.05em] text-accent-blue">
            <span className="h-[7px] w-[7px] flex-shrink-0 rounded-full bg-stage-win shadow-[0_0_8px_#22c55e]" />
            {data.pill}
          </div>

          <h1 className="mb-[22px] text-[clamp(40px,4.6vw,66px)] font-black leading-[1] tracking-[-.03em]">
            {data.titlePrefix}
            <span className="text-accent-blue">{data.titleEm}</span>
          </h1>

          <p className="mb-[30px] max-w-[470px] text-lg leading-relaxed text-white/70">
            {data.subtitle}{" "}
            <strong className="font-bold text-white">
              {data.subtitleStrong}
            </strong>
          </p>

          <div className="mb-9 flex flex-wrap gap-2.5">
            {data.badges.map((b) => (
              <div
                key={b.label}
                className="flex items-center gap-2 rounded-full border border-white/[0.08] bg-white/5 px-[15px] py-2 text-[13px] font-semibold text-white/70"
              >
                <span
                  className="h-[7px] w-[7px] flex-shrink-0 rounded-full"
                  style={{
                    backgroundColor: STAGE_HEX[b.stage],
                    boxShadow: `0 0 7px ${STAGE_HEX[b.stage]}`,
                  }}
                />
                {b.label}
              </div>
            ))}
          </div>

          <div className="mb-[22px] flex flex-wrap items-center gap-3.5">
            <Button onClick={openModal}>
              <Search size={16} strokeWidth={2.5} />
              {data.ctaLabel}
            </Button>
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

          <p className="text-[13px] text-white/40">{data.micro}</p>
          <p className="mt-[9px] flex items-center gap-[7px] text-[12.5px] text-white/40">
            <span className="h-[5px] w-[5px] flex-shrink-0 rounded-full bg-white/40" />
            {data.geo}
          </p>
        </div>
      </div>

      <div className="pointer-events-none relative mx-auto grid w-full max-w-[1160px] px-6 max-[960px]:mt-6 max-[960px]:place-items-center max-[960px]:px-6 sm:px-10 lg:absolute lg:inset-y-0 lg:right-0 lg:mx-0 lg:w-1/2 lg:max-w-none lg:place-items-center lg:px-0">
        <div className="relative">
          <div
            className="absolute inset-0 z-0"
            style={{
              background:
                "radial-gradient(50% 46% at 52% 50%, rgba(0,90,210,.22) 0%, transparent 70%)",
            }}
          />
          <Image
            priority
            alt={data.image.alt}
            className="relative z-[1] h-auto w-[92%] max-w-[640px] drop-shadow-[0_40px_80px_rgba(0,0,0,.55)] max-[960px]:mx-auto max-[960px]:w-[88%] max-[960px]:max-w-[420px]"
            fetchPriority="high"
            height={data.image.height}
            src={data.image.src}
            width={data.image.width}
          />
        </div>
      </div>
    </section>
  );
}
