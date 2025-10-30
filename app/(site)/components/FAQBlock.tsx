'use client';

import { Section } from '@/app/(site)/components/SectionWrapper';
import { Accordion, AccordionItem } from '@heroui/accordion';
import { m, LazyMotion, domAnimation } from 'framer-motion';
import { ChevronDown, HelpCircle } from 'lucide-react';
import type { FAQ } from '@/data/services';
import { ShineIcon } from '@/app/(site)/components/ShineIcon';

type FAQBlockProps = {
  title?: string;
  subtitle?: string;
  faqs: FAQ[];
  tone?: 'base' | 'alt' | 'dim';
};

export default function FAQBlock({
  title = 'Common Questions',
  subtitle = 'Everything you might want to know before we get started:',
  faqs,
  tone = 'base',
}: FAQBlockProps) {
  if (!faqs?.length) return null;

  return (
    <Section tone={tone} pattern="none">
      <div className="mx-auto max-w-3xl px-6">
        <div className="mb-10 text-center">
          <h2 className="text-3xl font-bold tracking-tight">{title}</h2>
          {subtitle && (
            <p className="mt-2 text-lg text-foreground/70">{subtitle}</p>
          )}
        </div>

        <LazyMotion features={domAnimation}>
          <m.div
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-10%' }}
            transition={{ duration: 0.4, ease: 'easeOut' }}
          >
            <Accordion
              variant="bordered"
              selectionMode="multiple"
              className="rounded-xl border border-silver/30 bg-background/60 shadow-sm"
              itemClasses={{
                title:
                  'font-medium text-foreground flex items-center gap-2 text-left',
                content: 'text-sm text-foreground/70',
              }}
            >
              {faqs.map((faq, i) => (
                <AccordionItem
                  key={i}
                  textValue={faq.q} // ✅ accessibility fix
                  title={
                    <span className="flex items-center gap-2">
                      <ShineIcon Icon={HelpCircle} size={20} tone="dark" />
                      {faq.q}
                    </span>
                  }
                  indicator={
                    <ChevronDown className="h-5 w-5 text-foreground/70 transition-transform group-data-[open=true]:rotate-180" />
                  }
                >
                  <m.div
                    initial={{ opacity: 0, y: 4 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 4 }}
                    transition={{ duration: 0.25, ease: 'easeOut' }}
                  >
                    <p className="mt-1 leading-snug">{faq.a}</p>
                  </m.div>
                </AccordionItem>
              ))}
            </Accordion>
          </m.div>
        </LazyMotion>
      </div>
    </Section>
  );
}
