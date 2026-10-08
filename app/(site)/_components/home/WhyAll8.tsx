import Image from "next/image";
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

type FounderData = {
  name: string;
  role: string;
  paragraphs: string[];
  image: { src: string; alt: string; width: number; height: number };
};

const ICONS: Record<string, typeof Target> = {
  target: Target,
  shield: Shield,
  chart: LineChart,
};

export default function WhyAll8({
  data,
  founder,
}: {
  data: WhyData;
  founder: FounderData;
}) {
  return (
    <section className="py-20 max-[960px]:py-16" id="why">
      <div className="mx-auto max-w-[1160px] px-6 sm:px-10">
        <Reveal className="mb-[52px] max-w-[720px]">
          <div className="mb-2.5 text-xs font-bold uppercase tracking-[.14em] text-accent-blue">
            {data.eyebrow}
          </div>
          <h2 className="all8-h2 font-extrabold leading-[1.06] tracking-[-.022em]">
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

        <div className="mt-8 flex flex-col gap-6 rounded-2xl border border-white/[0.09] bg-white/[0.036] p-7 sm:flex-row sm:items-center">
          <Image
            alt={founder.image.alt}
            className="h-24 w-24 flex-shrink-0 rounded-2xl object-cover"
            height={96}
            src={founder.image.src}
            width={96}
          />
          <div>
            <h3 className="all8-h3 font-bold">Work directly with Matt</h3>
            <p className="mt-2 text-sm leading-relaxed text-white/70">
              {founder.paragraphs[0]}
            </p>
            <p className="mt-2 text-sm leading-relaxed text-white/60">
              {founder.name} · {founder.role}. {founder.paragraphs[2]}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
