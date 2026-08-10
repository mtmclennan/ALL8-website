type ProofStripData = {
  items: { value: string; label: string; em?: boolean }[];
  note: string;
};

export default function ProofStrip({ data }: { data: ProofStripData }) {
  return (
    <div className="border-y border-white/[0.08] bg-content3">
      <div className="mx-auto flex max-w-[1160px] flex-wrap items-stretch justify-center">
        {data.items.map((item) => (
          <div
            key={item.label}
            className="flex flex-1 basis-1/3 flex-col items-center justify-center border-r border-white/[0.08] px-8 py-6 text-center last:border-r-0 max-[960px]:basis-1/2 max-[960px]:border-b max-[580px]:basis-full max-[580px]:border-r-0"
          >
            <div className="text-[clamp(24px,2.4vw,32px)] font-black leading-none tracking-[-.025em]">
              {item.em ? (
                <span className="text-accent-blue">{item.value}</span>
              ) : (
                item.value
              )}
            </div>
            <div className="mt-[7px] text-[13px] font-semibold text-white/70">
              {item.label}
            </div>
          </div>
        ))}
      </div>
      <p className="px-6 pb-5 text-center text-[11.5px] font-semibold uppercase tracking-[.06em] text-white/40">
        {data.note}
      </p>
    </div>
  );
}
