import type { HireMattPageData } from "@/data/pages/hire-matt";

import { Download, Github, Linkedin, Mail } from "lucide-react";

import refinement from "../../_components/VisualRefinement.module.css";
import Reveal from "../../_components/home/Reveal";
import Button from "../../_components/ui/Button";

export default function HireCta({
  data,
}: {
  data: HireMattPageData["finalCta"];
}) {
  return (
    <section
      className={`${refinement.contact} relative overflow-hidden text-center`}
      id="contact"
    >
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(55% 65% at 50% 50%, rgba(0,70,165,.45) 0%, transparent 70%)",
        }}
      />
      <div className="relative z-[1] mx-auto max-w-[1160px] px-6 sm:px-10">
        <Reveal className="mb-4 text-xs font-bold uppercase tracking-[.14em] text-accent-blue">
          {data.eyebrow}
        </Reveal>
        <Reveal index={1}>
          <h2 className="mb-5 text-[clamp(34px,4.2vw,58px)] font-black leading-[1.02] tracking-[-.032em]">
            {data.title}
            <br />
            <span className="bg-gradient-to-br from-white from-40% to-accent-blue bg-clip-text text-transparent">
              {data.titleAccent}
            </span>
          </h2>
        </Reveal>
        <Reveal index={2}>
          <p className="mx-auto mb-[38px] max-w-[660px] text-[18.5px] leading-relaxed text-white/70">
            {data.subtitle}
          </p>
        </Reveal>
        <Reveal
          className={`${refinement.contactActions} flex flex-wrap items-center justify-center gap-3.5`}
          index={3}
        >
          <Button
            data-cta="hire-final-contact"
            data-cta-event="hire_contact_click"
            href={data.primary.href}
            size="lg"
          >
            <Mail size={17} strokeWidth={2.3} />
            {data.primary.label}
          </Button>
          <Button
            data-cta="hire-final-resume"
            data-cta-event="hire_resume_click"
            download={data.secondary.download}
            href={data.secondary.href}
            size="lg"
            variant="ghost"
          >
            <Download size={16} strokeWidth={2.3} />
            {data.secondary.label}
          </Button>
          <Button
            data-cta="hire-final-linkedin"
            data-cta-event="hire_linkedin_click"
            href={data.tertiary.href}
            rel="noopener noreferrer"
            size="lg"
            target="_blank"
            variant="ghost"
          >
            <Linkedin size={16} strokeWidth={2.3} />
            {data.tertiary.label}
          </Button>
          <Button
            data-cta="hire-final-github"
            data-cta-event="hire_github_click"
            href={data.github.href}
            rel="noopener noreferrer"
            size="lg"
            target="_blank"
            variant="ghost"
          >
            <Github size={16} strokeWidth={2.3} />
            {data.github.label}
          </Button>
        </Reveal>
        <Reveal index={0}>
          <p className="mt-[26px] text-[13px] leading-relaxed text-white/40">
            {data.micro}
            <br />
            <a
              className="text-accent-blue hover:text-[#8ec5ff]"
              data-cta="hire-evidence-package"
              data-cta-event="hire_contact_click"
              href={data.microLink.href}
            >
              {data.microLink.label}
            </a>
          </p>
        </Reveal>
      </div>
    </section>
  );
}
