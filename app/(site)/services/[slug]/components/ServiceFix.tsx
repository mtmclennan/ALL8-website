import type { ServiceFix as ServiceFixData } from "@/data/services";

import { Sparkles } from "lucide-react";

import Reveal from "@/app/(site)/_components/home/Reveal";

export default function ServiceFix({ fix }: { fix: ServiceFixData }) {
  if (!fix?.body?.length) return null;

  return (
    <section className="bg-content3 py-24 max-[960px]:py-16" id="fix">
      <div className="mx-auto max-w-[900px] px-6 sm:px-10">
        <Reveal className="mb-8 flex items-center gap-3">
          <span className="grid h-11 w-11 flex-shrink-0 place-items-center rounded-xl border border-[rgba(0,118,255,.22)] bg-[rgba(0,118,255,.12)] text-accent-blue">
            <Sparkles size={20} strokeWidth={2} />
          </span>
          <h2 className="text-[clamp(28px,3.2vw,42px)] font-extrabold leading-[1.08] tracking-[-.022em]">
            {fix.title}
          </h2>
        </Reveal>

        <div className="flex flex-col gap-5">
          {fix.body.map((p, i) => (
            <Reveal key={p} index={i}>
              <p className="max-w-[720px] text-[17px] leading-relaxed text-white/70">
                {p}
              </p>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
