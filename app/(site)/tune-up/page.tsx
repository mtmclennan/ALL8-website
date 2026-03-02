import TuneUpReviewForm from './_components/TuneUpReviewForm';

export const metadata = {
  title: 'Performance Tune-Up Review | ALL8 Webworks',
  description:
    'Tell us what’s happening. We’ll review your site and outline exactly what’s worth fixing.',
};

export default function Page() {
  return (
    <main className="min-h-[calc(100vh-4rem)]">
      <div className="mx-auto max-w-3xl px-6 py-12 md:py-20">
        <TuneUpReviewForm />
      </div>
    </main>
  );
}
