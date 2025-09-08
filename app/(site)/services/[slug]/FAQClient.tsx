'use client';

import { Accordion, AccordionItem } from '@heroui/accordion';
import * as React from 'react';
import type { FAQ } from '../../../data/services';

export default function FAQClient({ items }: { items: FAQ[] }) {
  if (!items?.length) return null;

  return (
    <Accordion variant="shadow" selectionMode="multiple">
      {items.map((it, i) => (
        <AccordionItem key={i} aria-label={it.q} title={it.q}>
          <p className="text-base leading-relaxed">{it.a}</p>
        </AccordionItem>
      ))}
    </Accordion>
  );
}
