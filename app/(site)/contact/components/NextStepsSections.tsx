export function NextStepsSection() {
  const steps = [
    {
      num: 1,
      title: 'We review your intake',
      body: 'Within 1–2 business days we scan your goals, timeline, and budget to confirm fit.',
    },
    {
      num: 2,
      title: 'Quick discovery call',
      body: 'If it’s a match, you’ll get a link to book a 15‑minute call to validate scope and constraints.',
    },
    {
      num: 3,
      title: 'Proposal & timeline',
      body: 'You’ll receive a clear proposal with pricing, milestones, and start date options.',
    },
  ];

  return (
    <section id="next-steps" className="mx-auto max-w-4xl px-6 py-12">
      <h2 className="text-2xl font-semibold tracking-tight md:text-3xl">
        What happens next?
      </h2>
      <p className="mt-2 text-sm text-foreground/70 md:text-base">
        No pushy sales—just a straightforward process to see if we’re the right
        team for your project.
      </p>

      <div className="mt-6 grid gap-4 md:grid-cols-3">
        {steps.map((s) => (
          <div
            key={s.num}
            className="rounded-2xl border border-default-200 bg-content1/60 p-5"
          >
            <div className="flex items-center gap-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground text-sm font-bold">
                {s.num}
              </div>
              <h3 className="text-base font-medium">{s.title}</h3>
            </div>
            <p className="mt-3 text-sm text-foreground/70">{s.body}</p>
          </div>
        ))}
      </div>

      <p className="mt-6 text-xs text-foreground/60">
        Tip: If your budget is a fit, we’ll show a calendar link right after you
        submit the form so you can book immediately.
      </p>
    </section>
  );
}
