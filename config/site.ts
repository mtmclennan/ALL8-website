export type SiteConfig = typeof siteConfig;

export const siteConfig = {
  name: 'All8 Webworks',
  description: 'High-Performance Websites that run on all 8 cylinders',
  navItems: [
    {
      label: 'Home',
      href: '/',
    },
    {
      label: 'Contact',
      href: '/contact',
    },

    {
      label: 'Services',
      href: '/services',
    },
    {
      label: 'About',
      href: '/about',
    },
  ],
  navMenuItems: [
    {
      label: 'Contact ',
      href: '/contact',
    },
    {
      label: 'Services',
      href: '/services',
    },
    {
      label: 'About',
      href: '/about',
    },
    {
      label: 'Home',
      href: '/',
    },
  ],
  links: {
    github: 'https://github.com/heroui-inc/heroui',
    twitter: 'https://twitter.com/hero_ui',
    docs: 'https://heroui.com',
    discord: 'https://discord.gg/9b6yyZKmH4',
    sponsor: 'https://patreon.com/jrgarciadev',
  },
  phone: '321-987-4567',
  addressLine: '3475 Brookside Lane Hawthorne, KY 40242',
};
