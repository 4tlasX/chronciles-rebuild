export interface SettingKeyProps {
  settingKey: string;
  className?: string;
}

export function SettingKey({ settingKey, className = '' }: SettingKeyProps) {
  const classes = ['setting-key', className].filter(Boolean).join(' ');
  return <code className={classes}>{settingKey}</code>;
}
