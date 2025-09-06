import { title } from '@/components/primitives';
import { Metadata } from 'next';
import { validateMetadata } from '@/lib/utils/seoValidation';
import { buildStaticMetadata } from '@/lib/utils/page-meta';

export const metadata: Metadata = buildStaticMetadata('/about');

validateMetadata(metadata.title, metadata.description);
export default function AboutPage() {
  return (
    <div>
      <h1 className={title()}>About</h1>
    </div>
  );
}
