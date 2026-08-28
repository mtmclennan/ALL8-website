"use client";

import type { ReactNode } from "react";

import { motion, useReducedMotion } from "framer-motion";

export default function Reveal({
  children,
  index = 0,
  className,
  id,
}: {
  children: ReactNode;
  index?: number;
  className?: string;
  id?: string;
}) {
  const prefersReduced = useReducedMotion();

  return (
    <motion.div
      className={className}
      id={id}
      initial={prefersReduced ? false : { opacity: 0, y: 24 }}
      transition={{
        duration: 0.55,
        ease: [0.16, 1, 0.3, 1],
        delay: (index % 4) * 0.09,
      }}
      viewport={{ once: true, amount: 0.2 }}
      whileInView={{ opacity: 1, y: 0 }}
    >
      {children}
    </motion.div>
  );
}
