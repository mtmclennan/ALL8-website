'use client';
import { Button } from '@heroui/button';

export default function ContactPageHero() {
  return (
    <section className="relative mx-auto max-w-4xl px-6 py-20 text-center">
      <h1 className="text-4xl font-bold tracking-tight md:text-5xl">
        Start a High‑Performance Website Project
      </h1>
      <p className="mx-auto mt-4 max-w-2xl text-base text-foreground/70 md:text-lg">
        We take on a limited number of builds. Fill out this brief intake so we
        can confirm fit within 1–2 business days.
      </p>
      <p className="mt-2 text-sm text-foreground/60">
        Projects typically start at{' '}
        <span className="font-semibold">$3,000 CAD</span>.
      </p>
      <div className="mt-8 flex justify-center">
        <Button
          as="a"
          href="#intake-form"
          color="primary"
          size="lg"
          radius="full"
        >
          Request a Proposal
        </Button>
      </div>
    </section>
  );
}
