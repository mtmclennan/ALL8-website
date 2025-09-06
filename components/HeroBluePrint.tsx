// 'use client';

// import { motion } from 'framer-motion';
// import Image from 'next/image';
// import { Button } from '@heroui/button';
// import { Chip } from '@heroui/chip';
// import { Card, CardBody } from '@heroui/card';
// import { PhoneCall, FileText, MapPin, Gauge, Rocket } from 'lucide-react';

// export default function HeroBlueprint() {
//   return (
//     <section className="relative isolate overflow-hidden bg-[#0B0F1A] text-white min-h-[90vh]">
//       {/* Parallax + Diagonal Lines Animation */}
//       <div aria-hidden className="pointer-events-none absolute inset-0">
//         {/* Background Gradient (Blueprint Effect) */}

//         {/* Minor grid (24px) */}
//         <div
//           className="absolute inset-0 opacity-90 will-change-transform mix-blend-overlay z-[1]"
//           style={{
//             backgroundImage:
//               'repeating-linear-gradient(0deg, rgba(255,255,255,0.3) 0px, rgba(255,255,255,0.3) 1px, transparent 1px, transparent 30px), repeating-linear-gradient(90deg, rgba(255,255,255,0.3) 0px, rgba(255,255,255,0.3) 1px, transparent 1px, transparent 30px)',
//           }}
//         />
//         {/* Major grid (120px) */}
//         <div
//           className="absolute inset-0 opacity-50 will-change-transform mix-blend-overlay z-[2]"
//           style={{
//             backgroundImage:
//               'repeating-linear-gradient(0deg, rgba(0,118,255,0.55) 0px, rgba(0,118,255,0.55) 3px, transparent 3px, transparent 120px), repeating-linear-gradient(90deg, rgba(0,118,255,0.55) 0px, rgba(0,118,255,0.55) 3px, transparent 3px, transparent 120px)',
//           }}
//         />

//         {/* Animated Diagonal Sweep */}
//         <div
//           className="absolute inset-x-0 top-0 h-60 opacity-20 will-change-transform scan-v"
//           style={{
//             backgroundImage:
//               'linear-gradient(180deg, transparent, rgba(0,118,255,0.35), transparent)',
//           }}
//         />
//         {/* Shimmering diagonal movement */}
//         <div
//           className="absolute -inset-[10%] rotate-[-8deg] opacity-30 [mask-image:linear-gradient(90deg,transparent,black_20%,black_80%,transparent)] will-change-transform grid-pan"
//           style={{
//             backgroundImage:
//               'linear-gradient(90deg, rgba(0,118,255,0.0) 0%, rgba(0,118,255,0.35) 50%, rgba(0,118,255,0.0) 100%)',
//             backgroundSize: '50% 100%',
//           }}
//         />
//       </div>

//       {/* Content Container */}
//       <div className="relative mx-auto max-w-7xl px-6 py-20 md:py-28 z-[10]">
//         {/* Heading and Subheading */}
//         <div className="max-w-2xl">
//           <motion.h1
//             initial={{ opacity: 0, y: 8 }}
//             animate={{ opacity: 1, y: 0 }}
//             transition={{ duration: 0.35 }}
//             className="text-4xl md:text-5xl font-bold tracking-tight"
//           >
//             Websites That Run On All 8 Cylinders
//           </motion.h1>
//           <p className="mt-4 text-base md:text-lg text-slate-200">
//             High-performance sites engineered to turn local visitors into{' '}
//             <span className="font-semibold">
//               calls, quotes, and booked jobs
//             </span>{' '}
//             for contractors, trades, and service businesses across Canada.
//           </p>

//           {/* Trust Chips */}
//           <div className="mt-6 flex flex-wrap gap-3">
//             <Chip
//               color="primary"
//               variant="shadow"
//               startContent={<Gauge className="h-4 w-4" />}
//             >
//               Performance-first
//             </Chip>
//             <Chip variant="flat" startContent={<Rocket className="h-4 w-4" />}>
//               SEO & Ads Ready
//             </Chip>
//             <Chip variant="flat" startContent={<MapPin className="h-4 w-4" />}>
//               Canada-based
//             </Chip>
//           </div>

//           {/* Call-to-Actions */}
//           <div className="mt-8 flex flex-wrap gap-3">
//             <Button color="primary" size="lg" className="min-w-[180px]">
//               Get a Free Quote
//             </Button>
//             <Button
//               variant="bordered"
//               size="lg"
//               className="border-white text-white"
//             >
//               See Our Work
//             </Button>
//           </div>
//         </div>
//       </div>

//       {/* quick global keyframes so the classes animate */}

//     </section>
//   );
// }

/* Keyframe Definitions */

// 'use client';

// import { motion } from 'framer-motion';
// import Image from 'next/image';
// import { Button } from '@heroui/button';
// import { Chip } from '@heroui/chip';
// import { Gauge, Rocket, MapPin } from 'lucide-react';
// import heroImage from '../public/assets/website-seo-performance-laptop-analytics-leads-calls.png';

// export default function HeroBlueprint() {
//   return (
//     <section className="relative isolate overflow-hidden bg-[#0B0F1A] text-white min-h-[90vh]">
//       {/* Background Effects */}
//       <div aria-hidden className="pointer-events-none absolute inset-0">
//         {/* Minor Grid */}
//         <div
//           className="absolute inset-0 opacity-90 will-change-transform mix-blend-overlay z-[1]"
//           style={{
//             backgroundImage:
//               'repeating-linear-gradient(0deg, rgba(255,255,255,0.3) 0px, rgba(255,255,255,0.3) 1px, transparent 1px, transparent 30px), repeating-linear-gradient(90deg, rgba(255,255,255,0.3) 0px, rgba(255,255,255,0.3) 1px, transparent 1px, transparent 30px)',
//           }}
//         />
//         {/* Major Grid */}
//         <div
//           className="absolute inset-0 opacity-50 will-change-transform mix-blend-overlay z-[2]"
//           style={{
//             backgroundImage:
//               'repeating-linear-gradient(0deg, rgba(0,118,255,0.55) 0px, rgba(0,118,255,0.55) 3px, transparent 3px, transparent 120px), repeating-linear-gradient(90deg, rgba(0,118,255,0.55) 0px, rgba(0,118,255,0.55) 3px, transparent 3px, transparent 120px)',
//           }}
//         />
//       </div>

//       {/* Content Container */}
//       <div className="relative mx-auto max-w-7xl px-6 py-20 md:py-28 z-[10]">
//         <div className="grid grid-cols-1 md:grid-cols-2 items-center gap-12">
//           {/* Left Side - Text */}
//           <div className="max-w-2xl">
//             <motion.h1
//               initial={{ opacity: 0, y: 8 }}
//               animate={{ opacity: 1, y: 0 }}
//               transition={{ duration: 0.35 }}
//               className="text-4xl md:text-5xl font-bold tracking-tight"
//             >
//               Websites That Run On All 8 Cylinders
//             </motion.h1>
//             <p className="mt-4 text-base md:text-lg text-slate-200">
//               High-performance sites engineered to turn local visitors into{' '}
//               <span className="font-semibold">
//                 calls, quotes, and booked jobs
//               </span>{' '}
//               for contractors, trades, and service businesses across Canada.
//             </p>

//             {/* Trust Chips */}
//             <div className="mt-6 flex flex-wrap gap-3">
//               <Chip
//                 color="primary"
//                 variant="shadow"
//                 startContent={<Gauge className="h-4 w-4" />}
//               >
//                 Performance-first
//               </Chip>
//               <Chip
//                 variant="flat"
//                 startContent={<Rocket className="h-4 w-4" />}
//               >
//                 SEO & Ads Ready
//               </Chip>
//               <Chip
//                 variant="flat"
//                 startContent={<MapPin className="h-4 w-4" />}
//               >
//                 Canada-based
//               </Chip>
//             </div>

//             {/* Call-to-Actions */}
//             <div className="mt-8 flex flex-wrap gap-3">
//               <Button color="primary" size="lg" className="min-w-[180px]">
//                 Get a Free Quote
//               </Button>
//               <Button
//                 variant="bordered"
//                 size="lg"
//                 className="border-white text-white"
//               >
//                 See Our Work
//               </Button>
//             </div>
//           </div>

//           {/* Right Side - Hero Image */}
//           <div className="relative w-full h-[400px] md:h-[500px] lg:h-[500px]">
//             <Image
//               src={heroImage} // replace with your image path
//               alt="High-performance website dashboard"
//               fill
//               className="object-contain drop-shadow-2xl"
//               priority
//             />
//           </div>
//         </div>
//       </div>
//       <style jsx global>{`
//         @keyframes parallax-lines {
//           0% {
//             transform: translateX(-50%);
//           }
//           100% {
//             transform: translateX(50%);
//           }
//         }
//         @keyframes scan-v {
//           0% {
//             transform: translateY(-120%);
//           }
//           100% {
//             transform: translateY(200%);
//           }
//         }
//         @keyframes grid-pan {
//           0% {
//             transform: translateX(-30%);
//           }
//           100% {
//             transform: translateX(30%);
//           }
//         }
//         @keyframes glowing-lines {
//           0% {
//             background-position: 0 0;
//             opacity: 0.15;
//           }
//           50% {
//             background-position: 100% 0;
//             opacity: 0.6;
//           }
//           100% {
//             background-position: 0 0;
//             opacity: 0.15;
//           }
//         }
//         .animate-parallax-lines {
//           animation: parallax-lines 12s linear infinite;
//         }
//         .scan-v {
//           animation: scan-v 12s linear infinite;
//         }
//         .grid-pan {
//           animation: grid-pan 28s linear infinite;
//         }
//         .animate-glowing-lines {
//           animation: glowing-lines 10s linear infinite;
//         }
//       `}</style>
//     </section>
//   );
// }

'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import { Button } from '@heroui/button';
import { Chip } from '@heroui/chip';
import { Gauge, Rocket, MapPin } from 'lucide-react';
import heroImage from '../public/assets/website-seo-performance-laptop-analytics-leads-calls.png';

export default function HeroBlueprint() {
  return (
    <section className="relative isolate overflow-hidden bg-[#0B0F1A] text-white min-h-[90vh]">
      {/* Parallax + Diagonal Lines Animation */}
      <div aria-hidden className="pointer-events-none absolute inset-0">
        {/* Background Gradient (Blueprint Effect) */}
        {/* Minor grid (24px) */}
        <div
          className="absolute inset-0 opacity-90 will-change-transform mix-blend-overlay z-[1] animate-parallax-lines"
          style={{
            backgroundImage:
              'repeating-linear-gradient(0deg, rgba(255,255,255,0.3) 0px, rgba(255,255,255,0.3) 1px, transparent 1px, transparent 30px), repeating-linear-gradient(90deg, rgba(255,255,255,0.3) 0px, rgba(255,255,255,0.3) 1px, transparent 1px, transparent 30px)',
          }}
        />
        {/* Major grid (120px) */}
        <div
          className="absolute inset-0 opacity-50 will-change-transform mix-blend-overlay z-[2] animate-glowing-lines"
          style={{
            backgroundImage:
              'repeating-linear-gradient(0deg, rgba(0,118,255,0.55) 0px, rgba(0,118,255,0.55) 3px, transparent 3px, transparent 120px), repeating-linear-gradient(90deg, rgba(0,118,255,0.55) 0px, rgba(0,118,255,0.55) 3px, transparent 3px, transparent 120px)',
            backgroundSize: '200% 100%',
          }}
        />

        {/* Animated Diagonal Sweep */}
        <div
          className="absolute inset-x-0 top-0 h-60 opacity-20 will-change-transform scan-v z-[3]"
          style={{
            backgroundImage:
              'linear-gradient(180deg, transparent, rgba(0,118,255,0.35), transparent)',
          }}
        />

        {/* Shimmering diagonal movement */}
        <div
          className="absolute -inset-[10%] rotate-[-8deg] opacity-30 [mask-image:linear-gradient(90deg,transparent,black_20%,black_80%,transparent)] will-change-transform grid-pan z-[4]"
          style={{
            backgroundImage:
              'linear-gradient(90deg, rgba(0,118,255,0.0) 0%, rgba(0,118,255,0.35) 50%, rgba(0,118,255,0.0) 100%)',
            backgroundSize: '50% 100%',
          }}
        />
      </div>

      {/* Content Container */}
      <div className="relative mx-auto max-w-7xl px-6 py-20 md:py-28 z-[10]">
        <div className="grid grid-cols-1 md:grid-cols-2 items-center gap-12">
          {/* Left: Copy */}
          <div className="max-w-2xl">
            <motion.h1
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35 }}
              className="text-4xl md:text-5xl font-bold tracking-tight"
            >
              Websites That Run On All 8 Cylinders
            </motion.h1>
            <p className="mt-4 text-base md:text-lg text-slate-200">
              High-performance sites engineered to turn local visitors into{' '}
              <span className="font-semibold">
                calls, quotes, and booked jobs
              </span>{' '}
              for contractors, trades, and service businesses across Canada.
            </p>

            {/* Trust Chips */}
            <div className="mt-6 flex flex-wrap gap-3">
              <Chip
                color="primary"
                variant="shadow"
                startContent={<Gauge className="h-4 w-4" />}
              >
                Performance-first
              </Chip>
              <Chip
                variant="flat"
                startContent={<Rocket className="h-4 w-4" />}
              >
                SEO & Ads Ready
              </Chip>
              <Chip
                variant="flat"
                startContent={<MapPin className="h-4 w-4" />}
              >
                Canada-based
              </Chip>
            </div>

            {/* CTAs */}
            <div className="mt-8 flex flex-wrap gap-3">
              <Button color="primary" size="lg" className="min-w-[180px]">
                Get a Free Quote
              </Button>
              <Button
                variant="bordered"
                size="lg"
                className="border-white text-white"
              >
                See Our Work
              </Button>
            </div>
          </div>

          {/* Right: Hero Image */}
          <div className="relative w-full h-[380px] md:h-[520px] lg:h-[540px]">
            <Image
              src={heroImage} // <-- replace with your asset
              alt="High-performance website dashboard on a laptop"
              fill
              className="object-contain drop-shadow-2xl"
              priority
            />

            {/* Optional: subtle glow behind the image */}
            <div
              className="pointer-events-none absolute inset-0 -z-10 blur-3xl opacity-20"
              style={{
                background:
                  'radial-gradient(40% 40% at 60% 50%, rgba(0,118,255,0.5), transparent 60%)',
              }}
            />
          </div>
        </div>
      </div>

      {/* global keyframes */}
      <style jsx global>{`
        @keyframes parallax-lines {
          0% {
            transform: translateX(-50%);
          }
          100% {
            transform: translateX(50%);
          }
        }
        @keyframes scan-v {
          0% {
            transform: translateY(-120%);
          }
          100% {
            transform: translateY(200%);
          }
        }
        @keyframes grid-pan {
          0% {
            transform: translateX(-30%);
          }
          100% {
            transform: translateX(30%);
          }
        }
        @keyframes glowing-lines {
          0% {
            background-position: 0 0;
            opacity: 0.15;
          }
          50% {
            background-position: 100% 0;
            opacity: 0.6;
          }
          100% {
            background-position: 0 0;
            opacity: 0.15;
          }
        }
        .animate-parallax-lines {
          animation: parallax-lines 12s linear infinite;
        }
        .scan-v {
          animation: scan-v 12s linear infinite;
        }
        .grid-pan {
          animation: grid-pan 28s linear infinite;
        }
        .animate-glowing-lines {
          animation: glowing-lines 10s linear infinite;
        }
      `}</style>
    </section>
  );
}
