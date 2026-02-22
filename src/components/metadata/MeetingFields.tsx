'use client';

import { FormGroup, FormRow, DateInput, TimeInput, TextInput, Textarea } from '@/components/form';
import type { MeetingMetadata } from '@/lib/taxonomies';

export interface MeetingFieldsProps {
  values: MeetingMetadata;
  onChange: (field: keyof MeetingMetadata, value: unknown) => void;
}

export function MeetingFields({ values, onChange }: MeetingFieldsProps) {
  return (
    <div className="metadata-fields meeting-fields">
      <FormRow>
        <FormGroup label="Meeting Topic" htmlFor="meeting-topic">
          <TextInput
            id="meeting-topic"
            name="topic"
            value={values.topic}
            onChange={(e) => onChange('topic', e.target.value)}
            placeholder="What is this meeting about?"
          />
        </FormGroup>
      </FormRow>
      <FormRow>
        <FormGroup label="Attendees" htmlFor="meeting-attendees">
          <TextInput
            id="meeting-attendees"
            name="attendees"
            value={values.attendees}
            onChange={(e) => onChange('attendees', e.target.value)}
            placeholder="Comma-separated names"
          />
        </FormGroup>
      </FormRow>
      <FormRow>
        <FormGroup label="Start Date" htmlFor="meeting-start-date">
          <DateInput
            id="meeting-start-date"
            name="startDate"
            value={values.startDate || ''}
            onChange={(e) => onChange('startDate', e.target.value || null)}
          />
        </FormGroup>
        <FormGroup label="Start Time" htmlFor="meeting-start-time">
          <TimeInput
            id="meeting-start-time"
            name="startTime"
            value={values.startTime}
            onChange={(e) => onChange('startTime', e.target.value)}
          />
        </FormGroup>
      </FormRow>
      <FormRow>
        <FormGroup label="End Date" htmlFor="meeting-end-date">
          <DateInput
            id="meeting-end-date"
            name="endDate"
            value={values.endDate || ''}
            onChange={(e) => onChange('endDate', e.target.value || null)}
          />
        </FormGroup>
        <FormGroup label="End Time" htmlFor="meeting-end-time">
          <TimeInput
            id="meeting-end-time"
            name="endTime"
            value={values.endTime}
            onChange={(e) => onChange('endTime', e.target.value)}
          />
        </FormGroup>
      </FormRow>
      <FormRow>
        <FormGroup label="Location" htmlFor="meeting-location">
          <TextInput
            id="meeting-location"
            name="location"
            value={values.location}
            onChange={(e) => onChange('location', e.target.value)}
            placeholder="Meeting location or video link"
          />
        </FormGroup>
      </FormRow>
      <FormRow>
        <FormGroup label="Notes" htmlFor="meeting-notes">
          <Textarea
            id="meeting-notes"
            name="notes"
            value={values.notes}
            onChange={(e) => onChange('notes', e.target.value)}
            placeholder="Meeting agenda or notes..."
            rows={3}
          />
        </FormGroup>
      </FormRow>
    </div>
  );
}
