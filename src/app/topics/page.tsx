import { redirect } from 'next/navigation';
import { getAllTaxonomies } from '@/lib/db';
import { getServerSession } from '@/app/auth/actions';
import { PageContainer, PageHeader, EmptyState } from '@/components/layout';
import { TopicCard } from '@/components/topic';
import { TopicCreateForm } from './TopicCreateForm';
import { TopicEditForm } from './TopicEditForm';
import { TopicDeleteButton } from './TopicDeleteButton';

export default async function TopicsPage() {
  const session = await getServerSession();

  if (!session) {
    redirect('/auth/login');
  }

  const topics = await getAllTaxonomies(session.schemaName);

  return (
    <PageContainer>
      <PageHeader title="Topics" />

      <TopicCreateForm />

      {topics.length === 0 ? (
        <EmptyState message="No topics yet. Create your first topic above." />
      ) : (
        topics.map((topic) => (
          <TopicCard
            key={topic.id}
            topic={topic}
            actions={
              <>
                <TopicEditForm topic={topic} />
                <TopicDeleteButton topicId={topic.id} />
              </>
            }
          />
        ))
      )}
    </PageContainer>
  );
}
