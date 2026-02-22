'use client';

import { FormGroup, FormRow, Checkbox } from '@/components/form';
import type { MilestoneMetadata } from '@/lib/taxonomies';

export interface MilestoneFieldsProps {
  values: MilestoneMetadata;
  onChange: (field: keyof MilestoneMetadata, value: unknown) => void;
}

export function MilestoneFields({ values, onChange }: MilestoneFieldsProps) {
  return (
    <div className="metadata-fields milestone-fields">
      <FormRow>
        <FormGroup label="Status">
          <Checkbox
            id="milestone-completed"
            name="isCompleted"
            label="Completed"
            checked={values.isCompleted}
            onChange={(e) => {
              onChange('isCompleted', e.target.checked);
              if (e.target.checked) {
                onChange('completedAt', new Date().toISOString());
              } else {
                onChange('completedAt', null);
              }
            }}
          />
          {values.completedAt && (
            <p className="field-hint">
              Completed on {new Date(values.completedAt).toLocaleDateString()}
            </p>
          )}
        </FormGroup>
      </FormRow>
    </div>
  );
}
