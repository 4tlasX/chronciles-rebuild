'use client';

import { FormGroup, FormRow, Select, DateInput } from '@/components/form';
import type { GoalMetadata } from '@/lib/taxonomies';

export interface GoalFieldsProps {
  values: GoalMetadata;
  onChange: (field: keyof GoalMetadata, value: unknown) => void;
}

const typeOptions = [
  { value: 'short_term', label: 'Short Term' },
  { value: 'long_term', label: 'Long Term' },
];

const statusOptions = [
  { value: 'active', label: 'Active' },
  { value: 'completed', label: 'Completed' },
  { value: 'archived', label: 'Archived' },
];

export function GoalFields({ values, onChange }: GoalFieldsProps) {
  return (
    <div className="metadata-fields goal-fields">
      <FormRow>
        <FormGroup label="Goal Type" htmlFor="goal-type">
          <Select
            id="goal-type"
            name="type"
            options={typeOptions}
            value={values.type}
            onChange={(e) => onChange('type', e.target.value)}
          />
        </FormGroup>
        <FormGroup label="Status" htmlFor="goal-status">
          <Select
            id="goal-status"
            name="status"
            options={statusOptions}
            value={values.status}
            onChange={(e) => onChange('status', e.target.value)}
          />
        </FormGroup>
      </FormRow>
      <FormRow>
        <FormGroup label="Target Date" htmlFor="goal-target-date">
          <DateInput
            id="goal-target-date"
            name="targetDate"
            value={values.targetDate || ''}
            onChange={(e) => onChange('targetDate', e.target.value || null)}
          />
        </FormGroup>
      </FormRow>
    </div>
  );
}
