'use client';

import { useState, useCallback } from 'react';
import { KeyValuePair, KeyValuePairData } from './KeyValuePair';
import { Button } from './Button';

export interface KeyValueListProps {
  initialPairs?: KeyValuePairData[];
  onChange?: (pairs: KeyValuePairData[]) => void;
  keyPlaceholder?: string;
  valuePlaceholder?: string;
  addButtonText?: string;
  name?: string;
}

export function KeyValueList({
  initialPairs = [],
  onChange,
  keyPlaceholder = 'Key',
  valuePlaceholder = 'Value',
  addButtonText = 'Add Field',
  name = 'metadata',
}: KeyValueListProps) {
  const [pairs, setPairs] = useState<KeyValuePairData[]>(
    initialPairs.length > 0 ? initialPairs : []
  );

  const updatePairs = useCallback(
    (newPairs: KeyValuePairData[]) => {
      setPairs(newPairs);
      onChange?.(newPairs);
    },
    [onChange]
  );

  const handleAdd = () => {
    updatePairs([...pairs, { key: '', value: '' }]);
  };

  const handleChange = (index: number, data: KeyValuePairData) => {
    const newPairs = [...pairs];
    newPairs[index] = data;
    updatePairs(newPairs);
  };

  const handleRemove = (index: number) => {
    const newPairs = pairs.filter((_, i) => i !== index);
    updatePairs(newPairs);
  };

  // Convert pairs to JSON for form submission
  const jsonValue = JSON.stringify(
    pairs.reduce(
      (acc, pair) => {
        if (pair.key.trim()) {
          // Try to parse value as JSON, otherwise keep as string
          try {
            acc[pair.key] = JSON.parse(pair.value);
          } catch {
            acc[pair.key] = pair.value;
          }
        }
        return acc;
      },
      {} as Record<string, unknown>
    )
  );

  return (
    <div className="key-value-list">
      {pairs.map((pair, index) => (
        <KeyValuePair
          key={index}
          index={index}
          data={pair}
          onChange={handleChange}
          onRemove={handleRemove}
          keyPlaceholder={keyPlaceholder}
          valuePlaceholder={valuePlaceholder}
        />
      ))}
      <input type="hidden" name={name} value={jsonValue} />
      <Button type="button" variant="secondary" size="sm" onClick={handleAdd}>
        + {addButtonText}
      </Button>
    </div>
  );
}
