"use client";

import React from "react";
import { motion, LazyMotion, domAnimation } from "framer-motion";
import { Button } from "@heroui/button";

import {
  ButtonGradientWrapper,
  Section,
  SectionHeader,
} from "./SectionWrapper";

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
  microText = "No long contracts • Transparent pricing • Built for speed & conversions",
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
            className="sm:text-8xl"
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
                  whileHover={{ scale: 1.3 }}
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
            <ButtonGradientWrapper>
              <Button
                as={"a"}
                className="inline-flex items-center gap-2 rounded-lg px-5 py-3 text-lg font-medium text-white bg-chrome-cta hover:bg-chrome-cta-hover active:bg-chrome-cta-active shadow-md focus:outline-none focus-visible:ring-2 focus-visible:ring-chrome"
                href={ctaHref}
                radius="sm"
                size="lg"
                variant="solid"
              >
                {ctaLabel}
              </Button>
            </ButtonGradientWrapper>
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
