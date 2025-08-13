import { Link } from '@heroui/link';
import { button as buttonStyles } from '@heroui/theme';

export default function CallToAction() {
  return (
    <section className="bg-primary text-white py-16 px-6">
      <div className="max-w-4xl mx-auto text-center space-y-6">
        <h2 className="text-3xl md:text-4xl font-bold">
          Ready to Get Started?
        </h2>
        <p className="text-lg text-white/90">
          Get in touch with us today for a free estimate on your excavation
          project. We’re here to help you bring your vision to life!
        </p>
        <Link
          className={buttonStyles({
            color: 'secondary',
            size: 'lg',
            radius: 'sm',
            variant: 'shadow',
          })}
          href="/contact"
        >
          Start Your Project Today
        </Link>
      </div>
    </section>
  );
}
