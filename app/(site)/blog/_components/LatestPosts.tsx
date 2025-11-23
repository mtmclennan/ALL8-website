import PostCard from './PostCard';
import { Section, SectionHeader } from '../../components/SectionWrapper';

interface LatestPostsProps {
  posts: any[];
}

export default function LatestPosts({ posts }: LatestPostsProps) {
  if (!posts?.length) return null;

  return (
    <Section pattern="dots" tone="gradient">
      <SectionHeader title="Latest Posts" center />

      <div className="grid gap-12 sm:grid-cols-2 lg:grid-cols-3">
        {posts.map((post) => (
          <PostCard key={post._id} post={post} />
        ))}
      </div>
    </Section>
  );
}
