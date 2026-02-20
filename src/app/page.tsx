import { getAllPosts } from '@/lib/db';
import { getSchemaFromRequest } from '@/lib/auth';
import { PageContainer, PageHeader, EmptyState } from '@/components/layout';
import { Card } from '@/components/card';
import { PostCard } from '@/components/post';
import { PostCreateForm } from './posts/PostCreateForm';
import { PostEditForm } from './posts/PostEditForm';
import { PostDeleteButton } from './posts/PostDeleteButton';

interface PageProps {
  searchParams: Promise<{ email?: string }>;
}

export default async function HomePage({ searchParams }: PageProps) {
  const params = await searchParams;
  const auth = await getSchemaFromRequest(params);

  if (!auth) {
    return (
      <PageContainer>
        <Card>
          <p>User not found. Please register first or use ?email=demo@chronicles.local</p>
        </Card>
      </PageContainer>
    );
  }

  const posts = await getAllPosts(auth.schemaName);

  return (
    <PageContainer>
      <PageHeader title="Posts" />

      <PostCreateForm email={auth.email} />

      {posts.length === 0 ? (
        <EmptyState message="No posts yet. Create your first post above." />
      ) : (
        posts.map((post) => (
          <PostCard
            key={post.id}
            post={post}
            actions={
              <>
                <PostEditForm post={post} email={auth.email} />
                <PostDeleteButton postId={post.id} email={auth.email} />
              </>
            }
          />
        ))
      )}
    </PageContainer>
  );
}
