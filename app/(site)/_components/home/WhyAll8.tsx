import { Target, Shield, LineChart } from "lucide-react";

import { Card } from "../SectionWrapper";

import Reveal from "./Reveal";

import { hexToRgba } from "@/lib/utils/stage";

type WhyData = {
  eyebrow: string;
  title: string;
  subtitle: string;
  cards: { title: string; description: string; icon: string; color: string }[];
};

const ICONS: Record<string, typeof Target> = {
  target: Target,
  shield: Shield,
  chart: LineChart,
};

export default function WhyAll8({ data }: { data: WhyData }) {
  return (
    <section className="py-20 max-[960px]:py-16" id="why">
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

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          {data.cards.map((card, i) => {
            const Icon = ICONS[card.icon] ?? Target;

            return (
              <Reveal key={card.title} index={i}>
                <Card className="h-full p-9" variant="lift">
                  <div
                    className="mb-[22px] grid h-[54px] w-[54px] place-items-center rounded-2xl"
                    style={{
                      backgroundColor: hexToRgba(card.color, 0.12),
                      border: `1px solid ${hexToRgba(card.color, 0.2)}`,
                    }}
                  >
                    <Icon
                      size={24}
                      strokeWidth={2}
                      style={{ color: card.color }}
                    />
                  </div>
                  <h3 className="mb-2.5 text-lg font-bold">{card.title}</h3>
                  <p className="text-[15px] leading-relaxed text-white/70">
                    {card.description}
                  </p>
                </Card>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
