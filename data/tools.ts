import type { Stage } from "@/lib/utils/stage";

export type All8Tool = {
  title: string;
  description: string;
  href: string;
  stage: Stage;
};

export const ALL8_TOOLS: All8Tool[] = [
  {
    title: "Missed-Call Revenue Calculator",
    description:
      "Estimate the potential sales opportunity represented by unanswered business calls using your own call volume, job value and follow-up assumptions.",
    href: "/tools/missed-call-revenue-calculator",
    stage: "follow",
  },
];
