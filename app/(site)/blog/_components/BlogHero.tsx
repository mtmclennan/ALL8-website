import styles from '@/app/(site)/components/HeroBlueprint.module.css';
import Highlight from '../../components/Highlight';

function BlogHero() {
  return (
    <section
      className={`${styles.bgBlueprint} relative isolate min-h-[550px] overflow-hidden text-white bg-primary/5`}
    >
      {/* same blueprint FX overlay as home hero */}
      <div
        aria-hidden
        className={`${styles.heroFx} pointer-events-none absolute inset-0 z-0`}
      />

      <div className="relative flex flex-col items-center z-10 mx-auto max-w-5xl px-6 py-28 text-center md:text-left">
        <h1 className="text-4xl font-bold md:text-6xl text-center tracking-tight">
          The
          <Highlight>High-Performance</Highlight>
          Website Blog for Contractors & Service Businesses
        </h1>

        <p className="mt-6 text-lg text-foreground/90 text-center md:text-xl max-w-2xl">
          Straightforward SEO, performance, and marketing advice to help trades
          and service companies turn visitors into booked jobs.
        </p>
      </div>
    </section>
  );
}

export default BlogHero;
