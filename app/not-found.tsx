"use client";

import Link from "next/link";

import Button from "./(site)/_components/ui/Button";
import { useLeadModal } from "./(site)/_components/LeadModalProvider";

export default function NotFound() {
  const { openModal } = useLeadModal();

  return (
    <section className="relative overflow-hidden py-28 max-[960px]:py-20">
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

      <div className="relative z-[2] mx-auto max-w-[720px] px-6 text-center sm:px-10">
        <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-[rgba(0,118,255,.22)] bg-[rgba(0,118,255,.1)] py-1.5 pl-2.5 pr-3.5 text-[12.5px] font-semibold tracking-[.05em] text-accent-blue">
          <span className="h-[7px] w-[7px] flex-shrink-0 rounded-full bg-red-500 shadow-[0_0_8px_#ef4444]" />
          404
        </div>

        <h1 className="mb-[22px] text-[clamp(36px,5vw,58px)] font-black leading-[1.05] tracking-[-.03em]">
          That Page Got{" "}
          <span className="text-accent-blue">Lost in the Funnel.</span>
        </h1>

        <p className="mx-auto mb-10 max-w-[520px] text-lg leading-relaxed text-white/70">
          The page you&apos;re looking for doesn&apos;t exist or has moved.
          Let&apos;s get you back to something useful.
        </p>

        <div className="flex flex-wrap items-center justify-center gap-3.5">
          <Button href="/">Back to Home</Button>
          <Button variant="ghost" onClick={openModal}>
            Get My Free Lead System Review
          </Button>
        </div>

        <div className="mt-12 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-sm text-white/45">
          <Link className="hover:text-white" href="/services">
            Services
          </Link>
          <Link className="hover:text-white" href="/about">
            About
          </Link>
          <Link className="hover:text-white" href="/blog">
            Blog
          </Link>
          <Link className="hover:text-white" href="/contact">
            Contact
          </Link>
        </div>
      </div>
    </section>
  );
}
