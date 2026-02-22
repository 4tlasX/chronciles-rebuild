'use client';

import { FormGroup, FormRow, Select, TextInput, NumberInput, DateTimeInput, Textarea } from '@/components/form';
import type { ExerciseMetadata } from '@/lib/taxonomies';

export interface ExerciseFieldsProps {
  values: ExerciseMetadata;
  onChange: (field: keyof ExerciseMetadata, value: unknown) => void;
}

const exerciseTypeOptions = [
  { value: 'yoga', label: 'Yoga' },
  { value: 'cardio', label: 'Cardio' },
  { value: 'strength', label: 'Strength Training' },
  { value: 'swimming', label: 'Swimming' },
  { value: 'running', label: 'Running' },
  { value: 'cycling', label: 'Cycling' },
  { value: 'walking', label: 'Walking' },
  { value: 'hiking', label: 'Hiking' },
  { value: 'other', label: 'Other' },
];

const intensityOptions = [
  { value: 'low', label: 'Low' },
  { value: 'medium', label: 'Medium' },
  { value: 'high', label: 'High' },
];

const distanceUnitOptions = [
  { value: 'miles', label: 'Miles' },
  { value: 'km', label: 'Kilometers' },
];

export function ExerciseFields({ values, onChange }: ExerciseFieldsProps) {
  return (
    <div className="metadata-fields exercise-fields">
      <FormRow>
        <FormGroup label="Exercise Type" htmlFor="exercise-type">
          <Select
            id="exercise-type"
            name="type"
            options={exerciseTypeOptions}
            value={values.type}
            onChange={(e) => onChange('type', e.target.value)}
          />
        </FormGroup>
        {values.type === 'other' && (
          <FormGroup label="Specify Type" htmlFor="exercise-other-type">
            <TextInput
              id="exercise-other-type"
              name="otherType"
              value={values.otherType}
              onChange={(e) => onChange('otherType', e.target.value)}
              placeholder="What type of exercise?"
            />
          </FormGroup>
        )}
      </FormRow>
      <FormRow>
        <FormGroup label="Duration (minutes)" htmlFor="exercise-duration">
          <NumberInput
            id="exercise-duration"
            name="duration"
            min={0}
            value={values.duration ?? ''}
            onChange={(e) => onChange('duration', e.target.value ? parseInt(e.target.value, 10) : null)}
            placeholder="Duration"
          />
        </FormGroup>
        <FormGroup label="Intensity" htmlFor="exercise-intensity">
          <Select
            id="exercise-intensity"
            name="intensity"
            options={intensityOptions}
            value={values.intensity}
            onChange={(e) => onChange('intensity', e.target.value)}
          />
        </FormGroup>
      </FormRow>
      <FormRow>
        <FormGroup label="Distance" htmlFor="exercise-distance">
          <NumberInput
            id="exercise-distance"
            name="distance"
            min={0}
            step={0.1}
            value={values.distance ?? ''}
            onChange={(e) => onChange('distance', e.target.value ? parseFloat(e.target.value) : null)}
            placeholder="Distance"
          />
        </FormGroup>
        <FormGroup label="Unit" htmlFor="exercise-distance-unit">
          <Select
            id="exercise-distance-unit"
            name="distanceUnit"
            options={distanceUnitOptions}
            value={values.distanceUnit}
            onChange={(e) => onChange('distanceUnit', e.target.value)}
          />
        </FormGroup>
      </FormRow>
      <FormRow>
        <FormGroup label="Calories Burned" htmlFor="exercise-calories">
          <NumberInput
            id="exercise-calories"
            name="calories"
            min={0}
            value={values.calories ?? ''}
            onChange={(e) => onChange('calories', e.target.value ? parseInt(e.target.value, 10) : null)}
            placeholder="Estimated calories"
          />
        </FormGroup>
        <FormGroup label="When performed" htmlFor="exercise-performed-at">
          <DateTimeInput
            id="exercise-performed-at"
            name="performedAt"
            value={values.performedAt || ''}
            onChange={(e) => onChange('performedAt', e.target.value || null)}
          />
        </FormGroup>
      </FormRow>
      <FormRow>
        <FormGroup label="Notes" htmlFor="exercise-notes">
          <Textarea
            id="exercise-notes"
            name="notes"
            value={values.notes}
            onChange={(e) => onChange('notes', e.target.value)}
            placeholder="How did it go? Any observations?"
            rows={3}
          />
        </FormGroup>
      </FormRow>
    </div>
  );
}
