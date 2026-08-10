import InlineLeadForm from "./InlineLeadForm";

import Reveal from "@/app/(site)/_components/home/Reveal";

type FormSectionData = { eyebrow: string; title: string; subtitle: string };

export default function FormSection({ data }: { data: FormSectionData }) {
  return (
    <section className="bg-content3 py-24 max-[960px]:py-16" id="form">
      <div className="mx-auto max-w-[1160px] px-6 sm:px-10">
        <Reveal className="mx-auto mb-11 max-w-[640px] text-center">
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
        <Reveal>
          <InlineLeadForm />
        </Reveal>
      </div>
    </section>
  );
}
