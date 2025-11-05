'use client';

import { Link } from '@heroui/link';
import { siteConfig } from '@/config/site';
import { Facebook, LinkedinIcon } from 'lucide-react';
import Logo from './Logo';
import { S } from '@upstash/redis/zmscore-Cq_Bzgy4';

export default function Footer() {
  return (
    <footer className="bg-[#0B0F1A] border-t border-[#ffffff0d] text-gray-200 py-12 px-6">
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-[2fr_1fr_1fr] gap-8 text-center md:text-left">
        {/* --- Contact Info --- */}
        <div className="flex flex-col items-center md:items-start">
          <Link href="/" aria-label="Go to ALL8 Webworks home page">
            <Logo size="lg" variant="stacked" />
          </Link>
        </div>

        {/* --- Quick Links --- */}
        <div>
          <h2 className="text-lg font-semibold mb-2">Quick Links</h2>
          <ul className="space-y-1" role="list">
            {siteConfig.navItems.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className="hover:text-white text-blue-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-500"
                >
                  {item.label}
                </Link>
              </li>
            ))}
            {siteConfig.navFooter &&
              siteConfig.navFooter?.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="hover:text-white text-grey-400 text-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-500"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
          </ul>
        </div>

        {/* --- Social --- */}
        <div>
          <h3 className="text-lg font-semibold mb-2">Stay In Touch</h3>
          <ul
            className="flex justify-center md:justify-start space-x-4"
            role="list"
          >
            {siteConfig.links.facebook && (
              <li>
                <Link
                  href={siteConfig.links.facebook}
                  isExternal
                  aria-label="Visit ALL8 Webworks on Facebook"
                  className="hover:text-white text-blue-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-500"
                >
                  <Facebook aria-hidden="true" />
                </Link>
              </li>
            )}
            {siteConfig.links.linkedin && (
              <li>
                <Link
                  href={siteConfig.links.linkedin}
                  isExternal
                  aria-label="Visit ALL8 Webworks on LinkedIn"
                  className="hover:text-white text-blue-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-500"
                >
                  <LinkedinIcon aria-hidden="true" />
                </Link>
              </li>
            )}
          </ul>
        </div>

        {/* --- Attribution --- */}
        <div className="col-span-full justify-self-center text-center">
          <p className="mt-4 text-sm">
            &copy; {new Date().getFullYear()} {siteConfig.name}
          </p>
        </div>
      </div>
    </footer>
  );
}
