import { Chip } from '@heroui/chip';

export function TrustChipsRow() {
  return (
    <section className="mx-auto -mt-4 max-w-4xl px-6 pb-4 md:-mt-2">
      <div className="grid gap-3 md:grid-cols-3">
        <div className="rounded-2xl border border-default-200 bg-content1/60 p-4">
          <div className="flex items-center gap-2">
            <Chip size="sm" variant="flat">
              Performance‑first
            </Chip>
          </div>
          <p className="mt-2 text-sm text-foreground/70">
            Next.js builds tuned for fast load times and conversions.
          </p>
        </div>
        <div className="rounded-2xl border border-default-200 bg-content1/60 p-4">
          <div className="flex items-center gap-2">
            <Chip size="sm" variant="flat">
              SEO & Analytics‑ready
            </Chip>
          </div>
          <p className="mt-2 text-sm text-foreground/70">
            Technical SEO, clean markup, GA4 events, and tracking baked in.
          </p>
        </div>
        <div className="rounded-2xl border border-default-200 bg-content1/60 p-4">
          <div className="flex items-center gap-2">
            <Chip size="sm" variant="flat">
              Canada‑based 🇨🇦
            </Chip>
          </div>
          <p className="mt-2 text-sm text-foreground/70">
            Friendly, transparent process with typical 1–2 day responses.
          </p>
        </div>
      </div>
    </section>
  );
}
