import type { ServiceWorksWith as ServiceWorksWithData } from "@/data/services";

import { Plug } from "lucide-react";

import Reveal from "@/app/(site)/_components/home/Reveal";

export default function ServiceWorksWith({
  worksWith,
}: {
  worksWith?: ServiceWorksWithData;
}) {
  if (!worksWith?.tools?.length) return null;

  return (
    <section className="bg-content3 py-24 max-[960px]:py-16" id="works-with">
      <div className="mx-auto max-w-[900px] px-6 sm:px-10">
        <Reveal className="mb-8">
          <div className="mb-2.5 text-xs font-bold uppercase tracking-[.14em] text-accent-blue">
            {worksWith.title || "Works With What You Already Have"}
          </div>
          {worksWith.intro && (
            <p className="max-w-[640px] text-[17px] leading-relaxed text-white/70">
              {worksWith.intro}
            </p>
          )}
        </Reveal>

        <Reveal className="flex flex-wrap gap-2.5" index={1}>
          {worksWith.tools.map((tool) => (
            <div
              key={tool}
              className="flex items-center gap-2 rounded-full border border-white/[0.08] bg-white/5 px-[15px] py-2 text-[13.5px] font-semibold text-white/70"
            >
              <Plug className="text-accent-blue" size={13} strokeWidth={2.4} />
              {tool}
            </div>
          ))}
        </Reveal>
      </div>
    </section>
  );
}
