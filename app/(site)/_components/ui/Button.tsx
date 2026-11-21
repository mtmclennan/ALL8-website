import type {
  AnchorHTMLAttributes,
  ButtonHTMLAttributes,
  ReactNode,
} from "react";

import Link from "next/link";
import clsx from "clsx";

type Variant = "primary" | "ghost" | "tertiary";
type Size = "md" | "lg";

type CommonProps = {
  variant?: Variant;
  size?: Size;
  className?: string;
  children: ReactNode;
};

type ButtonAsButton = CommonProps &
  ButtonHTMLAttributes<HTMLButtonElement> & { href?: undefined };

type ButtonAsLink = CommonProps &
  Omit<AnchorHTMLAttributes<HTMLAnchorElement>, "href"> & { href: string };

export type ButtonProps = ButtonAsButton | ButtonAsLink;

const base =
  "inline-flex min-h-12 max-w-full cursor-pointer items-center justify-center gap-2 rounded-full text-center font-bold tracking-[.005em] whitespace-normal transition-[background-color,border-color,color,box-shadow,translate,scale] duration-[160ms] ease-out focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-[3px] focus-visible:outline-accent-blue active:translate-y-0 active:scale-[0.97] disabled:cursor-not-allowed disabled:opacity-60 disabled:shadow-none disabled:hover:translate-y-0 disabled:active:scale-100";

const variants: Record<Variant, string> = {
  primary:
    "bg-brand-blue text-white shadow-[0_6px_16px_-8px_rgba(0,0,0,.7)] hover:-translate-y-0.5 hover:bg-[#0066df] hover:shadow-[0_10px_22px_-10px_rgba(0,0,0,.8)]",
  ghost:
    "border border-white/25 bg-transparent text-white hover:border-accent-blue hover:bg-white/5",
  tertiary:
    "text-accent-blue underline-offset-4 hover:text-[#8ec5ff] hover:underline",
};

const sizes: Record<Size, string> = {
  md: "px-7 py-3",
  lg: "px-[34px] py-4",
};

// White on brand blue (#0076FF) is 4.2:1, so the primary label must be
// WCAG "large text" (bold, at least 18.66px) to pass AA without changing
// the brand fill. Other variants keep the compact UI size.
const textSizes: Record<Variant, Record<Size, string>> = {
  // At phone widths the long CTA label wraps to two lines; balance them and
  // drop the decorative leading icon so the label stays centred.
  primary: {
    md: "text-[19px] leading-tight text-balance max-sm:[&>svg:first-child]:hidden",
    lg: "text-[19px] leading-tight text-balance max-sm:[&>svg:first-child]:hidden",
  },
  ghost: { md: "text-[15px]", lg: "text-base" },
  tertiary: { md: "text-[15px]", lg: "text-base" },
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
    className,
    children,
    href,
    ...rest
  } = props;

  const classes = clsx(
    base,
    variants[variant],
    sizes[size],
    textSizes[variant][size],
    className,
  );

  if (href) {
    if (isExternalHref(href)) {
      return (
        <a
          className={classes}
          data-button-variant={variant}
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
        data-button-variant={variant}
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
      data-button-variant={variant}
      type="button"
      {...(rest as ButtonHTMLAttributes<HTMLButtonElement>)}
    >
      {children}
    </button>
  );
}
