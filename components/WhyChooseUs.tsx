import { LucideIcon } from 'lucide-react';

type WhyChooseUsItem = {
  icon: LucideIcon;
  title: string;
  description: string;
};

type WhyChooseUsProps = {
  items: WhyChooseUsItem[];
};

export default function WhyChooseUs({ items }: WhyChooseUsProps) {
  return (
    <section className="py-16 px-4 bg-gray-50" id="why-choose-us">
      <div className="max-w-6xl mx-auto text-center">
        <h2 className="text-3xl font-bold mb-10 uppercase">Why Choose Us?</h2>
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3 text-left">
          {items.map((item, index) => (
            <div key={index} className="bg-white shadow-md p-6 rounded-lg">
              <item.icon className="w-8 h-8 text-primary mb-3" />
              <h3 className="text-xl font-semibold mb-2 uppercase text-primary">
                {item.title}
              </h3>
              <p className="text-gray-700 text-sm">{item.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
