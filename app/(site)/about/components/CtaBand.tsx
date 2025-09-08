import React from 'react';

export function CtaBand() {
  return (
    <section>
      <div className="mx-auto max-w-7xl px-6 py-16 md:py-20">
        <div className="rounded-2xl border border-[#BFBFBF]/20 bg-gradient-to-br from-[#0B0F1A] to-[#1C1C1C] p-8 md:p-12">
          <h2 className="text-3xl font-semibold md:text-4xl">
            Ready to tune your site for results?
          </h2>
          <p className="mt-2 max-w-2xl text-slate-300">
            Book a quick discovery call. We’ll map your goals and give you a
            clear blueprint—no pressure, no jargon.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <a
              href="/contact#book"
              className="inline-flex items-center justify-center rounded-xl bg-[#0076FF] px-5 py-3 text-sm font-semibold text-white shadow-md transition hover:brightness-110 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0076FF]"
            >
              Book a discovery call
            </a>
            <a
              href="/services"
              className="inline-flex items-center justify-center rounded-xl border border-[#BFBFBF]/40 bg-transparent px-5 py-3 text-sm font-semibold text-white/90 transition hover:bg-white/5 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
            >
              Explore services
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
