import Reveal from "@/app/(site)/_components/home/Reveal";

type FactsData = {
  eyebrow: string;
  title: string;
  items: { k: string; v: string }[];
  note: string;
};

export default function Facts({ data }: { data: FactsData }) {
  return (
    <section className="bg-content3 py-20 max-[960px]:py-16" id="facts">
      <div className="mx-auto max-w-[1160px] px-6 sm:px-10">
        <Reveal className="mb-[52px] max-w-[720px]">
          <div className="mb-2.5 text-xs font-bold uppercase tracking-[.14em] text-accent-blue">
            {data.eyebrow}
          </div>
          <h2 className="text-[clamp(30px,3.4vw,46px)] font-extrabold leading-[1.06] tracking-[-.022em]">
            {data.title}
          </h2>
        </Reveal>

        <div className="grid grid-cols-1 gap-[18px] sm:grid-cols-2 lg:grid-cols-4">
          {data.items.map((item, i) => (
            <Reveal key={item.k} index={i}>
              <div className="h-full rounded-2xl border border-white/[0.08] bg-white/[0.036] px-[22px] py-[26px]">
                <div className="mb-2.5 text-[11.5px] font-bold uppercase tracking-[.12em] text-white/70">
                  {item.k}
                </div>
                <div className="text-base font-bold leading-snug text-white">
                  {item.v}
                </div>
              </div>
            </Reveal>
          ))}
        </div>

        <p className="mt-[26px] max-w-[640px] text-[15.5px] leading-relaxed text-white/40">
          {data.note}
        </p>
      </div>
    </section>
  );
}
