"use client";

import { Search, Check, Phone, MessageCircle } from "lucide-react";

import { useLeadModal } from "../LeadModalProvider";
import Button from "../ui/Button";

import Reveal from "./Reveal";

import { siteConfig } from "@/config/site";
import { toTelHref } from "@/lib/utils/phone";

type FinalCtaData = {
  eyebrow: string;
  title: string;
  titleAccent: string;
  subtitle: string;
  checklist?: string[];
  ctaLabel: string;
  micro: string;
  primary?: { href: string; icon?: "search" | "sms" };
  secondary?: { label: string; href: string };
};

export default function FinalCta({ data }: { data: FinalCtaData }) {
  const { openModal } = useLeadModal();
  const telHref = toTelHref(siteConfig.phone);

  return (
    <section
      className="relative overflow-hidden py-[120px] text-center max-[960px]:py-20"
      id="cta"
    >
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(55% 65% at 50% 50%, rgba(0,70,165,.45) 0%, transparent 70%)",
        }}
      />
      <div className="relative z-[1] mx-auto max-w-[1160px] px-6 sm:px-10">
        <Reveal className="mb-4 text-xs font-bold uppercase tracking-[.14em] text-accent-blue">
          {data.eyebrow}
        </Reveal>
        <Reveal index={1}>
          <h2 className="mb-[18px] text-[clamp(36px,4.4vw,60px)] font-black leading-[1.02] tracking-[-.03em]">
            {data.title}
            <br />
            <span className="bg-gradient-to-br from-white from-40% to-accent-blue bg-clip-text text-transparent">
              {data.titleAccent}
            </span>
          </h2>
        </Reveal>
        <Reveal index={2}>
          <p className="mx-auto mb-[38px] max-w-[600px] text-lg leading-relaxed text-white/70">
            {data.subtitle}
          </p>
        </Reveal>
        {data.checklist && data.checklist.length > 0 && (
          <Reveal index={3}>
            <ul className="mx-auto mb-[38px] flex max-w-[700px] flex-wrap justify-center gap-x-[26px] gap-y-2.5">
              {data.checklist.map((item) => (
                <li
                  key={item}
                  className="flex items-center gap-2 text-[14.5px] font-semibold text-white/70"
                >
                  <Check
                    className="flex-shrink-0 text-stage-win"
                    size={16}
                    strokeWidth={3}
                  />
                  {item}
                </li>
              ))}
            </ul>
          </Reveal>
        )}
        <Reveal
          className="flex flex-wrap items-center justify-center gap-3.5"
          index={0}
        >
          {data.primary ? (
            <Button pulse href={data.primary.href} size="lg">
              {data.primary.icon === "sms" ? (
                <MessageCircle size={18} strokeWidth={2.5} />
              ) : (
                <Search size={18} strokeWidth={2.5} />
              )}
              {data.ctaLabel}
            </Button>
          ) : (
            <Button pulse size="lg" onClick={openModal}>
              <Search size={18} strokeWidth={2.5} />
              {data.ctaLabel}
            </Button>
          )}
          {data.secondary ? (
            <Button href={data.secondary.href} size="lg" variant="ghost">
              {data.secondary.label}
            </Button>
          ) : (
            <Button href={telHref} size="lg" variant="ghost">
              <Phone size={17} strokeWidth={2.2} />
              {siteConfig.phone}
            </Button>
          )}
        </Reveal>
        <Reveal index={1}>
          <p className="mt-[22px] text-[13px] text-white/40">{data.micro}</p>
        </Reveal>
      </div>
    </section>
  );
}
