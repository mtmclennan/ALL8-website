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
    <section
      aria-labelledby="contact-channels-title"
      className="pb-24 max-[960px]:pb-16"
    >
      <div className="mx-auto max-w-[1160px] px-6 sm:px-10">
        <h2 className="sr-only" id="contact-channels-title">
          Other ways to reach ALL8
        </h2>
        <div className="grid grid-cols-1 items-stretch gap-[22px] md:grid-cols-2">
          <div className="flex flex-col rounded-[20px] border border-[rgba(0,118,255,.34)] bg-gradient-to-br from-[rgba(0,118,255,.11)] to-[rgba(0,118,255,.03)] p-7 sm:p-[30px]">
            <div className="mb-4 inline-flex w-fit items-center gap-2 rounded-full border border-[rgba(34,197,94,.3)] bg-[rgba(34,197,94,.14)] px-3.5 py-1.5 text-[11.5px] font-bold uppercase tracking-[.1em] text-[#5ee08a]">
              {data.primary.tag}
            </div>
            <h3 className="mb-2.5 flex items-center gap-2.5 text-xl font-extrabold tracking-[-.02em]">
              <MessageCircle
                aria-hidden="true"
                className="text-accent-blue"
                size={20}
                strokeWidth={2.2}
              />
              {data.primary.title}
            </h3>
            <p className="mb-4 text-[15.5px] leading-relaxed text-white/70">
              {data.primary.body}
            </p>
            <p className="mb-6 text-[13.5px] text-white/60">
              {data.primary.note}
            </p>
            <Button
              className="mt-auto self-start"
              data-cta="contact-text-us"
              href={smsHref}
              variant="ghost"
            >
              <MessageCircle size={16} strokeWidth={2.4} />
              {data.primary.ctaLabel} {siteConfig.phone}
            </Button>
          </div>

          {data.secondary.map((card) => (
            <div
              key={card.title}
              className="flex flex-col rounded-[20px] border border-white/[0.08] bg-white/[0.036] p-7 sm:p-[30px]"
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
                className="rounded-2xl border border-white/[0.08] bg-white/[0.036] p-[22px]"
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
