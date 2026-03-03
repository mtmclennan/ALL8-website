import { Check } from 'lucide-react';
import { Section, SectionHeader } from './SectionWrapper';

export default function SimpleBulletsSection({
  title,
  items,
  subtitle,
  tone = 'base',
  pattern = 'none',
  variant = 'check',
  columns = 2,
}: {
  title: string;
  items: string[];
  subtitle?: string;
  tone?:
    | 'base'
    | 'alt'
    | 'dim'
    | 'highlight'
    | 'alert'
    | 'callout'
    | 'gradient';
  pattern?: 'none' | 'grid' | 'dots' | 'blueprint';
  variant?: 'check' | 'dot' | 'number';
  columns?: 1 | 2;
}) {
  const gridCols = columns === 2 ? 'sm:grid-cols-2' : 'sm:grid-cols-1';

  return (
    <Section tone={tone} pattern={pattern}>
      <SectionHeader title={title} subtitle={subtitle} />

      <ul className={`mx-auto max-w-5xl grid gap-3 ${gridCols}`}>
        {items.map((item, idx) => (
          <li key={item} className="flex items-start gap-3 text-foreground/80">
            {/* marker */}
            {variant === 'check' && (
              <span className="mt-1 inline-flex h-5 w-5 items-center justify-center rounded-md border border-foreground/10 bg-foreground/[0.03]">
                <Check className="h-3.5 w-3.5 text-brand-blue" />
              </span>
            )}

            {variant === 'dot' && (
              <span className="mt-2 h-2 w-2 rounded-full bg-brand-blue/80" />
            )}

            {variant === 'number' && (
              <span className="mt-0.5 inline-flex h-6 w-6 items-center justify-center rounded-lg border border-foreground/10 bg-foreground/[0.03] text-xs font-semibold text-foreground/80">
                {idx + 1}
              </span>
            )}

            <span className="text-sm sm:text-base">{item}</span>
          </li>
        ))}
      </ul>
    </Section>
  );
}
