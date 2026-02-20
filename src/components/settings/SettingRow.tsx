import { ReactNode } from 'react';
import { SettingKey } from './SettingKey';
import { SettingValue } from './SettingValue';
import { SettingDate } from './SettingDate';
import type { Setting } from '@/lib/db';

export interface SettingRowProps {
  setting: Setting;
  actions?: ReactNode;
}

export function SettingRow({ setting, actions }: SettingRowProps) {
  return (
    <tr className="setting-row">
      <td className="setting-row-key">
        <SettingKey settingKey={setting.key} />
      </td>
      <td className="setting-row-value">
        <SettingValue value={setting.value} />
      </td>
      <td className="setting-row-date">
        <SettingDate date={setting.updatedAt} />
      </td>
      <td className="setting-row-actions">{actions}</td>
    </tr>
  );
}
