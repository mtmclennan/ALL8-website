import type {
  AnchorHTMLAttributes,
  ButtonHTMLAttributes,
  ReactNode,
} from "react";

import Link from "next/link";
import clsx from "clsx";

type Variant = "primary" | "ghost";
type Size = "md" | "lg";

type CommonProps = {
  variant?: Variant;
  size?: Size;
  pulse?: boolean;
  className?: string;
  children: ReactNode;
};

type ButtonAsButton = CommonProps &
  ButtonHTMLAttributes<HTMLButtonElement> & { href?: undefined };

type ButtonAsLink = CommonProps &
  Omit<AnchorHTMLAttributes<HTMLAnchorElement>, "href"> & { href: string };

export type ButtonProps = ButtonAsButton | ButtonAsLink;

const base =
  "inline-flex items-center justify-center gap-2 rounded-full font-bold text-[15px] tracking-[.005em] whitespace-nowrap transition-all duration-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-accent-blue focus-visible:outline-offset-[3px] disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:translate-y-0";

const variants: Record<Variant, string> = {
  primary:
    "text-white bg-gradient-to-b from-[#1e8bff] to-[#0060d6] shadow-[0_8px_28px_-6px_rgba(0,118,255,.45)] hover:-translate-y-0.5 hover:shadow-[0_14px_36px_-4px_rgba(0,118,255,.65)]",
  ghost:
    "text-white bg-transparent border-[1.5px] border-white/[0.14] hover:border-white/[0.38] hover:bg-white/5",
};

const sizes: Record<Size, string> = {
  md: "px-7 py-3.5",
  lg: "px-[34px] py-[17px] text-base",
};

function isExternalHref(href: string) {
  return (
    /^https?:\/\//.test(href) ||
    href.startsWith("tel:") ||
    href.startsWith("sms:") ||
    href.startsWith("mailto:") ||
    href.startsWith("#")
  );
}

export default function Button(props: ButtonProps) {
  const {
    variant = "primary",
    size = "md",
    pulse,
    className,
    children,
    href,
    ...rest
  } = props;

  const classes = clsx(
    base,
    variants[variant],
    sizes[size],
    pulse && "animate-cta-pulse",
    className,
  );

  if (href) {
    if (isExternalHref(href)) {
      return (
        <a
          className={classes}
          href={href}
          {...(rest as AnchorHTMLAttributes<HTMLAnchorElement>)}
        >
          {children}
        </a>
      );
    }

    return (
      <Link
        className={classes}
        href={href}
        {...(rest as Omit<AnchorHTMLAttributes<HTMLAnchorElement>, "href">)}
      >
        {children}
      </Link>
    );
  }

  return (
    <button
      className={classes}
      type="button"
      {...(rest as ButtonHTMLAttributes<HTMLButtonElement>)}
    >
      {children}
    </button>
  );
}
