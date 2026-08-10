import Reveal from "@/app/(site)/_components/home/Reveal";

type NextStepsData = {
  eyebrow: string;
  title: string;
  steps: { title: string; body: string }[];
};

export default function NextSteps({ data }: { data: NextStepsData }) {
  return (
    <section className="bg-content3 py-20 max-[960px]:py-16">
      <div className="mx-auto max-w-[1160px] px-6 sm:px-10">
        <Reveal className="mx-auto mb-[52px] max-w-[640px] text-center">
          <div className="mb-2.5 text-xs font-bold uppercase tracking-[.14em] text-accent-blue">
            {data.eyebrow}
          </div>
          <h2 className="text-[clamp(30px,3.4vw,46px)] font-extrabold leading-[1.06] tracking-[-.022em]">
            {data.title}
          </h2>
        </Reveal>

        <div className="mx-auto flex max-w-[820px] flex-col">
          {data.steps.map((step, i) => (
            <Reveal key={step.title} index={i}>
              <div
                className={`grid grid-cols-[44px_1fr] items-start gap-5 py-[22px] ${
                  i !== data.steps.length - 1
                    ? "border-b border-white/[0.08]"
                    : ""
                }`}
              >
                <div className="grid h-[30px] w-[30px] place-items-center rounded-full border border-[rgba(0,118,255,.28)] bg-[rgba(0,118,255,.13)] text-[12.5px] font-black text-accent-blue">
                  {i + 1}
                </div>
                <div>
                  <h3 className="mb-1.5 text-[17px] font-bold tracking-[-.012em]">
                    {step.title}
                  </h3>
                  <p className="text-[15.5px] leading-relaxed text-white/70">
                    {step.body}
                  </p>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
