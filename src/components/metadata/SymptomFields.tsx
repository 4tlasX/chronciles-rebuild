'use client';

import { FormGroup, FormRow, RangeInput, DateTimeInput, NumberInput, Textarea } from '@/components/form';
import type { SymptomMetadata } from '@/lib/taxonomies';

export interface SymptomFieldsProps {
  values: SymptomMetadata;
  onChange: (field: keyof SymptomMetadata, value: unknown) => void;
}

const severityLabels: Record<number, string> = {
  1: 'Minimal',
  2: 'Mild',
  3: 'Mild',
  4: 'Moderate',
  5: 'Moderate',
  6: 'Significant',
  7: 'Significant',
  8: 'Severe',
  9: 'Very Severe',
  10: 'Extreme',
};

export function SymptomFields({ values, onChange }: SymptomFieldsProps) {
  return (
    <div className="metadata-fields symptom-fields">
      <FormRow>
        <FormGroup label={`Severity: ${severityLabels[values.severity] || values.severity}`} htmlFor="symptom-severity">
          <RangeInput
            id="symptom-severity"
            name="severity"
            min={1}
            max={10}
            value={values.severity}
            onChange={(e) => onChange('severity', parseInt(e.target.value, 10))}
            labels={{ min: '1', max: '10' }}
          />
        </FormGroup>
      </FormRow>
      <FormRow>
        <FormGroup label="When did it occur?" htmlFor="symptom-occurred-at">
          <DateTimeInput
            id="symptom-occurred-at"
            name="occurredAt"
            value={values.occurredAt || ''}
            onChange={(e) => onChange('occurredAt', e.target.value || null)}
          />
        </FormGroup>
        <FormGroup label="Duration (minutes)" htmlFor="symptom-duration">
          <NumberInput
            id="symptom-duration"
            name="duration"
            min={0}
            value={values.duration ?? ''}
            onChange={(e) => onChange('duration', e.target.value ? parseInt(e.target.value, 10) : null)}
            placeholder="Duration in minutes"
          />
        </FormGroup>
      </FormRow>
      <FormRow>
        <FormGroup label="Notes" htmlFor="symptom-notes">
          <Textarea
            id="symptom-notes"
            name="notes"
            value={values.notes}
            onChange={(e) => onChange('notes', e.target.value)}
            placeholder="Describe the symptom, triggers, etc..."
            rows={3}
          />
        </FormGroup>
      </FormRow>
    </div>
  );
}
