import { getAllTaxonomies } from '@/lib/db';
import { getSchemaFromRequest } from '@/lib/auth';
import { PageContainer, PageHeader, EmptyState } from '@/components/layout';
import { Card } from '@/components/card';
import { TopicCard } from '@/components/topic';
import { TopicCreateForm } from './TopicCreateForm';
import { TopicEditForm } from './TopicEditForm';
import { TopicDeleteButton } from './TopicDeleteButton';

interface PageProps {
  searchParams: Promise<{ email?: string }>;
}

export default async function TopicsPage({ searchParams }: PageProps) {
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

  const topics = await getAllTaxonomies(auth.schemaName);

  return (
    <PageContainer>
      <PageHeader title="Topics" />

      <TopicCreateForm email={auth.email} />

      {topics.length === 0 ? (
        <EmptyState message="No topics yet. Create your first topic above." />
      ) : (
        topics.map((topic) => (
          <TopicCard
            key={topic.id}
            topic={topic}
            actions={
              <>
                <TopicEditForm topic={topic} email={auth.email} />
                <TopicDeleteButton topicId={topic.id} email={auth.email} />
              </>
            }
          />
        ))
      )}
    </PageContainer>
  );
}
