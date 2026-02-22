'use client';

import { FormGroup, FormRow, Select, DateTimeInput, TextInput, NumberInput, Textarea } from '@/components/form';
import type { FoodMetadata } from '@/lib/taxonomies';

export interface FoodFieldsProps {
  values: FoodMetadata;
  onChange: (field: keyof FoodMetadata, value: unknown) => void;
}

const mealTypeOptions = [
  { value: 'breakfast', label: 'Breakfast' },
  { value: 'lunch', label: 'Lunch' },
  { value: 'dinner', label: 'Dinner' },
  { value: 'snack', label: 'Snack' },
];

export function FoodFields({ values, onChange }: FoodFieldsProps) {
  return (
    <div className="metadata-fields food-fields">
      <FormRow>
        <FormGroup label="Meal Type" htmlFor="food-meal-type">
          <Select
            id="food-meal-type"
            name="mealType"
            options={mealTypeOptions}
            value={values.mealType}
            onChange={(e) => onChange('mealType', e.target.value)}
          />
        </FormGroup>
        <FormGroup label="When consumed" htmlFor="food-consumed-at">
          <DateTimeInput
            id="food-consumed-at"
            name="consumedAt"
            value={values.consumedAt || ''}
            onChange={(e) => onChange('consumedAt', e.target.value || null)}
          />
        </FormGroup>
      </FormRow>
      <FormRow>
        <FormGroup label="Ingredients" htmlFor="food-ingredients">
          <TextInput
            id="food-ingredients"
            name="ingredients"
            value={values.ingredients}
            onChange={(e) => onChange('ingredients', e.target.value)}
            placeholder="Comma-separated ingredients"
          />
        </FormGroup>
      </FormRow>
      <FormRow>
        <FormGroup label="Calories" htmlFor="food-calories">
          <NumberInput
            id="food-calories"
            name="calories"
            min={0}
            value={values.calories ?? ''}
            onChange={(e) => onChange('calories', e.target.value ? parseInt(e.target.value, 10) : null)}
            placeholder="Estimated calories"
          />
        </FormGroup>
      </FormRow>
      <FormRow>
        <FormGroup label="Notes" htmlFor="food-notes">
          <Textarea
            id="food-notes"
            name="notes"
            value={values.notes}
            onChange={(e) => onChange('notes', e.target.value)}
            placeholder="How did you feel? Any reactions?"
            rows={3}
          />
        </FormGroup>
      </FormRow>
    </div>
  );
}
