import type { Metadata } from "next";

import Link from "next/link";
import { AlertCircle } from "lucide-react";

import TableOfContents from "../blog/[slug]/TableOfContents";

import { siteUrl } from "@/config/site.config";
import { siteConfig } from "@/config/site";

const LAST_UPDATED = "August 10, 2026";
const LAST_UPDATED_ISO = "2026-08-10";

export const metadata: Metadata = {
  title: "Privacy Policy — What We Collect, and Why | ALL8 WEBWORKS",
  description:
    "What ALL8 WEBWORKS collects when you contact us, why, how long we keep it, and how to ask us to delete it.",
  alternates: { canonical: `${siteUrl()}/privacy` },
};

const TOC = [
  { id: "who", text: "Who we are" },
  { id: "collect", text: "What we collect" },
  { id: "why", text: "Why we collect it" },
  { id: "tools", text: "Third parties" },
  { id: "cookies", text: "Cookies" },
  { id: "keep", text: "How long we keep it" },
  { id: "rights", text: "Your rights" },
  { id: "security", text: "Security" },
  { id: "children", text: "Children" },
  { id: "changes", text: "Changes" },
];

const h2 =
  "mb-[18px] mt-[52px] scroll-mt-24 text-[clamp(25px,2.6vw,32px)] font-extrabold leading-[1.16] tracking-[-.024em]";
const h3 = "mb-3 mt-9 text-xl font-extrabold tracking-[-.018em]";
const p = "mb-6 text-lg leading-[1.82] text-white/70";
const ul = "mb-[26px] flex flex-col gap-[13px]";
const bulletLi = "flex gap-3.5 text-[17.5px] leading-[1.75] text-white/70";
const dot = "mt-[11px] h-1.5 w-1.5 flex-shrink-0 rounded-full bg-primary";
const link =
  "text-accent-blue underline decoration-accent-blue/40 underline-offset-2 hover:text-[#8ec5ff]";

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "WebPage",
  name: "Privacy Policy",
  url: `${siteUrl()}/privacy`,
  description:
    "What ALL8 WEBWORKS collects when you contact us, why, how long we keep it, and how to ask us to delete it.",
  dateModified: LAST_UPDATED_ISO,
  isPartOf: { "@type": "WebSite", name: "ALL8 WEBWORKS", url: `${siteUrl()}/` },
  publisher: {
    "@type": "ProfessionalService",
    name: "ALL8 WEBWORKS",
    email: siteConfig.email,
  },
};

export default function PrivacyPage() {
  return (
    <>
      <script
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        type="application/ld+json"
      />

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
        <div className="relative z-[2] mx-auto max-w-[1160px] px-6 pb-14 pt-11 sm:px-10">
          <div className="max-w-[760px]">
            <nav
              aria-label="Breadcrumb"
              className="mb-[22px] flex flex-wrap items-center gap-2 text-[13px] text-white/70"
            >
              <Link className="hover:text-white" href="/">
                Home
              </Link>
              <span className="text-white/40">/</span>
              <span className="font-semibold text-accent-blue">
                Privacy Policy
              </span>
            </nav>

            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-[rgba(0,118,255,.22)] bg-[rgba(0,118,255,.1)] py-1.5 pl-2.5 pr-3.5 text-[12.5px] font-semibold tracking-[.05em] text-accent-blue">
              <span className="h-[7px] w-[7px] flex-shrink-0 rounded-full bg-stage-win shadow-[0_0_8px_#22c55e]" />
              Privacy
            </div>

            <h1 className="mb-[22px] text-[clamp(40px,4.6vw,66px)] font-black leading-[1] tracking-[-.03em]">
              What We Collect, and{" "}
              <span className="text-accent-blue">Why.</span>
            </h1>

            <p className="max-w-[640px] text-lg leading-relaxed text-white/70">
              Short version: we collect what you type into our forms so we can
              reply to you, plus basic analytics so we know which pages are
              useful. We don&apos;t sell any of it.
            </p>
          </div>
        </div>
      </section>

      <article className="pb-24 max-[960px]:pb-16">
        <div className="mx-auto max-w-[1000px] px-6 sm:px-10">
          <div className="grid grid-cols-1 items-start gap-16 lg:grid-cols-[1fr_232px]">
            <div className="max-w-[680px]">
              <p className="mb-[34px] text-[21px] leading-[1.68] text-[#cbd9e8]">
                This policy covers{" "}
                <strong className="font-bold text-white">
                  all8webworks.com
                </strong>{" "}
                and the ways ALL8 WEBWORKS handles information about people who
                visit the site, contact us, or become clients.
              </p>
              <p className="mb-6 text-[15px] text-white/40">
                Last updated: {LAST_UPDATED}
              </p>

              <h2 className={h2} id="who">
                Who we are
              </h2>
              <p className={p}>
                ALL8 WEBWORKS is a sole-operator practice based in Ontario,
                Canada, working with service businesses across the United States
                and Canada. For questions about anything in this policy, email{" "}
                <a className={link} href={`mailto:${siteConfig.email}`}>
                  {siteConfig.email}
                </a>
                .
              </p>

              <h2 className={h2} id="collect">
                What we collect
              </h2>
              <p className={p}>Two categories, and they&apos;re separate.</p>
              <h3 className={h3}>Information you give us</h3>
              <p className={p}>
                When you submit the lead review form, the contact form, or the
                newsletter signup, we receive what you typed:
              </p>
              <ul className={ul}>
                <li className={bulletLi}>
                  <span className={dot} />
                  <span>Your name and business name</span>
                </li>
                <li className={bulletLi}>
                  <span className={dot} />
                  <span>Your email address</span>
                </li>
                <li className={bulletLi}>
                  <span className={dot} />
                  <span>
                    Your phone number, if you provide one — it&apos;s optional
                  </span>
                </li>
                <li className={bulletLi}>
                  <span className={dot} />
                  <span>Your website address</span>
                </li>
                <li className={bulletLi}>
                  <span className={dot} />
                  <span>
                    Whatever you tell us about your situation, including the
                    challenge you select
                  </span>
                </li>
              </ul>
              <p className={p}>
                If you text or call us, we also have your phone number and the
                content of that conversation. If you email us, we have your
                email and its contents.
              </p>
              <h3 className={h3}>Information collected automatically</h3>
              <p className={p}>
                Like most websites, ours records basic technical and usage data:
                pages viewed, approximate location derived from IP address,
                referring source, browser and device type. We use this to
                understand which pages are worth keeping.
              </p>
              <div className="my-[34px] rounded-2xl border border-white/[0.08] bg-white/[0.036] px-7 py-[26px]">
                <h4 className="mb-3 flex items-center gap-2.5 text-xs font-bold uppercase tracking-[.1em] text-accent-blue">
                  <AlertCircle size={15} strokeWidth={2.4} />
                  On call tracking
                </h4>
                <p className="text-base leading-relaxed text-white/70">
                  We install call tracking for clients as part of the work we
                  do. On our own site, if a tracked number is in use, incoming
                  calls may be logged with the caller&apos;s number, the time,
                  and which page or campaign the call came from. Calls are not
                  recorded without telling you first.
                </p>
              </div>

              <h2 className={h2} id="why">
                Why we collect it
              </h2>
              <ol className={ul}>
                {[
                  <>
                    <strong className="font-bold text-white">
                      To reply to you.
                    </strong>{" "}
                    If you ask for a lead system review, we need a way to send
                    you the findings.
                  </>,
                  <>
                    <strong className="font-bold text-white">
                      To prepare that review.
                    </strong>{" "}
                    We look at your website, your search visibility and your
                    public business listings before we talk. That research is
                    based on the URL you give us.
                  </>,
                  <>
                    <strong className="font-bold text-white">
                      To deliver work
                    </strong>
                    , if you become a client.
                  </>,
                  <>
                    <strong className="font-bold text-white">
                      To send the monthly note
                    </strong>
                    , if you subscribed to it. Only if you subscribed.
                  </>,
                  <>
                    <strong className="font-bold text-white">
                      To understand what&apos;s working on our own site
                    </strong>
                    , using aggregate analytics.
                  </>,
                ].map((content, i) => (
                  <li key={i} className={bulletLi}>
                    <span className="mt-1 grid h-6 w-6 flex-shrink-0 place-items-center rounded-full border border-[rgba(0,118,255,.3)] bg-[rgba(0,118,255,.14)] text-xs font-extrabold text-accent-blue">
                      {i + 1}
                    </span>
                    <span>{content}</span>
                  </li>
                ))}
              </ol>
              <p className={p}>
                We do not use your information to build advertising profiles,
                and we don&apos;t sell, rent or trade it. Ever.
              </p>

              <h2 className={h2} id="tools">
                Third parties we use
              </h2>
              <p className={p}>
                We&apos;re a small operation running on other people&apos;s
                infrastructure. The categories of service that may process your
                information:
              </p>
              <ul className={ul}>
                {[
                  [
                    "Website hosting and forms",
                    "receives and stores form submissions",
                  ],
                  ["Email", "receives and stores our correspondence with you"],
                  ["Analytics", "aggregate site usage"],
                  [
                    "Scheduling",
                    "if you book a call, that provider handles the booking",
                  ],
                  [
                    "Call tracking and business phone",
                    "call metadata, where a tracked number is in use",
                  ],
                  [
                    "CRM",
                    "where we keep track of conversations and client work",
                  ],
                ].map(([label, desc]) => (
                  <li key={label} className={bulletLi}>
                    <span className={dot} />
                    <span>
                      <strong className="font-bold text-white">{label}</strong>{" "}
                      — {desc}
                    </span>
                  </li>
                ))}
              </ul>
              <p className={p}>
                Each of these has its own privacy policy. Some are based in the
                United States, which means your information may be stored or
                processed outside your country of residence.
              </p>

              <h2 className={h2} id="cookies">
                Cookies
              </h2>
              <p className={p}>
                The site uses cookies for two things: keeping it working
                correctly, and analytics. We don&apos;t run advertising or
                retargeting pixels. You can block or delete cookies in your
                browser settings; the site will still work.
              </p>

              <h2 className={h2} id="keep">
                How long we keep things
              </h2>
              <ul className={ul}>
                {[
                  [
                    "Enquiries that don’t become projects",
                    "up to two years, then deleted",
                  ],
                  [
                    "Client records",
                    "for the length of the engagement, plus as long as we’re required to keep business and tax records",
                  ],
                  ["Newsletter subscribers", "until you unsubscribe"],
                  [
                    "Analytics",
                    "in aggregate, per our analytics provider’s retention period",
                  ],
                ].map(([label, desc]) => (
                  <li key={label} className={bulletLi}>
                    <span className={dot} />
                    <span>
                      <strong className="font-bold text-white">{label}</strong>{" "}
                      — {desc}
                    </span>
                  </li>
                ))}
              </ul>

              <h2 className={h2} id="rights">
                Your rights
              </h2>
              <p className={p}>
                Wherever you&apos;re based, you can ask us to:
              </p>
              <ul className={ul}>
                {[
                  "Tell you what information we hold about you",
                  "Correct it if it’s wrong",
                  "Delete it",
                  "Stop emailing you",
                ].map((item) => (
                  <li key={item} className={bulletLi}>
                    <span className={dot} />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
              <p className={p}>
                Email{" "}
                <a className={link} href={`mailto:${siteConfig.email}`}>
                  {siteConfig.email}
                </a>{" "}
                and we&apos;ll handle it within 30 days. There&apos;s no form
                and no fee. Depending on where you live — including under
                Canada&apos;s PIPEDA, the GDPR, and state privacy laws such as
                the CCPA — you may have additional rights; we&apos;ll honour
                those too.
              </p>
              <p className={p}>
                Every marketing email we send has a working unsubscribe link. If
                you&apos;d rather not receive texts from us, reply STOP or just
                say so.
              </p>

              <h2 className={h2} id="security">
                Security
              </h2>
              <p className={p}>
                Information is transmitted over HTTPS and stored in
                access-controlled accounts with multi-factor authentication. No
                system is perfectly secure, and we won&apos;t pretend otherwise
                — but the amount of personal information we hold is deliberately
                small, which is itself a control.
              </p>

              <h2 className={h2} id="children">
                Children
              </h2>
              <p className={p}>
                This is a business-to-business site. We don&apos;t knowingly
                collect information from anyone under 16.
              </p>

              <h2 className={h2} id="changes">
                Changes to this policy
              </h2>
              <p className={p}>
                If we change how we handle information, we&apos;ll update this
                page and the date at the top. Material changes affecting
                existing clients get an email, not just a quiet edit.
              </p>

              <div className="mt-14 rounded-[20px] border border-[rgba(0,118,255,.22)] bg-[rgba(0,118,255,.07)] p-[30px]">
                <h3 className="mb-2 text-xl font-extrabold tracking-[-.02em]">
                  Questions about any of this?
                </h3>
                <p className="mb-5 text-[15.5px] leading-relaxed text-white/70">
                  Email us and a person will answer — there&apos;s only one
                  person here.
                </p>
                <a
                  className="inline-flex items-center gap-2 rounded-full bg-gradient-to-b from-[#1e8bff] to-[#0060d6] px-7 py-3.5 text-[15px] font-bold text-white shadow-[0_8px_28px_-6px_rgba(0,118,255,.45)] transition-all hover:-translate-y-0.5"
                  href={`mailto:${siteConfig.email}`}
                >
                  {siteConfig.email}
                </a>
              </div>
            </div>

            <TableOfContents items={TOC} />
          </div>
        </div>
      </article>
    </>
  );
}
