import { Section } from '@/app/(site)/components/SectionWrapper';
import {
  BadgeCheck,
  MapPin,
  Rocket,
  Search,
  ClipboardList,
  Target,
  TrendingUp,
} from 'lucide-react';
import clsx from 'clsx';

type Badge = { label: string; icon?: string };

type ServiceOverviewProps = {
  overview: {
    title: string;
    description: string;
    oneLiner?: string;
    badges?: Badge[];
  };
};

export default function ServiceOverview({ overview }: ServiceOverviewProps) {
  const { title, description, oneLiner, badges = [] } = overview;

  const iconMap: Record<string, React.ElementType> = {
    MapPin,
    Rocket,
    BadgeCheck,
    Search,
    ClipboardList,
    Target,
    TrendingUp,
  };

  return (
    <Section tone="highlight" pattern="none">
      <div className="mx-auto max-w-3xl text-center">
        {/* Section Title */}
        <h2 className="text-3xl md:text-6xl font-bold tracking-tight">
          {title}
        </h2>

        {/* Description */}
        <p className="mt-4 text-lg text-foreground/70">{description}</p>

        {/* One-liner kicker */}
        {oneLiner && (
          <p className="mt-4 text-base font-medium text-primary">{oneLiner}</p>
        )}

        {/* Badge Row */}
        {badges.length > 0 && (
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            {badges.map((b, i) => {
              const Icon = b.icon
                ? (iconMap[b.icon] ?? BadgeCheck)
                : BadgeCheck;
              return (
                <span
                  key={i}
                  className={clsx(
                    'inline-flex items-center gap-2 rounded-full border px-3 py-1 text-sm',
                    'border-silver/40 bg-background/70 text-foreground/80'
                  )}
                >
                  <Icon className="h-4 w-4 text-primary" />
                  {b.label}
                </span>
              );
            })}
          </div>
        )}
      </div>
    </Section>
  );
}
