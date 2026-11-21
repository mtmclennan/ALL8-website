"use client";

import type { ReactNode } from "react";

import { Children, useEffect, useRef } from "react";
import {
  LazyMotion,
  MotionConfig,
  domAnimation,
  m,
  useAnimationControls,
  useInView,
  type Variants,
} from "framer-motion";

// Same strong ease-out as the --ease-out CSS token.
const EASE_OUT = [0.23, 1, 0.32, 1] as const;

const group: Variants = {
  hidden: {},
  shown: { transition: { staggerChildren: 0.06 } },
};

// Full transform strings stay hardware accelerated on this framer-motion
// version, unlike the independent x/y/scale props.
const item: Variants = {
  hidden: { opacity: 0, transform: "translateY(8px)" },
  shown: {
    opacity: 1,
    transform: "translateY(0px)",
    transition: { duration: 0.3, ease: EASE_OUT },
  },
};

const mark: Variants = {
  hidden: { opacity: 0, transform: "scale(0.9)" },
  shown: {
    opacity: 1,
    transform: "scale(1)",
    transition: { type: "spring", duration: 0.5, bounce: 0.2 },
  },
};

/**
 * Staggers its children in once, the first time the group scrolls into view.
 * Server HTML is fully visible: the group is only hidden after hydration, and
 * only while it is still below the fold, so slow or failed JS never leaves
 * content invisible. Reduced motion keeps the fade and drops the movement.
 */
export function StaggerInView({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const controls = useAnimationControls();
  const inView = useInView(ref, { once: true, margin: "-100px" });

  useEffect(() => {
    const el = ref.current;

    if (el && el.getBoundingClientRect().top > window.innerHeight) {
      controls.set("hidden");
    }
  }, [controls]);

  useEffect(() => {
    if (inView) controls.start("shown");
  }, [inView, controls]);

  return (
    <LazyMotion features={domAnimation}>
      <MotionConfig reducedMotion="user">
        <m.div
          ref={ref}
          animate={controls}
          className={className}
          initial={false}
          variants={group}
        >
          {Children.map(children, (child) =>
            child ? <m.div variants={item}>{child}</m.div> : null,
          )}
        </m.div>
      </MotionConfig>
    </LazyMotion>
  );
}

/**
 * Success confirmation: the mark settles in on a soft spring, then the text
 * follows in a short stagger. Plays on mount.
 */
export function SuccessReveal({
  icon,
  children,
  className,
}: {
  icon: ReactNode;
  children: ReactNode;
  className?: string;
}) {
  return (
    <LazyMotion features={domAnimation}>
      <MotionConfig reducedMotion="user">
        <m.div
          animate="shown"
          className={className}
          initial="hidden"
          variants={group}
        >
          <m.div variants={mark}>{icon}</m.div>
          {Children.map(children, (child) =>
            child ? <m.div variants={item}>{child}</m.div> : null,
          )}
        </m.div>
      </MotionConfig>
    </LazyMotion>
  );
}
