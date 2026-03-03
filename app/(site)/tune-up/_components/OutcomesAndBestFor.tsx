import { Section } from '@/app/(site)/_components/SectionWrapper';
import { Check } from 'lucide-react';

function BulletList({ items }: { items: string[] }) {
  return (
    <ul className="mt-5 space-y-3">
      {items.map((item) => (
        <li key={item} className="flex items-start gap-3 text-foreground/80">
          <span className="mt-1 inline-flex h-5 w-5 items-center justify-center rounded-md border border-foreground/10 bg-foreground/[0.03]">
            <Check className="h-3.5 w-3.5 text-brand-blue" />
          </span>
          <span className="text-sm sm:text-base">{item}</span>
        </li>
      ))}
    </ul>
  );
}

export function OutcomesAndBestFor({
  outcomes,
  bestFor,
}: {
  outcomes: { title: string; items: string[] };
  bestFor: { title: string; items: string[] };
}) {
  return (
    <Section tone="base" pattern="none">
      <div className="mx-auto max-w-5xl">
        <div className="grid gap-12 lg:grid-cols-2">
          <div>
            <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl">
              {outcomes.title}
            </h2>
            <BulletList items={outcomes.items} />
          </div>

          <div>
            <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl">
              {bestFor.title}
            </h2>
            <BulletList items={bestFor.items} />
          </div>
        </div>
        <p className="mt-14 text-sm text-center text-foreground/60">
          Not sure if it fits? Submit anyway — we’ll tell you honestly.
        </p>
      </div>
    </Section>
  );
}
