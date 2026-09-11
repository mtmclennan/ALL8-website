import Link from "next/link";
import { ArrowRight, BookOpen, Calculator } from "lucide-react";

import Reveal from "@/app/(site)/_components/home/Reveal";

type Resource = { title: string; href: string; kind?: "article" | "tool" };

const RESOURCES: Partial<Record<string, Resource[]>> = {
  "lead-generation-websites": [
    {
      title: "What Makes a High-Converting Service Page for Trades Businesses?",
      href: "/blog/what-makes-a-high-converting-service-page-for-trades-businesses",
    },
    {
      title: "More Traffic Won't Fix the Wrong Website",
      href: "/blog/more-traffic-won-t-fix-the-wrong-website",
    },
  ],
  "local-seo-google-business-profile": [
    {
      title:
        "Local SEO for Contractors: The Blueprint for Ranking in Google Maps",
      href: "/blog/local-seo-for-contractors-in-2025-the-ultimate-blueprint-for-ranking-in-google-maps",
    },
    {
      title: "Why Your Business Isn't Showing Up on Google Maps",
      href: "/blog/why-your-business-isn-t-showing-up-on-google-maps-and-it-s-not-what-you-think",
    },
  ],
  "website-care-optimization": [
    {
      title: "Building a Website Is Easy. Running One Is Not.",
      href: "/blog/building-a-website-is-easy-running-one-is-not",
    },
  ],
  "missed-call-recovery": [
    {
      title: "Estimate the value of your missed calls",
      href: "/tools/missed-call-revenue-calculator",
      kind: "tool",
    },
    {
      title: "The Problem Wasn't Skill. It Was the System.",
      href: "/blog/the-problem-wasn-t-skill-it-was-the-system",
    },
  ],
  "lead-follow-up-automation": [
    {
      title: "The Problem Wasn't Skill. It Was the System.",
      href: "/blog/the-problem-wasn-t-skill-it-was-the-system",
    },
  ],
  "crm-sales-pipeline": [
    {
      title: "The Problem Wasn't Skill. It Was the System.",
      href: "/blog/the-problem-wasn-t-skill-it-was-the-system",
    },
  ],
  "call-tracking-lead-attribution": [
    {
      title: "The Problem Wasn't Skill. It Was the System.",
      href: "/blog/the-problem-wasn-t-skill-it-was-the-system",
    },
  ],
  "custom-lead-systems": [
    {
      title: "The Problem Wasn't Skill. It Was the System.",
      href: "/blog/the-problem-wasn-t-skill-it-was-the-system",
    },
  ],
};

export default function ServiceResources({
  serviceSlug,
}: {
  serviceSlug: string;
}) {
  const resources = RESOURCES[serviceSlug];

  if (!resources?.length) return null;

  return (
    <section
      aria-labelledby="service-resources-title"
      className="py-20 max-[960px]:py-16"
    >
      <div className="mx-auto max-w-[900px] px-6 sm:px-10">
        <Reveal>
          <div className="mb-2.5 text-xs font-bold uppercase tracking-[.14em] text-accent-blue">
            Practical Resources
          </div>
          <h2
            className="text-[clamp(26px,2.8vw,36px)] font-extrabold"
            id="service-resources-title"
          >
            Learn What to Look For
          </h2>
        </Reveal>
        <div className="mt-7 grid gap-4 sm:grid-cols-2">
          {resources.map((resource, index) => (
            <Reveal key={resource.href} index={index}>
              <Link
                className="group flex h-full items-start gap-4 rounded-2xl border border-white/[0.09] bg-white/[0.035] p-5 hover:border-white/[0.18] hover:bg-white/[0.055]"
                href={resource.href}
              >
                {resource.kind === "tool" ? (
                  <Calculator
                    aria-hidden="true"
                    className="mt-0.5 flex-shrink-0 text-accent-blue"
                    size={20}
                  />
                ) : (
                  <BookOpen
                    aria-hidden="true"
                    className="mt-0.5 flex-shrink-0 text-accent-blue"
                    size={20}
                  />
                )}
                <span className="flex-1 font-bold leading-snug text-white/80 group-hover:text-white">
                  {resource.title}
                </span>
                <ArrowRight
                  className="mt-0.5 flex-shrink-0 text-white/40 group-hover:text-accent-blue"
                  size={17}
                />
              </Link>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
