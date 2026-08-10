import Reveal from "@/app/(site)/_components/home/Reveal";

type PrinciplesData = {
  eyebrow: string;
  title: string;
  items: { n: string; title: string; body: string }[];
};

export default function Principles({ data }: { data: PrinciplesData }) {
  return (
    <section className="py-24 max-[960px]:py-16" id="principles">
      <div className="mx-auto max-w-[1160px] px-6 sm:px-10">
        <Reveal className="mb-[52px] max-w-[720px]">
          <div className="mb-2.5 text-xs font-bold uppercase tracking-[.14em] text-accent-blue">
            {data.eyebrow}
          </div>
          <h2 className="text-[clamp(30px,3.4vw,46px)] font-extrabold leading-[1.06] tracking-[-.022em]">
            {data.title}
          </h2>
        </Reveal>

        <div className="flex max-w-[900px] flex-col">
          {data.items.map((item, i) => (
            <Reveal key={item.n} index={i}>
              <div
                className={`grid grid-cols-[52px_1fr] items-start gap-6 py-7 ${
                  i !== data.items.length - 1
                    ? "border-b border-white/[0.08]"
                    : ""
                }`}
              >
                <div className="pt-1 text-[13px] font-black tracking-[.06em] text-accent-blue">
                  {item.n}
                </div>
                <div>
                  <h3 className="mb-2 text-xl font-extrabold tracking-[-.018em]">
                    {item.title}
                  </h3>
                  <p className="text-base leading-relaxed text-white/70">
                    {item.body}
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
