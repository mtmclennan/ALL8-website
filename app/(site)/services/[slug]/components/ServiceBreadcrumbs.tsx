import Link from "next/link";

export default function ServiceBreadcrumbs({ title }: { title: string }) {
  return (
    <nav
      aria-label="Breadcrumb"
      className="relative z-30 bg-background/95 border-b border-white/10"
    >
      <ol className="mx-auto flex max-w-[1160px] flex-wrap items-center gap-2 px-6 py-4 text-sm text-foreground/60 sm:px-10">
        <li>
          <Link className="transition hover:text-foreground" href="/">
            Home
          </Link>
        </li>
        <li aria-hidden="true" className="text-foreground/30">
          /
        </li>
        <li>
          <Link className="transition hover:text-foreground" href="/services">
            Services
          </Link>
        </li>
        <li aria-hidden="true" className="text-foreground/30">
          /
        </li>
        <li
          aria-current="page"
          className="min-w-0 max-w-full truncate text-foreground"
        >
          {title}
        </li>
      </ol>
    </nav>
  );
}
