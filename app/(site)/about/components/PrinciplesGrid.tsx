import * as React from 'react';
import Card from './AboutCard';

export function PrinciplesGrid() {
  return (
    <section>
      <div className="mx-auto max-w-7xl px-6 py-16 md:py-20">
        <h2 className="text-3xl font-semibold md:text-4xl">Principles</h2>
        <ul className="mt-8 grid gap-6 md:grid-cols-2">
          <Card title="Clarity & simplicity">One goal per view. No fluff.</Card>
          <Card title="Accessibility">WCAG 2.1 AA, keyboard-first.</Card>
          <Card title="Performance">LCP &lt; 2.5s, CLS &lt; 0.1.</Card>

          <Card title="Trust">Transparent, measurable, reliable.</Card>
        </ul>
      </div>
    </section>
  );
}
