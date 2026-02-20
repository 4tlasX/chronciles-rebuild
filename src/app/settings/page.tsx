import { getAllSettings } from '@/lib/db';
import { getSchemaFromRequest } from '@/lib/auth';
import { PageContainer, PageHeader, EmptyState } from '@/components/layout';
import { Card } from '@/components/card';
import { SettingsTable, SettingRow } from '@/components/settings';
import { SettingCreateForm } from './SettingCreateForm';
import { SettingEditForm } from './SettingEditForm';
import { SettingDeleteButton } from './SettingDeleteButton';

interface PageProps {
  searchParams: Promise<{ email?: string }>;
}

export default async function SettingsPage({ searchParams }: PageProps) {
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

  const settings = await getAllSettings(auth.schemaName);

  return (
    <PageContainer>
      <PageHeader title="Settings" />

      <SettingCreateForm email={auth.email} />

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
                    <SettingEditForm setting={setting} email={auth.email} />
                    <SettingDeleteButton settingKey={setting.key} email={auth.email} />
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
