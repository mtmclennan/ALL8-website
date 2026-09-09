import Image from "next/image";
import clsx from "clsx";

import { brand } from "@/data/brand";

type LogoProps = {
  variant?: "horizontal" | "stacked";
  size?: "sm" | "nav" | "md" | "lg"; // controls text scale
  showMark?: boolean;
  className?: string;
};

const sizeMap = {
  sm: { all8: "text-xl", web: "text-[0.85em]" },
  nav: {
    all8: "text-[1.65rem] sm:text-3xl",
    web: "text-[0.92rem] sm:text-base",
  },
  md: { all8: "text-3xl", web: "text-[1.6em]" },
  lg: { all8: "text-5xl", web: "text-[1.8em]" },
};

export default function Logo({
  variant = "horizontal",
  size = "md",
  showMark = true,
  className,
}: LogoProps) {
  const s = sizeMap[size];

  if (variant === "stacked") {
    return (
      <div
        aria-label="ALL8 Webworks"
        className={clsx("inline-flex flex-col items-center", className)}
      >
        {showMark && (
          <Image
            alt={brand.logoAlt}
            fetchPriority="low"
            height={100}
            placeholder="blur"
            priority={false}
            quality={75}
            sizes="(min-width:1024px) 80px, (min-width:640px) 64px, 48px"
            src={brand.logo}
            width={100}
          />
        )}
        <div className="text-center leading-none">
          <span className={clsx("font-display font-black  text-white", s.all8)}>
            ALL8
          </span>
          <div
            className={clsx(
              "font-body font-light text-brand-blue",
              s.web,
              "mt-0.5",
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
      aria-label="ALL8 Webworks"
      className={clsx("flex h-full items-center gap-2", className)}
    >
      {showMark && (
        <Image
          alt={brand.logoAlt}
          className="translate-y-[2px]"
          fetchPriority="low"
          height={40}
          placeholder="blur"
          priority={false}
          quality={75}
          sizes="(min-width:1280px) 40px, (min-width:768px) 36px, 28px"
          src={brand.logo}
          width={40}
        />
      )}
      <div className="flex items-baseline gap-1 leading-none">
        <span
          className={clsx(
            "font-display font-black tracking-tight text-white",
            s.all8,
          )}
        >
          ALL8
        </span>
        <span className={clsx("font-body font-light text-brand-blue", s.web)}>
          WEBWORKS
        </span>
      </div>
    </div>
  );
}
