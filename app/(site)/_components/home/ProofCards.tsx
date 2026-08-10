"use client";

import Link from "next/link";
import { LineChart, Search, MapPin } from "lucide-react";

import { useLeadModal } from "../LeadModalProvider";
import { Card } from "../SectionWrapper";
import Button from "../ui/Button";

import Reveal from "./Reveal";

type ProofCardsData = {
  eyebrow: string;
  title: string;
  cards: {
    value: string;
    em?: boolean;
    label: string;
    sub: string;
    icon: string;
  }[];
  footNote: string;
  footNoteLink?: { label: string; href: string };
  ctaLede?: string;
  ctaLabel?: string;
};

const ICONS: Record<string, typeof LineChart> = {
  chart: LineChart,
  search: Search,
  pin: MapPin,
};

export default function ProofCards({ data }: { data: ProofCardsData }) {
  const { openModal } = useLeadModal();

  return (
    <section className="bg-content3 py-20 max-[960px]:py-16" id="testimonials">
      <div className="mx-auto max-w-[1160px] px-6 sm:px-10">
        <Reveal className="mx-auto mb-11 max-w-[640px] text-center">
          <div className="mb-2.5 text-xs font-bold uppercase tracking-[.14em] text-accent-blue">
            {data.eyebrow}
          </div>
          <h2 className="text-[clamp(30px,3.4vw,46px)] font-extrabold leading-[1.06] tracking-[-.022em]">
            {data.title}
          </h2>
        </Reveal>

        <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
          {data.cards.map((card, i) => {
            const Icon = ICONS[card.icon] ?? LineChart;

            return (
              <Reveal key={card.label} index={i}>
                <Card
                  className="relative overflow-hidden p-[34px] sm:p-[34px]"
                  variant="lift"
                >
                  <div
                    className="pointer-events-none absolute -right-[30%] -top-[30%] h-[70%] w-[70%]"
                    style={{
                      background:
                        "radial-gradient(circle, rgba(0,118,255,.16) 0%, transparent 70%)",
                    }}
                  />
                  <div className="relative mb-[22px] grid h-[42px] w-[42px] place-items-center rounded-xl border border-[rgba(0,118,255,.24)] bg-[rgba(0,118,255,.12)] text-accent-blue">
                    <Icon size={20} strokeWidth={2.2} />
                  </div>
                  <div className="relative mb-3 text-[clamp(38px,4.4vw,52px)] font-black leading-none tracking-[-.035em]">
                    {card.em ? (
                      <span className="text-accent-blue">{card.value}</span>
                    ) : (
                      card.value
                    )}
                  </div>
                  <div className="relative mb-[5px] text-lg font-bold tracking-[-.01em]">
                    {card.label}
                  </div>
                  <div className="relative text-[14.5px] leading-relaxed text-white/70">
                    {card.sub}
                  </div>
                  <div className="relative mt-[22px] border-t border-white/[0.08] pt-4 text-[11.5px] font-semibold uppercase tracking-[.05em] text-white/70">
                    Real anonymized client data
                  </div>
                </Card>
              </Reveal>
            );
          })}
        </div>

        <p className="mx-auto mt-9 max-w-[660px] text-center text-[15px] leading-relaxed text-white/70">
          {data.footNote}{" "}
          {data.footNoteLink && (
            <Link
              className="text-accent-blue hover:text-[#8ec5ff]"
              href={data.footNoteLink.href}
            >
              {data.footNoteLink.label} →
            </Link>
          )}
        </p>

        {data.ctaLede && data.ctaLabel && (
          <Reveal className="mt-10 flex flex-wrap items-center justify-center gap-6 rounded-[20px] border border-white/[0.08] bg-white/[0.036] px-8 py-8 text-center">
            <p className="text-lg font-bold tracking-[-.015em]">
              {data.ctaLede}
            </p>
            <Button onClick={openModal}>{data.ctaLabel}</Button>
          </Reveal>
        )}
      </div>
    </section>
  );
}
