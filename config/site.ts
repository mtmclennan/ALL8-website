export type SiteConfig = typeof siteConfig;

export const siteConfig = {
  name: "All8 Webworks",
  description: "High-Performance Websites that run on all 8 cylinders",
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
      href: "/#proof",
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
      href: "/#proof",
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
    github: "https://github.com/heroui-inc/heroui",
    twitter: "https://twitter.com",
    facebook: "https://www.facebook.com/profile.php?id=61581617706756",
    linkedin: "https://www.linkedin.com/company/all8-webworks",
  },
  phone: "321-987-4567",
  addressLine: "Paris, Ontario, Canada",
  email: "hello@all8webworks.com",
};
