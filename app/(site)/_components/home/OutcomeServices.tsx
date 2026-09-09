"use client";

import Link from "next/link";
import {
  ArrowRight,
  Search,
  LayoutGrid,
  AlarmClock,
  ListChecks,
} from "lucide-react";

import { useLeadModal } from "../LeadModalProvider";
import { Card } from "../SectionWrapper";

import Reveal from "./Reveal";

import { STAGE_HEX, hexToRgba, type Stage } from "@/lib/utils/stage";

type OutcomesData = {
  eyebrow: string;
  title: string;
  subtitle: string;
  cards: {
    stage: Stage;
    title: string;
    description: string;
    href: string;
    linkLabel: string;
    items: string[];
  }[];
  footNote: { prefix: string; linkLabel: string };
};

const STAGE_ICON: Record<Stage, typeof Search> = {
  found: Search,
  contacted: LayoutGrid,
  follow: AlarmClock,
  win: ListChecks,
};

export default function OutcomeServices({ data }: { data: OutcomesData }) {
  return (
    <section className="py-24 max-[960px]:py-16" id="services">
      <div className="mx-auto max-w-[1160px] px-6 sm:px-10">
        <Reveal className="mx-auto mb-[60px] max-w-[640px] text-center">
          <div className="mb-2.5 text-xs font-bold uppercase tracking-[.14em] text-accent-blue">
            {data.eyebrow}
          </div>
          <h2 className="text-[clamp(30px,3.4vw,46px)] font-extrabold leading-[1.06] tracking-[-.022em]">
            {data.title}
          </h2>
          <p className="mx-auto mt-3.5 max-w-[560px] text-[17px] leading-relaxed text-white/70">
            {data.subtitle}
          </p>
        </Reveal>

        <div className="grid grid-cols-1 gap-[22px] md:grid-cols-2">
          {data.cards.map((card, i) => {
            const hex = STAGE_HEX[card.stage];
            const Icon = STAGE_ICON[card.stage];

            return (
              <Reveal key={card.title} index={i}>
                <Card
                  className="flex h-full flex-col p-[30px] sm:p-[34px]"
                  variant="lift"
                >
                  <div className="mb-4 flex items-center gap-3.5">
                    <div
                      className="grid h-12 w-12 flex-shrink-0 place-items-center rounded-[14px]"
                      style={{
                        backgroundColor: hexToRgba(hex, 0.11),
                        border: `1px solid ${hexToRgba(hex, 0.22)}`,
                        color: hex,
                      }}
                    >
                      <Icon size={24} strokeWidth={2} />
                    </div>
                    <h3 className="text-[19px] font-extrabold tracking-[-.015em]">
                      {card.title}
                    </h3>
                  </div>
                  <p className="mb-[22px] text-[15px] leading-relaxed text-white/70">
                    {card.description}
                  </p>
                  <ul className="mt-auto flex flex-1 flex-wrap content-start gap-2 border-t border-white/[0.08] pt-5">
                    {card.items.map((item) => (
                      <li
                        key={item}
                        className="rounded-full border border-white/[0.08] bg-white/5 px-3 py-1.5 text-[12.5px] font-semibold text-white/70"
                      >
                        {item}
                      </li>
                    ))}
                  </ul>
                  <Link
                    className="mt-[22px] inline-flex items-center gap-1.5 text-sm font-bold"
                    href={card.href}
                    style={{ color: hex }}
                  >
                    {card.linkLabel} <ArrowRight size={14} strokeWidth={2.5} />
                  </Link>
                </Card>
              </Reveal>
            );
          })}
        </div>

        <FootNote text={data.footNote} />
      </div>
    </section>
  );
}

function FootNote({ text }: { text: { prefix: string; linkLabel: string } }) {
  const { openModal } = useLeadModal();

  return (
    <p className="mt-[30px] text-center text-sm text-white/40">
      {text.prefix}{" "}
      <button
        className="text-accent-blue hover:text-[#8ec5ff]"
        type="button"
        onClick={openModal}
      >
        {text.linkLabel} →
      </button>
    </p>
  );
}
