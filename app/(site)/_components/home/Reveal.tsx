"use client";

import type { ReactNode } from "react";

import { motion, useReducedMotion } from "framer-motion";

export default function Reveal({
  children,
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
      initial={false}
      transition={{
        duration: prefersReduced ? 0 : 0.2,
        ease: [0.16, 1, 0.3, 1],
        delay: 0,
      }}
      viewport={{ once: true, amount: 0.2 }}
      whileInView={{ opacity: 1, y: 0 }}
    >
      {children}
    </motion.div>
  );
}
