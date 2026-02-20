import { redirect } from 'next/navigation';
import { getAllPosts } from '@/lib/db';
import { getServerSession } from '@/app/auth/actions';
import { PageContainer, PageHeader, EmptyState } from '@/components/layout';
import { PostCard } from '@/components/post';
import { PostCreateForm } from './posts/PostCreateForm';
import { PostEditForm } from './posts/PostEditForm';
import { PostDeleteButton } from './posts/PostDeleteButton';

export default async function HomePage() {
  const session = await getServerSession();

  if (!session) {
    redirect('/auth/login');
  }

  const posts = await getAllPosts(session.schemaName);

  return (
    <PageContainer>
      <PageHeader title="Posts" />

      <PostCreateForm />

      {posts.length === 0 ? (
        <EmptyState message="No posts yet. Create your first post above." />
      ) : (
        posts.map((post) => (
          <PostCard
            key={post.id}
            post={post}
            actions={
              <>
                <PostEditForm post={post} />
                <PostDeleteButton postId={post.id} />
              </>
            }
          />
        ))
      )}
    </PageContainer>
  );
}
