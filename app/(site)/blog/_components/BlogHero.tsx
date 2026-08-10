type BlogHeroProps = {
  title?: string;
  subtitle?: string;
};

const DEFAULT_SUBTITLE =
  "Practical notes for service business owners on getting found, getting contacted, following up, and knowing what actually produced the job. No growth hacks, no funnel talk.";

export default function BlogHero({ title, subtitle }: BlogHeroProps) {
  return (
    <section className="relative overflow-hidden pt-[68px]">
      <div className="absolute inset-0 bg-background" />
      <div
        className="absolute inset-0"
        style={{
          backgroundImage:
            "linear-gradient(rgba(0,118,255,.05) 1px, transparent 1px), linear-gradient(90deg, rgba(0,118,255,.05) 1px, transparent 1px)",
          backgroundSize: "44px 44px",
        }}
      />
      <div
        className="absolute right-0 top-0 h-full w-[60%]"
        style={{
          background:
            "radial-gradient(60% 70% at 80% 25%, rgba(0,64,150,.55) 0%, rgba(11,15,26,0) 65%)",
        }}
      />

      <div className="relative z-[2] mx-auto max-w-[1160px] px-6 py-[88px] pb-16 sm:px-10">
        <div className="max-w-[800px]">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-[rgba(0,118,255,.22)] bg-[rgba(0,118,255,.1)] py-1.5 pl-2.5 pr-3.5 text-[12.5px] font-semibold tracking-[.05em] text-accent-blue">
            <span className="h-[7px] w-[7px] flex-shrink-0 rounded-full bg-stage-win shadow-[0_0_8px_#22c55e]" />
            Field Notes
          </div>

          <h1 className="mb-[22px] text-[clamp(40px,4.6vw,66px)] font-black leading-[1] tracking-[-.03em]">
            {title ? (
              title
            ) : (
              <>
                Writing About Where{" "}
                <span className="text-accent-blue">the Work Goes Missing.</span>
              </>
            )}
          </h1>

          <p className="max-w-[640px] text-lg leading-relaxed text-white/70">
            {subtitle || DEFAULT_SUBTITLE}
          </p>
        </div>
      </div>
    </section>
  );
}
