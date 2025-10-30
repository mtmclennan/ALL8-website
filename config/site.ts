import { link } from 'fs';

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
    twitter: 'https://twitter.com',
    facebook: 'https://www.facebook.com/profile.php?id=61581617706756',
    linkedin: 'https://www.linkedin.com/company/all8-webworks',
  },
  phone: '321-987-4567',
  addressLine: 'Paris, Ontario, Canada',
};
