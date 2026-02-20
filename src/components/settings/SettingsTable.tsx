import { ReactNode } from 'react';

export interface SettingsTableProps {
  children: ReactNode;
}

export function SettingsTable({ children }: SettingsTableProps) {
  return (
    <table className="settings-table">
      <thead>
        <tr>
          <th>Key</th>
          <th>Value</th>
          <th>Updated</th>
          <th></th>
        </tr>
      </thead>
      <tbody>{children}</tbody>
    </table>
  );
}
