import type {
  ServiceFix as ServiceFixData,
  ServiceIncluded as ServiceIncludedData,
  ServiceWorksWith as ServiceWorksWithData,
} from "@/data/services";

import { Check, Plug, Plus } from "lucide-react";

export default function ServiceFix({
  fix,
  included,
  worksWith,
}: {
  fix: ServiceFixData;
  included: ServiceIncludedData;
  worksWith?: ServiceWorksWithData;
}) {
  if (!fix?.body?.length) return null;

  return (
    <section className="bg-content3 py-24 max-[960px]:py-16" id="fix">
      <div className="mx-auto max-w-[1160px] px-6 sm:px-10">
        <h2 className="all8-h2 font-extrabold leading-[1.08] tracking-[-.022em]">
          {fix.title}
        </h2>
        <div className="mt-8 grid gap-9 lg:grid-cols-[0.9fr_1.1fr] lg:gap-16">
          <div className="space-y-5 font-body text-[17px] leading-relaxed text-white/70">
            {fix.body.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
          </div>

          <div id="included">
            <h3 className="all8-h3 font-bold">What ALL8 can provide</h3>
            <p className="mt-2 font-body text-sm leading-relaxed text-white/60">
              The relevant plan and agreed scope determine which of these
              capabilities are included.
            </p>
            <ul className="mt-5 grid gap-x-7 gap-y-3 sm:grid-cols-2">
              {included.standard.map((item) => (
                <li key={item} className="flex items-start gap-2.5">
                  <Check
                    aria-hidden="true"
                    className="mt-0.5 shrink-0 text-accent-blue"
                    size={17}
                  />
                  <span className="font-body text-[15px] leading-relaxed text-white/80">
                    {item}
                  </span>
                </li>
              ))}
            </ul>
            {!!included.addOns?.length && (
              <div className="mt-7 border-t border-white/[0.1] pt-6">
                <h3 className="all8-h3 font-bold">Related work we can scope</h3>
                <ul className="mt-4 grid gap-x-7 gap-y-3 sm:grid-cols-2">
                  {included.addOns.map((item) => (
                    <li key={item} className="flex items-start gap-2.5">
                      <Plus
                        aria-hidden="true"
                        className="mt-0.5 shrink-0 text-accent-blue"
                        size={17}
                      />
                      <span className="font-body text-[15px] leading-relaxed text-white/80">
                        {item}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>

        {!!worksWith?.tools?.length && (
          <div
            className="mt-10 border-t border-white/[0.1] pt-8"
            id="works-with"
          >
            <h3 className="all8-h3 font-bold">
              {worksWith.title || "Works with what you already have"}
            </h3>
            {worksWith.intro && (
              <p className="mt-2 max-w-[700px] font-body text-sm leading-relaxed text-white/70">
                {worksWith.intro}
              </p>
            )}
            <ul className="mt-4 flex flex-wrap gap-2.5">
              {worksWith.tools.map((tool) => (
                <li
                  key={tool}
                  className="flex items-center gap-2 rounded-full border border-white/[0.1] bg-white/[0.04] px-4 py-2 text-sm text-white/70"
                >
                  <Plug
                    aria-hidden="true"
                    className="text-accent-blue"
                    size={14}
                  />
                  {tool}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </section>
  );
}
