import { redirect } from 'next/navigation';
import { getAllPosts, getAllTaxonomies } from '@/lib/db';
import { getServerSession } from '@/app/auth/actions';
import { PostCardFeed } from './PostCardFeed';

export default async function HomePage() {
  const session = await getServerSession();

  if (!session) {
    redirect('/auth/login');
  }

  const [posts, taxonomies] = await Promise.all([
    getAllPosts(session.schemaName, { limit: 50, offset: 0 }),
    getAllTaxonomies(session.schemaName),
  ]);

  return (
    <PostCardFeed
      initialPosts={posts}
      taxonomies={taxonomies}
      hasMore={posts.length === 50}
    />
  );
}
