export type SiteConfig = typeof siteConfig;

export const siteConfig = {
  name: "ALL8 Webworks",
  description:
    "Connected lead-generation systems for service businesses across the United States and Canada.",
  // Contact is deliberately excluded — it competes with the primary conversion (Free Lead System Review).
  navItems: [
    {
      label: "How It Works",
      href: "/#system",
    },
    {
      label: "Services",
      href: "/services",
    },
    {
      label: "Results",
      href: "/work",
    },
    {
      label: "About",
      href: "/about",
    },
    {
      label: "Blog",
      href: "/blog",
    },
  ],
  navMenuItems: [
    {
      label: "How It Works",
      href: "/#system",
    },
    {
      label: "Services",
      href: "/services",
    },
    {
      label: "Results",
      href: "/work",
    },
    {
      label: "About",
      href: "/about",
    },
    {
      label: "Blog",
      href: "/blog",
    },
    {
      label: "FAQ",
      href: "/#faq",
    },
  ],
  navFooter: [
    {
      label: "legal",
      href: "/legal",
    },
  ],
  links: {
    github: "",
    facebook: "https://www.facebook.com/profile.php?id=61581617706756",
    linkedin: "https://www.linkedin.com/company/all8-webworks",
  },
  phone: "(519) 807-3483",
  addressLine: "Ontario, Canada",
  email: "hello@all8webworks.com",
};
