// import React from 'react';
// import Image from 'next/image';

// import { brand } from '@/app/data/brand';

// export default function Logo() {
//   return (
//     <div>
//       <Image src={brand.logo} alt={brand.logoAlt} />
//       <div>
//         <p className='font'>ALL8</p>
//         <p>WEBWORKS</p>
//       </div>
//     </div>
//   );
// }
// components/Logo.tsx
import Image from 'next/image';
import clsx from 'clsx';
import { brand } from '@/data/brand';

type LogoProps = {
  variant?: 'horizontal' | 'stacked';
  size?: 'sm' | 'md' | 'lg'; // controls text scale
  className?: string;
};

const sizeMap = {
  sm: { all8: 'text-xl', web: 'text-[0.85em]' },
  md: { all8: 'text-3xl', web: 'text-[1.6em]' },
  lg: { all8: 'text-5xl', web: 'text-[1.8em]' },
};

export default function Logo({
  variant = 'horizontal',
  size = 'md',
  className,
}: LogoProps) {
  const s = sizeMap[size];

  if (variant === 'stacked') {
    return (
      <div
        className={clsx('inline-flex flex-col items-center gap-1', className)}
        aria-label="ALL8 Webworks"
      >
        <Image
          src={brand.logo}
          alt={brand.logoAlt}
          width={100}
          height={100}
          priority
        />
        <div className="text-center leading-none">
          <span className={clsx('font-display font-black  text-white', s.all8)}>
            ALL8
          </span>
          <div
            className={clsx(
              'font-body font-light text-brand-blue',
              s.web,
              'mt-0.5'
            )}
          >
            WEBWORKS
          </div>
        </div>
      </div>
    );
  }

  // horizontal (baseline-aligned)
  return (
    <div
      className={clsx('flex h-full items-center gap-2', className)}
      aria-label="ALL8 Webworks"
    >
      <Image
        src={brand.logo}
        alt={brand.logoAlt}
        width={40}
        height={40}
        className="translate-y-[2px]"
        priority
      />
      <div className="flex items-baseline gap-1 leading-none">
        <span
          className={clsx(
            'font-display font-black tracking-tight text-white',
            s.all8
          )}
        >
          ALL8
        </span>
        <span className={clsx('font-body font-light text-brand-blue', s.web)}>
          WEBWORKS
        </span>
      </div>
    </div>
  );
}
