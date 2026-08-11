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
          <h2 className="text-[clamp(30px,3.4vw,46px)] font-extrabold leading-[1.06] tracking-[-.022em]">
            {howItWorks.title || "How This Gets Set Up"}
          </h2>
        </Reveal>

        <div className="relative grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
          <div className="pointer-events-none absolute left-[12.5%] right-[12.5%] top-[37px] hidden h-px bg-gradient-to-r from-transparent via-[rgba(26,124,240,.4)] via-20% to-transparent lg:block" />
          {howItWorks.steps.map((step, i) => (
            <Reveal
              key={step.title}
              className="flex flex-col items-center px-5 text-center"
              index={i}
            >
              <div className="relative z-[1] mb-6 grid h-[76px] w-[76px] place-items-center rounded-full border-[1.5px] border-[rgba(0,118,255,.45)] text-[28px] font-black text-accent-blue">
                <span className="pointer-events-none absolute -inset-[7px] rounded-full border border-dashed border-[rgba(0,118,255,.26)]" />
                {i + 1}
              </div>
              <h3 className="mb-2.5 text-[17px] font-bold">{step.title}</h3>
              <p className="text-sm leading-relaxed text-white/70">
                {step.description}
              </p>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
