import { redirect } from 'next/navigation';
import { getAllSettings } from '@/lib/db';
import { getServerSession } from '@/app/auth/actions';
import { PageContainer, PageHeader, EmptyState } from '@/components/layout';
import { Card } from '@/components/card';
import { SettingsTable, SettingRow } from '@/components/settings';
import { SettingCreateForm } from './SettingCreateForm';
import { SettingEditForm } from './SettingEditForm';
import { SettingDeleteButton } from './SettingDeleteButton';

export default async function SettingsPage() {
  const session = await getServerSession();

  if (!session) {
    redirect('/auth/login');
  }

  const settings = await getAllSettings(session.schemaName);

  return (
    <PageContainer>
      <PageHeader title="Settings" />

      <SettingCreateForm />

      {settings.length === 0 ? (
        <EmptyState message="No settings yet. Add your first setting above." />
      ) : (
        <Card noPadding>
          <SettingsTable>
            {settings.map((setting) => (
              <SettingRow
                key={setting.key}
                setting={setting}
                actions={
                  <>
                    <SettingEditForm setting={setting} />
                    <SettingDeleteButton settingKey={setting.key} />
                  </>
                }
              />
            ))}
          </SettingsTable>
        </Card>
      )}
    </PageContainer>
  );
}
