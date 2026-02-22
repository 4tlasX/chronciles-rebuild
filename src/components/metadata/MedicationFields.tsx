'use client';

import { FormGroup, FormRow, Select, TextInput, TimeInput, Checkbox, Textarea, Button } from '@/components/form';
import type { MedicationMetadata } from '@/lib/taxonomies';

export interface MedicationFieldsProps {
  values: MedicationMetadata;
  onChange: (field: keyof MedicationMetadata, value: unknown) => void;
}

const frequencyOptions = [
  { value: 'once_daily', label: 'Once Daily' },
  { value: 'twice_daily', label: 'Twice Daily' },
  { value: 'three_times_daily', label: 'Three Times Daily' },
  { value: 'as_needed', label: 'As Needed' },
  { value: 'custom', label: 'Custom Schedule' },
];

export function MedicationFields({ values, onChange }: MedicationFieldsProps) {
  const handleAddTime = () => {
    onChange('scheduleTimes', [...values.scheduleTimes, '12:00']);
  };

  const handleRemoveTime = (index: number) => {
    const newTimes = values.scheduleTimes.filter((_, i) => i !== index);
    onChange('scheduleTimes', newTimes.length > 0 ? newTimes : ['09:00']);
  };

  const handleTimeChange = (index: number, value: string) => {
    const newTimes = [...values.scheduleTimes];
    newTimes[index] = value;
    onChange('scheduleTimes', newTimes);
  };

  return (
    <div className="metadata-fields medication-fields">
      <FormRow>
        <FormGroup label="Dosage" htmlFor="medication-dosage">
          <TextInput
            id="medication-dosage"
            name="dosage"
            value={values.dosage}
            onChange={(e) => onChange('dosage', e.target.value)}
            placeholder="e.g., 10mg, 2 tablets"
          />
        </FormGroup>
        <FormGroup label="Frequency" htmlFor="medication-frequency">
          <Select
            id="medication-frequency"
            name="frequency"
            options={frequencyOptions}
            value={values.frequency}
            onChange={(e) => onChange('frequency', e.target.value)}
          />
        </FormGroup>
      </FormRow>
      <FormRow>
        <FormGroup label="Schedule Times">
          <div className="schedule-times">
            {values.scheduleTimes.map((time, index) => (
              <div key={index} className="schedule-time-row">
                <TimeInput
                  id={`medication-time-${index}`}
                  name={`scheduleTimes[${index}]`}
                  value={time}
                  onChange={(e) => handleTimeChange(index, e.target.value)}
                />
                {values.scheduleTimes.length > 1 && (
                  <Button
                    type="button"
                    variant="secondary"
                    size="sm"
                    onClick={() => handleRemoveTime(index)}
                  >
                    Remove
                  </Button>
                )}
              </div>
            ))}
            <Button type="button" variant="secondary" size="sm" onClick={handleAddTime}>
              Add Time
            </Button>
          </div>
        </FormGroup>
      </FormRow>
      <FormRow>
        <FormGroup label="Status">
          <Checkbox
            id="medication-active"
            name="isActive"
            label="Currently taking this medication"
            checked={values.isActive}
            onChange={(e) => onChange('isActive', e.target.checked)}
          />
        </FormGroup>
      </FormRow>
      <FormRow>
        <FormGroup label="Notes" htmlFor="medication-notes">
          <Textarea
            id="medication-notes"
            name="notes"
            value={values.notes}
            onChange={(e) => onChange('notes', e.target.value)}
            placeholder="Side effects, instructions, etc..."
            rows={3}
          />
        </FormGroup>
      </FormRow>
    </div>
  );
}
