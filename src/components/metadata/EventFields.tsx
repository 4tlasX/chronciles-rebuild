'use client';

import { FormGroup, FormRow, DateInput, TimeInput, TextInput, Textarea } from '@/components/form';
import type { EventMetadata } from '@/lib/taxonomies';

export interface EventFieldsProps {
  values: EventMetadata;
  onChange: (field: keyof EventMetadata, value: unknown) => void;
}

export function EventFields({ values, onChange }: EventFieldsProps) {
  return (
    <div className="metadata-fields event-fields">
      <FormRow>
        <FormGroup label="Start Date" htmlFor="event-start-date">
          <DateInput
            id="event-start-date"
            name="startDate"
            value={values.startDate || ''}
            onChange={(e) => onChange('startDate', e.target.value || null)}
          />
        </FormGroup>
        <FormGroup label="Start Time" htmlFor="event-start-time">
          <TimeInput
            id="event-start-time"
            name="startTime"
            value={values.startTime}
            onChange={(e) => onChange('startTime', e.target.value)}
          />
        </FormGroup>
      </FormRow>
      <FormRow>
        <FormGroup label="End Date" htmlFor="event-end-date">
          <DateInput
            id="event-end-date"
            name="endDate"
            value={values.endDate || ''}
            onChange={(e) => onChange('endDate', e.target.value || null)}
          />
        </FormGroup>
        <FormGroup label="End Time" htmlFor="event-end-time">
          <TimeInput
            id="event-end-time"
            name="endTime"
            value={values.endTime}
            onChange={(e) => onChange('endTime', e.target.value)}
          />
        </FormGroup>
      </FormRow>
      <FormRow>
        <FormGroup label="Location" htmlFor="event-location">
          <TextInput
            id="event-location"
            name="location"
            value={values.location}
            onChange={(e) => onChange('location', e.target.value)}
            placeholder="Event location"
          />
        </FormGroup>
      </FormRow>
      <FormRow>
        <FormGroup label="Address" htmlFor="event-address">
          <TextInput
            id="event-address"
            name="address"
            value={values.address}
            onChange={(e) => onChange('address', e.target.value)}
            placeholder="Full address"
          />
        </FormGroup>
      </FormRow>
      <FormRow>
        <FormGroup label="Phone" htmlFor="event-phone">
          <TextInput
            id="event-phone"
            name="phone"
            value={values.phone}
            onChange={(e) => onChange('phone', e.target.value)}
            placeholder="Contact phone"
          />
        </FormGroup>
      </FormRow>
      <FormRow>
        <FormGroup label="Notes" htmlFor="event-notes">
          <Textarea
            id="event-notes"
            name="notes"
            value={values.notes}
            onChange={(e) => onChange('notes', e.target.value)}
            placeholder="Additional notes..."
            rows={3}
          />
        </FormGroup>
      </FormRow>
    </div>
  );
}
