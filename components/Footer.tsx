import { Link } from '@heroui/link';
import { siteConfig } from '@/config/site';
import {
  Facebook,
  InstagramIcon,
  LinkedinIcon,
  LinkIcon,
  Phone,
  XIcon,
} from 'lucide-react';
import { Logo, TwitterIcon } from './icons';

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-200 py-12 px-6">
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-[2fr_1fr_1fr] gap-8 text-center md:text-left ">
        {/* Contact Info */}
        <div className="flex flex-col ">
          <Logo />
          <h4 className="font-bold text-inherit">{siteConfig.name}</h4>

          <p>{siteConfig.addressLine || '684 Powerline Rd, Brant, ON'}</p>
          <Link
            href={`tel:${siteConfig.phone}`}
            className="hover:text-white block mt-2"
          >
            <span className="flex gap-1 items-center ">
              <Phone size={16} />
              {siteConfig.phone}
            </span>
          </Link>
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
            {siteConfig.links.github && (
              <Link
                href={siteConfig.links.github}
                isExternal
                className="hover:text-white"
              >
                <Facebook />
              </Link>
            )}
            {siteConfig.links.twitter && (
              <Link
                href={siteConfig.links.twitter}
                isExternal
                className="hover:text-white"
              >
                <LinkedinIcon />
              </Link>
            )}
            {siteConfig.links.docs && (
              <Link
                href={siteConfig.links.docs}
                isExternal
                className="hover:text-white"
              >
                <InstagramIcon />
              </Link>
            )}
          </div>
        </div>
        <div className="col-span-full justify-self-center text-center">
          <p className="italic">Powered by ALL8 Webworks</p>
          <p className="mt-4 text-sm ">
            &copy; {new Date().getFullYear()} {siteConfig.name}
          </p>
        </div>
      </div>
    </footer>
  );
}
