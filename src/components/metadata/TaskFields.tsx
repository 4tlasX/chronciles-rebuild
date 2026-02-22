'use client';

import { FormGroup, FormRow, Checkbox } from '@/components/form';
import type { TaskMetadata } from '@/lib/taxonomies';

export interface TaskFieldsProps {
  values: TaskMetadata;
  onChange: (field: keyof TaskMetadata, value: unknown) => void;
}

export function TaskFields({ values, onChange }: TaskFieldsProps) {
  return (
    <div className="metadata-fields task-fields">
      <FormRow>
        <FormGroup label="Status">
          <div className="checkbox-group">
            <Checkbox
              id="task-completed"
              name="isCompleted"
              label="Completed"
              checked={values.isCompleted}
              onChange={(e) => {
                onChange('isCompleted', e.target.checked);
                // Disable auto-migrating when completed
                if (e.target.checked) {
                  onChange('isAutoMigrating', false);
                }
              }}
            />
            <Checkbox
              id="task-in-progress"
              name="isInProgress"
              label="In Progress"
              checked={values.isInProgress}
              onChange={(e) => onChange('isInProgress', e.target.checked)}
            />
            <Checkbox
              id="task-auto-migrating"
              name="isAutoMigrating"
              label="Auto-migrate if incomplete"
              checked={values.isAutoMigrating}
              disabled={values.isCompleted}
              onChange={(e) => onChange('isAutoMigrating', e.target.checked)}
            />
          </div>
        </FormGroup>
      </FormRow>
    </div>
  );
}
