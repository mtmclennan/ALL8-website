// app/components/ui/ShineIcon.tsx
'use client';

import { motion, useReducedMotion } from 'framer-motion';
import type { LucideIcon } from 'lucide-react';

export function ShineIcon({
  Icon,
  size = 32,
  tone = 'dark', // "dark" or "light"
  className = '',
}: {
  Icon: LucideIcon;
  size?: number;
  tone?: 'dark' | 'light';
  className?: string;
}) {
  const prefersReduced = useReducedMotion();

  const sweep =
    tone === 'dark'
      ? 'linear-gradient(100deg, rgba(255,255,255,0) 40%, rgba(255,255,255,.35) 50%, rgba(255,255,255,0) 60%)'
      : 'linear-gradient(100deg, rgba(0,71,187,0) 40%, rgba(0,71,187,.35) 50%, rgba(0,71,187,0) 60%)';

  return (
    <motion.div
      // flex-none / shrink-0 prevents the 27px squeeze
      className={`relative grid place-items-center overflow-hidden rounded-full flex-none ${className}`}
      style={{
        width: size,
        height: size,
        minWidth: size, // belt
        minHeight: size, // suspenders
      }}
      whileHover="hover"
    >
      <Icon
        aria-hidden
        className={tone === 'dark' ? 'text-[#0076FF]' : 'text-[#0047BB]'}
        style={{ width: size, height: size, display: 'block' }}
      />

      {!prefersReduced && (
        <motion.span
          aria-hidden
          className="pointer-events-none absolute top-0 left-0 h-full w-[180%]"
          initial={{ x: '-60%' }}
          variants={{ hover: { x: '60%' } }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
          style={{ background: sweep, mixBlendMode: 'screen' }}
        />
      )}
    </motion.div>
  );
}
