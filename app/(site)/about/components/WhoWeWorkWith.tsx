import Reveal from "@/app/(site)/_components/home/Reveal";

type WhoData = {
  eyebrow: string;
  title: string;
  subtitle: string;
  chips: string[];
  note: string;
};

export default function WhoWeWorkWith({ data }: { data: WhoData }) {
  return (
    <section className="py-20 max-[960px]:py-16" id="who">
      <div className="mx-auto max-w-[1160px] px-6 sm:px-10">
        <Reveal className="mb-[52px] max-w-[720px]">
          <div className="mb-2.5 text-xs font-bold uppercase tracking-[.14em] text-accent-blue">
            {data.eyebrow}
          </div>
          <h2 className="text-[clamp(30px,3.4vw,46px)] font-extrabold leading-[1.06] tracking-[-.022em]">
            {data.title}
          </h2>
          <p className="mt-3.5 max-w-[620px] text-[17px] leading-relaxed text-white/70">
            {data.subtitle}
          </p>
        </Reveal>

        <Reveal>
          <div className="flex flex-wrap gap-2.5">
            {data.chips.map((chip) => (
              <span
                key={chip}
                className="rounded-full border border-white/[0.08] bg-white/[0.036] px-[17px] py-2.5 text-sm font-semibold text-white/70"
              >
                {chip}
              </span>
            ))}
          </div>
          <p className="mt-[26px] max-w-[640px] text-[15.5px] leading-relaxed text-white/40">
            {data.note}
          </p>
        </Reveal>
      </div>
    </section>
  );
}
