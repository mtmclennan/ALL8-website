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
  "inline-flex min-h-12 max-w-full cursor-pointer items-center justify-center gap-2 rounded-full text-center text-[15px] font-bold tracking-[.005em] whitespace-normal transition-[background-color,border-color,color,box-shadow,transform] duration-200 ease-out focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-[3px] focus-visible:outline-accent-blue active:translate-y-0 disabled:cursor-not-allowed disabled:opacity-60 disabled:shadow-none disabled:hover:translate-y-0";

const variants: Record<Variant, string> = {
  primary:
    "bg-brand-blue text-white shadow-[0_6px_18px_-8px_rgba(0,118,255,.5)] hover:-translate-y-0.5 hover:bg-[#0066df] hover:shadow-[0_8px_22px_-10px_rgba(0,118,255,.6)]",
  ghost:
    "border border-white/25 bg-transparent text-white hover:border-accent-blue hover:bg-white/5",
  tertiary:
    "text-accent-blue underline-offset-4 hover:text-[#8ec5ff] hover:underline",
};

const sizes: Record<Size, string> = {
  md: "px-7 py-3",
  lg: "px-[34px] py-4 text-base",
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
