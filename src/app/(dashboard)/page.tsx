import { redirect } from 'next/navigation';
import { getAllPosts, getAllTaxonomies } from '@/lib/db';
import { getServerSession } from '@/app/auth/actions';
import { PostsPanel } from './PostsPanel';

export default async function HomePage() {
  const session = await getServerSession();

  if (!session) {
    redirect('/auth/login');
  }

  const [posts, taxonomies] = await Promise.all([
    getAllPosts(session.schemaName),
    getAllTaxonomies(session.schemaName),
  ]);

  return <PostsPanel posts={posts} taxonomies={taxonomies} />;
}
