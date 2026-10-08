"use client";

import React from "react";
import { motion, LazyMotion, domAnimation } from "framer-motion";

import Button from "./ui/Button";
import { Section, SectionHeader } from "./SectionWrapper";

type StrongCTAProps = {
  titlePrefix: string;
  highlight: string;
  titleSuffix: string;
  subtitle: string;
  ctaLabel: string;
  ctaHref: string;
  microText?: string;
};

export default function StrongCTA({
  titlePrefix,
  highlight,
  titleSuffix,
  subtitle,
  ctaLabel,
  ctaHref,
  microText = "Clear scope • Published plan pricing • Built for speed & conversions",
}: StrongCTAProps) {
  return (
    <Section pattern="none" tone="gradient">
      {/* background flourish */}
      {/* <div aria-hidden className="pointer-events-none" /> */}

      <LazyMotion features={domAnimation}>
        <motion.div
          className="mx-auto max-w-3xl text-center"
          initial={{ opacity: 0, y: 16 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true, amount: 0.3 }}
          whileInView={{ opacity: 1, y: 0 }}
        >
          <SectionHeader
            center
            subtitle={subtitle}
            title={
              <>
                {titlePrefix}
                {"  "}
                <motion.span
                  animate={{ scale: 1.1, opacity: 1 }}
                  className="inline-block whitespace-nowrap text-chrome text-fill-transparent font-extrabold mx-2 sm:mx-3"
                  initial={{ scale: 0.85, opacity: 0.6 }}
                  transition={{
                    type: "spring",
                    duration: 0.7,
                    stiffness: 300,
                    delay: 0.3,
                  }}
                >
                  {highlight}
                </motion.span>
                {"  "}
                {titleSuffix}
              </>
            }
          />

          {/* CTA Buttons */}
          <div className="mt-4 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Button href={ctaHref} size="lg">
              {ctaLabel}
            </Button>
          </div>

          {/* Micro-trust row */}
          {microText && (
            <div className="mt-5 text-white/80">
              <p className="text-sm">{microText}</p>
            </div>
          )}
        </motion.div>
      </LazyMotion>
    </Section>
  );
}
