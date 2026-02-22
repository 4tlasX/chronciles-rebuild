import { redirect } from 'next/navigation';
import { getServerSession } from '@/app/auth/actions';
import { PageContainer, PageHeader } from '@/components/layout';
import { getTypedSettings } from '@/lib/settings';
import { SettingsClient } from './SettingsClient';

export default async function SettingsPage() {
  const session = await getServerSession();

  if (!session) {
    redirect('/auth/login');
  }

  const settings = await getTypedSettings(session.schemaName);

  return (
    <PageContainer>
      <PageHeader title="Settings" />
      <SettingsClient initialSettings={settings} />
    </PageContainer>
  );
}
