import type { ContactPageData } from "@/data/pages/contact";

import { Mail, Phone, Clock, MessageCircle } from "lucide-react";

import { siteConfig } from "@/config/site";
import { toSmsHref, toTelHref } from "@/lib/utils/phone";
import Button from "@/app/(site)/_components/ui/Button";
import { slugify } from "@/lib/utils/slugify";

const QUIET_ICONS = { mail: Mail, phone: Phone, clock: Clock };

export default function ChannelsSection({
  data,
}: {
  data: ContactPageData["channels"];
}) {
  const smsHref = toSmsHref(siteConfig.phone, data.primary.smsBody);
  const telHref = toTelHref(siteConfig.phone);

  return (
    <section className="pb-24 max-[960px]:pb-16">
      <div className="mx-auto max-w-[1160px] px-6 sm:px-10">
        <div className="grid grid-cols-1 items-stretch gap-[22px] lg:grid-cols-[1.35fr_1fr]">
          <div className="relative flex flex-col overflow-hidden rounded-[20px] border border-[rgba(0,118,255,.34)] bg-gradient-to-br from-[rgba(0,118,255,.11)] to-[rgba(0,118,255,.03)] p-9 sm:p-[38px]">
            <div
              className="pointer-events-none absolute -right-1/4 -top-[40%] h-4/5 w-2/3"
              style={{
                background:
                  "radial-gradient(circle, rgba(0,118,255,.2) 0%, transparent 70%)",
              }}
            />
            <div className="relative mb-[22px] inline-flex w-fit items-center gap-2 rounded-full border border-[rgba(34,197,94,.3)] bg-[rgba(34,197,94,.14)] px-3.5 py-1.5 text-[11.5px] font-bold uppercase tracking-[.1em] text-[#5ee08a]">
              {data.primary.tag}
            </div>
            <div className="relative mb-5 grid h-[52px] w-[52px] place-items-center rounded-2xl border border-[rgba(0,118,255,.24)] bg-[rgba(0,118,255,.12)] text-accent-blue">
              <MessageCircle size={24} strokeWidth={2} />
            </div>
            <h2 className="relative mb-3 text-[clamp(24px,2.5vw,32px)] font-extrabold leading-[1.12] tracking-[-.025em]">
              {data.primary.title}
            </h2>
            <p className="relative mb-6 text-[15.5px] leading-relaxed text-white/70">
              {data.primary.body}
            </p>
            <a
              className="relative mb-0.5 inline-block w-fit py-2.5 text-[clamp(26px,2.8vw,34px)] font-black tracking-[-.02em] text-white hover:text-accent-blue"
              href={smsHref}
            >
              {siteConfig.phone}
            </a>
            <div className="relative mb-6 text-[13.5px] text-white/70">
              {data.primary.note}
            </div>
            <div className="relative mt-auto">
              <Button href={smsHref}>
                <MessageCircle size={16} strokeWidth={2.4} />
                {data.primary.ctaLabel}
              </Button>
            </div>
          </div>

          <div className="grid gap-[22px]">
            {data.secondary.map((card) => (
              <div
                key={card.title}
                className="flex flex-col rounded-[20px] border border-white/[0.08] bg-white/[0.036] p-[30px] transition-colors hover:bg-white/[0.058]"
              >
                <div className="mb-4 inline-flex w-fit items-center rounded-full border border-white/[0.08] bg-white/5 px-3.5 py-1.5 text-[11.5px] font-bold uppercase tracking-[.1em] text-white/70">
                  {card.tag}
                </div>
                <h3 className="mb-2.5 text-xl font-extrabold tracking-[-.02em]">
                  {card.title}
                </h3>
                <p className="mb-6 text-[15.5px] leading-relaxed text-white/70">
                  {card.body}
                </p>
                <Button
                  className="mt-auto self-start"
                  data-cta={slugify(card.title)}
                  data-cta-event={
                    card.title.toLowerCase().includes("book")
                      ? "book_call_click"
                      : undefined
                  }
                  href="#form"
                  variant="ghost"
                >
                  {card.ctaLabel}
                </Button>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-[22px] grid grid-cols-1 gap-4 sm:grid-cols-3">
          {data.quiet.map((card) => {
            const Icon = QUIET_ICONS[card.icon];
            const href =
              card.icon === "mail"
                ? `mailto:${siteConfig.email}`
                : card.icon === "phone"
                  ? telHref
                  : undefined;

            return (
              <div
                key={card.label}
                className="rounded-2xl border border-white/[0.08] bg-white/[0.036] p-[22px] transition-colors hover:bg-white/[0.058]"
              >
                <div className="mb-0.5 flex items-center gap-2 text-[11.5px] font-bold uppercase tracking-[.12em] text-white/70">
                  <Icon size={14} />
                  {card.label}
                </div>
                {href ? (
                  <a
                    className="inline-block break-words py-3 text-base font-bold leading-snug hover:text-accent-blue"
                    href={href}
                  >
                    {card.icon === "mail" ? siteConfig.email : siteConfig.phone}
                  </a>
                ) : (
                  <div className="py-3 text-base font-bold leading-snug">
                    {card.value}
                  </div>
                )}
                <p className="mt-0.5 text-[13px] leading-relaxed text-white/70">
                  {card.note}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
