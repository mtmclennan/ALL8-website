'use client';

import dynamic from 'next/dynamic';
import { Link } from '@heroui/link';
import { siteConfig } from '@/config/site';
import { Facebook, InstagramIcon, LinkedinIcon } from 'lucide-react';

import Logo from './Logo';

export default function Footer() {
  return (
    <footer className="bg-[#0B0F1A] border-t border-[#ffffff0d] text-gray-200 py-12 px-6">
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-[2fr_1fr_1fr] gap-8 text-center md:text-left">
        {/* Contact Info */}
        <div className="flex flex-col items-center md:items-start">
          <Link href="/">
            <Logo size="lg" variant="stacked" />
          </Link>
          {/* <h4 className="font-bold text-inherit">{siteConfig.name}</h4> */}

          {/* <p>{siteConfig.addressLine || 'Brant, ON'}</p> */}
          {/* <Link
            href={`tel:${siteConfig.phone}`}
            className="hover:text-white block mt-2"
          >
            <span className="flex gap-1 items-center ">
              <Phone size={16} />
              {siteConfig.phone}
            </span>
          </Link> */}
        </div>
        {/* Navigation Links */}
        <div>
          <h4 className="text-lg font-semibold mb-2">Quick Links</h4>
          <ul className="space-y-1">
            {siteConfig.navItems.map((item) => (
              <li key={item.href}>
                <Link href={item.href} className="hover:text-white">
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
        {/* Social & Attribution */}
        <div>
          <h4 className="text-lg font-semibold mb-2">Stay In Touch</h4>
          <div className="flex justify-center md:justify-start space-x-4">
            {siteConfig.links.facebook && (
              <Link
                href={siteConfig.links.facebook}
                isExternal
                className="hover:text-white"
              >
                <Facebook />
              </Link>
            )}

            {siteConfig.links.linkedin && (
              <Link
                href={siteConfig.links.linkedin}
                isExternal
                className="hover:text-white"
              >
                <LinkedinIcon />
              </Link>
            )}
          </div>
        </div>
        <div className="col-span-full justify-self-center text-center">
          {/* <p className="italic">Powered by ALL8 Webworks</p> */}
          <p className="mt-4 text-sm ">
            &copy; {new Date().getFullYear()} {siteConfig.name}
          </p>
        </div>
      </div>
    </footer>
  );
}
