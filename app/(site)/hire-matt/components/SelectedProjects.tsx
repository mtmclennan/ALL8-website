import type { HireMattPageData } from "@/data/pages/hire-matt";

import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

import Reveal from "../../_components/home/Reveal";

import { renderBold } from "@/lib/utils/renderBold";
import { hexToRgba } from "@/lib/utils/stage";

export default function SelectedProjects({
  data,
}: {
  data: HireMattPageData["projects"];
}) {
  return (
    <section className="py-24 max-[960px]:py-16" id="projects">
      <div className="mx-auto max-w-[1160px] px-6 sm:px-10">
        <Reveal className="mb-14 max-w-[760px]">
          <div className="mb-2.5 text-xs font-bold uppercase tracking-[.14em] text-accent-blue">
            {data.eyebrow}
          </div>
          <h2 className="text-[clamp(30px,3.4vw,46px)] font-extrabold leading-[1.06] tracking-[-.024em]">
            {data.title}
          </h2>
          <p className="mt-4 max-w-[620px] text-[17px] leading-relaxed text-white/70">
            {data.subtitle}
          </p>
        </Reveal>

        <div className="grid grid-cols-1 gap-[22px] lg:grid-cols-2">
          {data.cards.map((card, i) => (
            <Reveal key={card.name} index={i}>
              <article className="flex h-full flex-col rounded-2xl bg-white/[0.036] p-[30px] ring-1 ring-white/[0.08] transition-all duration-300 hover:-translate-y-[3px] hover:bg-white/[0.058] hover:shadow-[0_20px_50px_-14px_rgba(0,0,0,.55)] sm:p-[32px]">
                {card.brand && (
                  <div
                    aria-hidden="true"
                    className="mb-7 grid h-20 grid-cols-[88px_minmax(0,1fr)] gap-3 sm:grid-cols-[104px_minmax(0,1fr)]"
                  >
                    <div
                      className={`flex min-w-0 items-center justify-center overflow-hidden rounded-xl border ${
                        card.brand.surface === "light"
                          ? "border-white/15 bg-[#e5e7eb]"
                          : "border-white/[0.08] bg-black/15"
                      }`}
                    >
                      <Image
                        alt=""
                        className={
                          card.brand.surface === "light"
                            ? "h-full w-full object-cover"
                            : "h-full w-full object-contain p-3"
                        }
                        height={card.brand.mark.height}
                        src={card.brand.mark.src}
                        width={card.brand.mark.width}
                      />
                    </div>
                    <div
                      className={`flex min-w-0 items-center justify-center overflow-hidden rounded-xl border ${
                        card.brand.surface === "light"
                          ? "border-white/15 bg-[#e5e7eb]"
                          : "border-white/[0.08] bg-black/15"
                      }`}
                    >
                      <Image
                        alt=""
                        className={
                          card.brand.surface === "light"
                            ? "h-full w-full object-cover"
                            : "h-full w-full object-contain p-4 sm:p-5"
                        }
                        height={card.brand.logo.height}
                        src={card.brand.logo.src}
                        width={card.brand.logo.width}
                      />
                    </div>
                  </div>
                )}
                <div className="mb-1.5 flex flex-wrap items-baseline justify-between gap-3.5">
                  <h3 className="text-[22px] font-extrabold tracking-[-.022em]">
                    {card.name}
                  </h3>
                  <span
                    className="whitespace-nowrap pt-[3px] font-mono text-[10px] font-bold uppercase tracking-[.13em]"
                    style={{ color: card.color }}
                  >
                    {card.kind}
                  </span>
                </div>
                <p className="mb-[22px] text-[13.5px] text-white/40">
                  {card.role}
                </p>
                <dl>
                  <div className="grid grid-cols-1 gap-1.5 border-t border-white/[0.08] py-[13px] sm:grid-cols-[74px_1fr] sm:gap-3.5">
                    <dt className="font-mono text-[10px] font-bold uppercase tracking-[.11em] text-white/40 sm:pt-1">
                      Problem
                    </dt>
                    <dd className="text-[15px] leading-relaxed text-white/70">
                      {card.problem}
                    </dd>
                  </div>
                  <div className="grid grid-cols-1 gap-1.5 border-t border-white/[0.08] py-[13px] sm:grid-cols-[74px_1fr] sm:gap-3.5">
                    <dt className="font-mono text-[10px] font-bold uppercase tracking-[.11em] text-white/40 sm:pt-1">
                      Built
                    </dt>
                    <dd className="text-[15px] leading-relaxed text-white/70">
                      {card.built}
                    </dd>
                  </div>
                  <div className="grid grid-cols-1 gap-1.5 border-t border-white/[0.08] py-[13px] sm:grid-cols-[74px_1fr] sm:gap-3.5">
                    <dt className="font-mono text-[10px] font-bold uppercase tracking-[.11em] text-white/40 sm:pt-1">
                      Proves
                    </dt>
                    <dd className="text-[15px] leading-relaxed text-white/70">
                      {renderBold(card.proves)}
                    </dd>
                  </div>
                </dl>
                <ul className="mt-[22px] flex flex-wrap gap-[7px] border-t border-white/[0.08] pt-5">
                  {card.tags.map((tag) => (
                    <li
                      key={tag}
                      className="rounded-full border px-3 py-1.5 text-xs font-semibold text-white/70"
                      style={{
                        borderColor: hexToRgba(card.color, 0.24),
                        backgroundColor: hexToRgba(card.color, 0.08),
                      }}
                    >
                      {tag}
                    </li>
                  ))}
                </ul>
                {card.href && card.linkLabel && (
                  <Link
                    className="mt-6 inline-flex items-center gap-2 self-start text-sm font-bold hover:text-white"
                    data-cta={`hire-project-${card.name.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`}
                    data-cta-event="hire_project_click"
                    href={card.href}
                    style={{ color: card.color }}
                  >
                    {card.linkLabel}
                    <ArrowRight size={15} strokeWidth={2.4} />
                  </Link>
                )}
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
