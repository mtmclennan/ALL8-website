import Image from "next/image";

import Reveal from "./Reveal";

type FounderData = {
  eyebrow: string;
  title: string;
  paragraphs: string[];
  name: string;
  role: string;
  image: { src: string; alt: string; width: number; height: number };
};

export default function FounderSection({ data }: { data: FounderData }) {
  return (
    <section className="py-20 max-[960px]:py-16" id="founder">
      <div className="mx-auto max-w-[1160px] px-6 sm:px-10">
        <div className="grid grid-cols-1 items-center gap-8 lg:grid-cols-[.75fr_1.25fr] lg:gap-14">
          <Reveal>
            <div className="relative max-w-[300px] overflow-hidden rounded-[20px] border border-white/[0.14] bg-content3 lg:max-w-none">
              <Image
                alt={data.image.alt}
                className="block h-auto w-full"
                height={data.image.height}
                loading="lazy"
                src={data.image.src}
                width={data.image.width}
              />
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-background/50 via-transparent to-transparent" />
            </div>
          </Reveal>

          <Reveal index={1}>
            <div className="mb-2.5 text-xs font-bold uppercase tracking-[.14em] text-accent-blue">
              {data.eyebrow}
            </div>
            <h2 className="mb-5 text-[clamp(28px,3vw,40px)] font-extrabold leading-[1.08] tracking-[-.025em]">
              {data.title}
            </h2>
            {data.paragraphs.map((p) => (
              <p
                key={p}
                className="mb-4 text-[16.5px] leading-relaxed text-white/70"
              >
                {p}
              </p>
            ))}
            <div className="mt-[26px] border-t border-white/[0.08] pt-[22px]">
              <div className="text-[16px] font-extrabold tracking-[-.01em]">
                {data.name}
              </div>
              <div className="mt-[3px] text-[13.5px] text-white/40">
                {data.role}
              </div>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
