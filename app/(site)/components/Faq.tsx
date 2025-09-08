// components/Faq.tsx

import Link from 'next/link';
import { HelpCircle, LucideIcon } from 'lucide-react';

export interface FAQItem {
  icon: LucideIcon;
  question: string;
  answer: string;
}

type FaqProps = {
  items: FAQItem[];
  phone: string;
};

export default function Faq({ items, phone }: FaqProps) {
  return (
    <section className="py-16 px-4 bg-white" id="faq">
      <div className="max-w-4xl mx-auto">
        <h2 className="text-3xl font-bold mb-8 text-center flex items-center justify-center gap-2">
          <HelpCircle size={40} className="text-yellow-400" />
          Frequently Asked Questions
        </h2>
        <div className="space-y-10">
          {items.map((item, idx) => (
            <div key={idx} className="">
              <div className="flex items-center gap-3 mb-2">
                <item.icon size={24} className="text-yellow-400" />
                <h4 className="text-xl font-semibold">{item.question}</h4>
              </div>
              <p className="text-gray-700 pl-7">{item.answer}</p>
            </div>
          ))}
          <div className="mt-12 text-center">
            <h3 className="text-2xl font-semibold mb-4">
              Still have questions?
            </h3>
            <Link
              href={`tel:${phone}`}
              className="text-yellow-400 font-bold text-lg"
            >
              Call us at {phone}
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
