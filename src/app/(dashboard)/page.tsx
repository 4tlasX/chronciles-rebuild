import { redirect } from 'next/navigation';
import { getAllPostsWithEncryption, getAllTaxonomies } from '@/lib/db';
import { getServerSession } from '@/app/auth/actions';
import { PostCardFeed } from './PostCardFeed';

// Helper to convert Buffer to base64 string for client serialization
function bufferToBase64(buffer: Buffer | null): string | null {
  if (!buffer) return null;
  return buffer.toString('base64');
}

export default async function HomePage() {
  const session = await getServerSession();

  if (!session) {
    redirect('/auth/login');
  }

  const [rawPosts, taxonomies] = await Promise.all([
    getAllPostsWithEncryption(session.schemaName, { limit: 50, offset: 0 }),
    getAllTaxonomies(session.schemaName),
  ]);

  // Convert Buffer fields to base64 strings for client serialization
  const posts = rawPosts.map((post) => ({
    ...post,
    contentEncrypted: bufferToBase64(post.contentEncrypted),
    contentIv: bufferToBase64(post.contentIv),
    metadataEncrypted: bufferToBase64(post.metadataEncrypted),
    metadataIv: bufferToBase64(post.metadataIv),
  }));

  return (
    <PostCardFeed
      initialPosts={posts}
      taxonomies={taxonomies}
      hasMore={posts.length === 50}
    />
  );
}
