// 'use client';

// import { motion } from 'framer-motion';

// interface OurStoryProps {
//   heading: string;
//   body: string[];
// }

// export default function OurStory({ heading, body }: OurStoryProps) {
//   return (
//     <section className="relative isolate bg-charcoal text-white py-20 md:py-28 2xl:py-36">
//       {/* Blueprint accent lines */}
//       <div className="relative z-10 mx-auto max-w-5xl px-6 ">
//         <motion.h2
//           initial={{ opacity: 0, y: 10 }}
//           whileInView={{ opacity: 1, y: 0 }}
//           transition={{ duration: 0.4 }}
//           viewport={{ once: true }}
//           className="text-3xl md:text-5xl text-center font-bold tracking-tight"
//         >
//           {heading}
//         </motion.h2>

//         {body.map((para, i) => (
//           <motion.p
//             key={i}
//             initial={{ opacity: 0, y: 8 }}
//             whileInView={{ opacity: 1, y: 0 }}
//             transition={{ duration: 0.45, delay: 0.1 }}
//             viewport={{ once: true }}
//             className="mt-6 text-base  md:text-lg text-foreground/80 leading-relaxed"
//           >
//             {para}
//           </motion.p>
//         ))}
//       </div>
//     </section>
//   );
// }

'use client';

import { motion } from 'framer-motion';

interface OurStoryProps {
  heading: string;
  body: string[];
}

export default function OurStory({ heading, body }: OurStoryProps) {
  return (
    <section className="relative isolate overflow-hidden bg-charcoal text-white py-20 md:py-28 2xl:py-36">
      {/* Subtle blueprint grid background */}
      <div
        aria-hidden="true"
        className="absolute inset-0  bg-repeat opacity-5"
      />
      <div
        aria-hidden="true"
        className="absolute top-0 left-1/2 h-96 w-96 -translate-x-1/2 rounded-full bg-primary/20 blur-3xl"
      />

      <div className="relative z-10 mx-auto max-w-5xl px-6 text-center">
        {/* Heading */}
        <motion.h2
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45 }}
          viewport={{ once: true }}
          className="text-3xl md:text-5xl font-bold tracking-tight"
        >
          {heading}
        </motion.h2>

        {/* Divider line */}
        <motion.div
          initial={{ scaleX: 0 }}
          whileInView={{ scaleX: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          viewport={{ once: true }}
          className="mx-auto mt-6 h-[3px] w-24 origin-left bg-gradient-to-r from-primary to-secondary-red rounded-full"
        />

        {/* Paragraphs */}
        <div className="mt-10 space-y-6 text-left md:text-center">
          {body.map((para, i) => (
            <motion.p
              key={i}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45, delay: i * 0.1 }}
              viewport={{ once: true }}
              className="text-base md:text-lg text-foreground/80 leading-relaxed max-w-3xl mx-auto"
            >
              {para}
            </motion.p>
          ))}
        </div>
      </div>
    </section>
  );
}
