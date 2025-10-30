'use client';

import { motion } from 'framer-motion';
import homeData from '@/data/home.json'; // adjust path as needed

interface OurStoryProps {
  heading: string;
  body: string[];
}

export default function OurStory({ heading, body }: OurStoryProps) {
  return (
    <section className="relative isolate bg-charcoal text-white py-20 md:py-28 2xl:py-36">
      {/* Blueprint accent lines */}
      <div className="relative z-10 mx-auto max-w-5xl px-6 ">
        <motion.h2
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          viewport={{ once: true }}
          className="text-3xl md:text-5xl text-center font-bold tracking-tight"
        >
          {heading}
        </motion.h2>

        {body.map((para, i) => (
          <motion.p
            key={i}
            initial={{ opacity: 0, y: 8 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, delay: 0.1 }}
            viewport={{ once: true }}
            className="mt-6 text-base  md:text-lg text-foreground/80 leading-relaxed"
          >
            {para}
          </motion.p>
        ))}
      </div>
    </section>
  );
}
