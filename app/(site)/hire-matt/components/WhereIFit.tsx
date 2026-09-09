import type { HireMattPageData } from "@/data/pages/hire-matt";

import refinement from "../../_components/VisualRefinement.module.css";
import Reveal from "../../_components/home/Reveal";

export default function WhereIFit({ data }: { data: HireMattPageData["fit"] }) {
  return (
    <section className="bg-content3 py-24 max-[960px]:py-16" id="fit">
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

        <Reveal>
          <ul
            className={`${refinement.fitRoles} flex max-w-[880px] flex-wrap gap-2.5`}
          >
            {data.roles.map((role) => (
              <li
                key={role}
                className="rounded-full border border-[rgba(61,151,255,.24)] bg-[rgba(61,151,255,.09)] px-[18px] py-[11px] text-[14.5px] font-semibold text-[#cfe4ff]"
              >
                {role}
              </li>
            ))}
          </ul>
        </Reveal>

        <Reveal index={1}>
          <div className="mt-10 max-w-[820px] rounded-r-[20px] border border-white/[0.08] border-l-2 border-l-accent-blue bg-white/[0.036] px-6 py-6 sm:px-8 sm:py-7">
            <h4 className="mb-3 text-[11px] font-bold uppercase tracking-[.14em] text-white/40">
              {data.thread.heading}
            </h4>
            <p className="text-xl font-bold leading-snug tracking-[-.02em] text-white">
              {data.thread.lead}
            </p>
            <p className="mt-3 text-base leading-relaxed text-white/70">
              {data.thread.body}
            </p>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
