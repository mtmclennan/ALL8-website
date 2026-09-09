import { renderBold } from "@/lib/utils/renderBold";
import Reveal from "@/app/(site)/_components/home/Reveal";

type ShiftData = {
  eyebrow: string;
  title: string;
  cards: { tag: string; title: string; body: string }[];
  story: string[];
  pullQuote: string;
  storyAfter: string[];
};

export default function ShiftStory({ data }: { data: ShiftData }) {
  return (
    <section className="bg-content3 py-24 max-[960px]:py-16" id="story">
      <div className="mx-auto max-w-[1160px] px-6 sm:px-10">
        <Reveal className="mb-[52px] max-w-[720px]">
          <div className="mb-2.5 text-xs font-bold uppercase tracking-[.14em] text-accent-blue">
            {data.eyebrow}
          </div>
          <h2 className="text-[clamp(30px,3.4vw,46px)] font-extrabold leading-[1.06] tracking-[-.022em]">
            {data.title}
          </h2>
        </Reveal>

        <div className="mb-11 grid grid-cols-1 gap-[22px] sm:grid-cols-2">
          {data.cards.map((card, i) => (
            <Reveal key={card.tag} index={i}>
              <div
                className={
                  i === 0
                    ? "h-full rounded-[20px] border border-white/[0.08] bg-white/[0.036] p-[30px] opacity-[0.82]"
                    : "h-full rounded-[20px] border border-[rgba(0,118,255,.3)] bg-[rgba(0,118,255,.06)] p-[30px]"
                }
              >
                <div
                  className={
                    i === 0
                      ? "mb-4 text-[11.5px] font-bold uppercase tracking-[.13em] text-white/70"
                      : "mb-4 text-[11.5px] font-bold uppercase tracking-[.13em] text-accent-blue"
                  }
                >
                  {card.tag}
                </div>
                <h3 className="mb-3 text-xl font-extrabold leading-[1.25] tracking-[-.02em]">
                  {card.title}
                </h3>
                <p className="text-[15.5px] leading-relaxed text-white/70">
                  {card.body}
                </p>
              </div>
            </Reveal>
          ))}
        </div>

        <Reveal className="max-w-[720px]">
          {data.story.map((p, i) => (
            <p
              key={i}
              className="mb-5 text-[17.5px] leading-relaxed text-white/70"
            >
              {renderBold(p)}
            </p>
          ))}

          <div className="my-[34px] rounded-r-[14px] border-l-2 border-primary bg-[rgba(0,118,255,.05)] px-[30px] py-[26px]">
            <p className="text-[clamp(19px,2.1vw,24px)] font-extrabold leading-[1.4] tracking-[-.02em] text-white">
              {data.pullQuote}
            </p>
          </div>

          {data.storyAfter.map((p, i) => (
            <p
              key={i}
              className="mb-5 text-[17.5px] leading-relaxed text-white/70"
            >
              {p}
            </p>
          ))}
        </Reveal>
      </div>
    </section>
  );
}
