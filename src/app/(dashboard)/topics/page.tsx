import { redirect } from 'next/navigation';
import { getAllTaxonomies, getAllPosts } from '@/lib/db';
import { getServerSession } from '@/app/auth/actions';
import { TopicsPanel } from '../TopicsPanel';

export default async function TopicsPage() {
  const session = await getServerSession();

  if (!session) {
    redirect('/auth/login');
  }

  const [topics, posts] = await Promise.all([
    getAllTaxonomies(session.schemaName),
    getAllPosts(session.schemaName),
  ]);

  return <TopicsPanel topics={topics} posts={posts} />;
}
