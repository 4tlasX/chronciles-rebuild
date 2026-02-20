'use client';

import { TextInput } from './TextInput';
import { Button } from './Button';

export interface KeyValuePairData {
  key: string;
  value: string;
}

export interface KeyValuePairProps {
  index: number;
  data: KeyValuePairData;
  onChange: (index: number, data: KeyValuePairData) => void;
  onRemove: (index: number) => void;
  keyPlaceholder?: string;
  valuePlaceholder?: string;
  removable?: boolean;
}

export function KeyValuePair({
  index,
  data,
  onChange,
  onRemove,
  keyPlaceholder = 'Key',
  valuePlaceholder = 'Value',
  removable = true,
}: KeyValuePairProps) {
  const handleKeyChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(index, { ...data, key: e.target.value });
  };

  const handleValueChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(index, { ...data, value: e.target.value });
  };

  return (
    <div className="key-value-pair">
      <TextInput
        value={data.key}
        onChange={handleKeyChange}
        placeholder={keyPlaceholder}
        aria-label={`${keyPlaceholder} ${index + 1}`}
      />
      <TextInput
        value={data.value}
        onChange={handleValueChange}
        placeholder={valuePlaceholder}
        aria-label={`${valuePlaceholder} ${index + 1}`}
      />
      {removable && (
        <Button
          type="button"
          variant="danger"
          size="sm"
          onClick={() => onRemove(index)}
          aria-label={`Remove pair ${index + 1}`}
        >
          ×
        </Button>
      )}
    </div>
  );
}
