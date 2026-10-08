import type { ServiceHowItWorks as ServiceHowItWorksData } from "@/data/services";

import Reveal from "@/app/(site)/_components/home/Reveal";

export default function ServiceHowItWorks({
  howItWorks,
}: {
  howItWorks: ServiceHowItWorksData;
}) {
  if (!howItWorks?.steps?.length) return null;

  return (
    <section className="py-24 max-[960px]:py-16" id="how-it-works">
      <div className="mx-auto max-w-[1160px] px-6 sm:px-10">
        <Reveal className="mx-auto mb-[52px] max-w-[640px] text-center">
          <div className="mb-2.5 text-xs font-bold uppercase tracking-[.14em] text-accent-blue">
            How It Works
          </div>
          <h2 className="all8-h2 font-extrabold leading-[1.06] tracking-[-.022em]">
            {howItWorks.title || "How This Gets Set Up"}
          </h2>
        </Reveal>

        <div className="relative grid grid-cols-1 gap-6 sm:grid-cols-2 sm:gap-8 lg:grid-cols-4">
          <div className="pointer-events-none absolute left-[12.5%] right-[12.5%] top-[37px] hidden h-px bg-gradient-to-r from-transparent via-[rgba(26,124,240,.4)] via-20% to-transparent lg:block" />
          {howItWorks.steps.map((step, i) => (
            <Reveal
              key={step.title}
              className="flex items-start gap-4 sm:flex-col sm:items-center sm:px-5 sm:text-center"
              index={i}
            >
              <div className="relative z-[1] grid h-11 w-11 shrink-0 place-items-center rounded-full border-[1.5px] border-[rgba(0,118,255,.45)] text-lg font-black text-accent-blue sm:mb-6 sm:h-[76px] sm:w-[76px] sm:text-[28px]">
                <span className="pointer-events-none absolute -inset-[7px] hidden rounded-full border border-dashed border-[rgba(0,118,255,.26)] sm:block" />
                {i + 1}
              </div>
              <div>
                <h3 className="mb-1.5 text-[17px] font-bold sm:mb-2.5">
                  {step.title}
                </h3>
                <p className="font-body text-sm leading-relaxed text-white/70">
                  {step.description}
                </p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
