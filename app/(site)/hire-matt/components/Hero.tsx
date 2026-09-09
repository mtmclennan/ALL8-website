import type { HireMattPageData } from "@/data/pages/hire-matt";

import Image from "next/image";
import { Download, Github, Linkedin, Mail } from "lucide-react";

import refinement from "../../_components/VisualRefinement.module.css";
import Reveal from "../../_components/home/Reveal";
import Button from "../../_components/ui/Button";

export default function Hero({ data }: { data: HireMattPageData["hero"] }) {
  return (
    <header
      className={`${refinement.hireHero} relative flex items-center overflow-hidden`}
    >
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
        className="absolute right-[-5%] top-[-10%] h-[110%] w-[65%]"
        style={{
          background:
            "radial-gradient(58% 62% at 72% 32%, rgba(0,64,150,.5) 0%, rgba(11,15,26,0) 68%)",
        }}
      />

      <div className="relative z-[2] mx-auto w-full max-w-[1160px] px-6 sm:px-10">
        <div className="grid grid-cols-1 items-center gap-10 lg:grid-cols-[1.32fr_.68fr] lg:gap-16">
          <Reveal>
            <div className="mb-[26px] inline-flex items-start gap-2.5 rounded-full border border-[rgba(34,197,94,.24)] bg-[rgba(34,197,94,.09)] py-2 pl-3 pr-4 text-[12.5px] font-semibold leading-[1.45] tracking-[.03em] text-[#86e0a8]">
              <span className="mt-[5px] h-[7px] w-[7px] flex-shrink-0 rounded-full bg-stage-win shadow-[0_0_8px_#22c55e]" />
              {data.pill}
            </div>

            <h1 className="mb-6 text-[clamp(38px,4.9vw,68px)] font-black leading-[.98] tracking-[-.035em]">
              {data.titlePrefix}
              <br />
              <span className="text-accent-blue">{data.titleEm}</span>
            </h1>

            <p className="mb-[26px] max-w-[620px] text-[18.5px] leading-relaxed text-white/70">
              {data.subtitle}
            </p>

            <p className="mb-8 max-w-[600px] rounded-r-[14px] border border-white/[0.08] border-l-2 border-l-accent-blue bg-white/[0.036] px-6 py-5 text-[17px] leading-relaxed text-[#dce8f5]">
              {data.diff}
            </p>

            <div className="mb-6 flex flex-wrap items-center gap-3.5">
              <Button
                data-cta="hire-hero-projects"
                data-cta-event="hire_project_click"
                href={data.primaryHref}
                size="lg"
              >
                {data.primaryLabel}
              </Button>
              <Button
                data-cta="hire-hero-resume"
                data-cta-event="hire_resume_click"
                download={data.secondaryDownload}
                href={data.secondaryHref}
                size="lg"
                variant="ghost"
              >
                <Download size={16} strokeWidth={2.3} />
                {data.secondaryLabel}
              </Button>
            </div>

            <div className="flex flex-wrap items-center gap-x-[22px] gap-y-2">
              <a
                className="inline-flex min-h-11 items-center gap-[7px] text-sm font-semibold text-white/70 hover:text-white"
                data-cta="hire-hero-linkedin"
                data-cta-event="hire_linkedin_click"
                href={data.linkedinHref}
                rel="noopener noreferrer"
                target="_blank"
              >
                <Linkedin className="text-white/40" size={15} />
                LinkedIn
              </a>
              <a
                className="inline-flex min-h-11 items-center gap-[7px] text-sm font-semibold text-white/70 hover:text-white"
                data-cta="hire-hero-github"
                data-cta-event="hire_github_click"
                href={data.githubHref}
                rel="noopener noreferrer"
                target="_blank"
              >
                <Github className="text-white/40" size={15} />
                GitHub
              </a>
              <a
                className="inline-flex min-h-11 items-center gap-[7px] text-sm font-semibold text-white/70 hover:text-white"
                data-cta="hire-hero-email"
                data-cta-event="hire_contact_click"
                href={`mailto:${data.email}?subject=Opportunity%20for%20Matt`}
              >
                <Mail className="text-white/40" size={15} />
                {data.email}
              </a>
            </div>
          </Reveal>

          <Reveal className={refinement.portrait} index={1}>
            <div className="relative overflow-hidden rounded-[20px] border border-white/[0.14] bg-content3">
              <Image
                priority
                alt={data.image.alt}
                className="relative block h-auto w-full"
                fetchPriority="high"
                height={data.image.height}
                sizes="(min-width:1024px) 380px, 60vw"
                src={data.image.src}
                width={data.image.width}
              />
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-background/62 via-transparent to-transparent" />
              <div className="absolute bottom-[18px] left-5 right-5 z-[2]">
                <b className="block text-[17px] font-extrabold tracking-[-.015em]">
                  {data.image.alt}
                </b>
                <span className="mt-[5px] block text-xs font-medium uppercase tracking-[.1em] text-[#b9cbdd]">
                  {data.imageCaption}
                </span>
              </div>
            </div>
            <p className="mt-3.5 flex items-center gap-[7px] text-[12.5px] leading-relaxed text-white/40">
              <span className="h-[5px] w-[5px] flex-shrink-0 rounded-full bg-white/40" />
              {data.geo}
            </p>
          </Reveal>
        </div>
      </div>
    </header>
  );
}
