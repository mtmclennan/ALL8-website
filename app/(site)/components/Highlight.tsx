'use client';

import { motion } from 'framer-motion';
import clsx from 'clsx';

export default function Highlight({
  children,
  animate = 'hover', // "none" | "hover" | "full"
  className = '',
}: {
  children: React.ReactNode;
  animate?: 'none' | 'hover' | 'full';
  className?: string;
}) {
  const base =
    'inline-block whitespace-nowrap px-3 leading-[1.15] text-chrome text-fill-transparent font-extrabold';

  if (animate === 'none') {
    return <span className={clsx(base, className)}>{children}</span>;
  }

  if (animate === 'hover') {
    return (
      <motion.span
        whileHover={{ scale: 1.25 }}
        transition={{ type: 'spring', stiffness: 260, damping: 20 }}
        className={clsx(base, className)}
      >
        {children}
      </motion.span>
    );
  }

  // full animation (load + hover)
  return (
    <motion.span
      initial={{ scale: 0.85, opacity: 0.6 }}
      animate={{ scale: 1.1, opacity: 1 }}
      whileHover={{ scale: 1.3 }}
      transition={{
        type: 'spring',
        duration: 0.7,
        stiffness: 300,
        delay: 0.2,
      }}
      className={clsx(base, className)}
    >
      {children}
    </motion.span>
  );
}
