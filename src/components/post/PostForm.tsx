'use client';

import { useState, useCallback, useRef, useEffect } from 'react';
import { FormGroup, FormRow, Textarea, Button, KeyValueList } from '@/components/form';
import type { KeyValuePairData } from '@/components/form';
import { TaxonomySelector } from '@/components/topic';
import {
  MetadataFieldSection,
  TaskFields,
  GoalFields,
  MilestoneFields,
  EventFields,
  MeetingFields,
  SymptomFields,
  FoodFields,
  MedicationFields,
  ExerciseFields,
} from '@/components/metadata';
import {
  hasSpecializedFields,
  getDefaultMetadata,
  isSpecializedMetadataKey,
  type TaskMetadata,
  type GoalMetadata,
  type MilestoneMetadata,
  type EventMetadata,
  type MeetingMetadata,
  type SymptomMetadata,
  type FoodMetadata,
  type MedicationMetadata,
  type ExerciseMetadata,
} from '@/lib/taxonomies';
import type { Post, Taxonomy } from '@/lib/db';

export interface PostFormProps {
  post?: Post;
  taxonomies?: Taxonomy[];
  initialTaxonomyId?: number | null;
  onSubmit: (formData: FormData) => void;
  onCancel?: () => void;
  submitLabel?: string;
  isEditing?: boolean;
  enterToSubmit?: boolean;
  escapeToSubmit?: boolean;
}

// Extract custom (non-specialized) metadata as key-value pairs
function extractCustomMetadata(
  metadata: Record<string, unknown>
): KeyValuePairData[] {
  return Object.entries(metadata)
    .filter(([key]) => !key.startsWith('_') && !isSpecializedMetadataKey(key))
    .map(([key, value]) => ({
      key,
      value: typeof value === 'string' ? value : JSON.stringify(value),
    }));
}

function extractMetadataForTaxonomy(
  metadata: Record<string, unknown>,
  taxonomyName: string
): Record<string, unknown> {
  const defaults = getDefaultMetadata(taxonomyName);
  const result: Record<string, unknown> = { ...defaults };

  // Overlay any existing values from metadata
  for (const key of Object.keys(defaults)) {
    if (key in metadata) {
      result[key] = metadata[key];
    }
  }

  return result;
}

export function PostForm({
  post,
  taxonomies = [],
  initialTaxonomyId = null,
  onSubmit,
  onCancel,
  submitLabel = 'Save',
  enterToSubmit = false,
  escapeToSubmit = false,
}: PostFormProps) {
  const formRef = useRef<HTMLFormElement>(null);
  // Selected taxonomy state
  const [selectedTaxonomy, setSelectedTaxonomy] = useState<Taxonomy | null>(() => {
    if (initialTaxonomyId) {
      return taxonomies.find((t) => t.id === initialTaxonomyId) || null;
    }
    // Check if post has a taxonomy stored in metadata
    const storedId = post?.metadata?._taxonomyId as number | undefined;
    if (storedId) {
      return taxonomies.find((t) => t.id === storedId) || null;
    }
    return null;
  });

  // Metadata state for specialized fields
  const [metadata, setMetadata] = useState<Record<string, unknown>>(() => {
    if (post?.metadata && selectedTaxonomy) {
      return extractMetadataForTaxonomy(post.metadata, selectedTaxonomy.name);
    }
    if (selectedTaxonomy) {
      return getDefaultMetadata(selectedTaxonomy.name);
    }
    return {};
  });

  // Check if selected taxonomy has specialized fields
  const showSpecializedFields = selectedTaxonomy && hasSpecializedFields(selectedTaxonomy.name);

  // Custom metadata pairs (non-specialized fields only)
  const customMetadataPairs = post ? extractCustomMetadata(post.metadata) : [];

  // Handle taxonomy change
  const handleTaxonomyChange = useCallback((taxonomy: Taxonomy | null) => {
    setSelectedTaxonomy(taxonomy);
    if (taxonomy) {
      setMetadata(getDefaultMetadata(taxonomy.name));
    } else {
      setMetadata({});
    }
  }, []);

  // Handle metadata field change
  const handleMetadataChange = useCallback((field: string, value: unknown) => {
    setMetadata((prev) => ({ ...prev, [field]: value }));
  }, []);

  // Handle form submission
  const handleSubmit = (formData: FormData) => {
    // Add taxonomy info to form data
    if (selectedTaxonomy) {
      formData.set('taxonomyId', String(selectedTaxonomy.id));
      formData.set('taxonomyName', selectedTaxonomy.name);
    }

    // Add specialized metadata to form data
    if (showSpecializedFields) {
      formData.set('specializedMetadata', JSON.stringify(metadata));
    }

    onSubmit(formData);
  };

  const taxonomyName = selectedTaxonomy?.name || null;

  const handleEnterSubmit = () => {
    if (formRef.current) {
      formRef.current.requestSubmit();
    }
  };

  // Listen for Escape key at document level to save and close
  useEffect(() => {
    if (!escapeToSubmit) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && formRef.current) {
        e.preventDefault();
        formRef.current.requestSubmit();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [escapeToSubmit]);

  return (
    <form ref={formRef} action={handleSubmit} className="post-form">
      {post && <input type="hidden" name="id" value={post.id} />}

      <FormRow>
        <FormGroup label="Topic" htmlFor="post-taxonomy">
          <TaxonomySelector
            taxonomies={taxonomies}
            selectedId={selectedTaxonomy?.id || null}
            onChange={handleTaxonomyChange}
            placeholder="Select a topic (optional)"
          />
        </FormGroup>
      </FormRow>

      <FormRow>
        <FormGroup label="Content" htmlFor="post-content" required>
          <Textarea
            id="post-content"
            name="content"
            placeholder="Write your post content..."
            defaultValue={post?.content ?? ''}
            required
            onEnterSubmit={enterToSubmit ? handleEnterSubmit : undefined}
          />
        </FormGroup>
      </FormRow>

      {/* Specialized metadata fields based on taxonomy */}
      <MetadataFieldSection
        fieldType="task"
        selectedTaxonomyName={taxonomyName}
        title="Task Settings"
      >
        <TaskFields
          values={metadata as unknown as TaskMetadata}
          onChange={handleMetadataChange}
        />
      </MetadataFieldSection>

      <MetadataFieldSection
        fieldType="goal"
        selectedTaxonomyName={taxonomyName}
        title="Goal Settings"
      >
        <GoalFields
          values={metadata as unknown as GoalMetadata}
          onChange={handleMetadataChange}
        />
      </MetadataFieldSection>

      <MetadataFieldSection
        fieldType="milestone"
        selectedTaxonomyName={taxonomyName}
        title="Milestone Settings"
      >
        <MilestoneFields
          values={metadata as unknown as MilestoneMetadata}
          onChange={handleMetadataChange}
        />
      </MetadataFieldSection>

      <MetadataFieldSection
        fieldType="event"
        selectedTaxonomyName={taxonomyName}
        title="Event Details"
      >
        <EventFields
          values={metadata as unknown as EventMetadata}
          onChange={handleMetadataChange}
        />
      </MetadataFieldSection>

      <MetadataFieldSection
        fieldType="meeting"
        selectedTaxonomyName={taxonomyName}
        title="Meeting Details"
      >
        <MeetingFields
          values={metadata as unknown as MeetingMetadata}
          onChange={handleMetadataChange}
        />
      </MetadataFieldSection>

      <MetadataFieldSection
        fieldType="symptom"
        selectedTaxonomyName={taxonomyName}
        title="Symptom Details"
      >
        <SymptomFields
          values={metadata as unknown as SymptomMetadata}
          onChange={handleMetadataChange}
        />
      </MetadataFieldSection>

      <MetadataFieldSection
        fieldType="food"
        selectedTaxonomyName={taxonomyName}
        title="Food Details"
      >
        <FoodFields
          values={metadata as unknown as FoodMetadata}
          onChange={handleMetadataChange}
        />
      </MetadataFieldSection>

      <MetadataFieldSection
        fieldType="medication"
        selectedTaxonomyName={taxonomyName}
        title="Medication Details"
      >
        <MedicationFields
          values={metadata as unknown as MedicationMetadata}
          onChange={handleMetadataChange}
        />
      </MetadataFieldSection>

      <MetadataFieldSection
        fieldType="exercise"
        selectedTaxonomyName={taxonomyName}
        title="Exercise Details"
      >
        <ExerciseFields
          values={metadata as unknown as ExerciseMetadata}
          onChange={handleMetadataChange}
        />
      </MetadataFieldSection>

      {/* Custom metadata fields for taxonomies without specialized fields */}
      {!showSpecializedFields && (
        <FormRow>
          <FormGroup label="Custom Fields" htmlFor="post-metadata">
            <KeyValueList
              initialPairs={customMetadataPairs}
              name="metadata"
              keyPlaceholder="Field name"
              valuePlaceholder="Value"
              addButtonText="Add Field"
            />
          </FormGroup>
        </FormRow>
      )}

      <div className="form-actions">
        <Button type="submit" variant="primary">
          {submitLabel}
        </Button>
        {onCancel && (
          <Button type="button" variant="secondary" onClick={onCancel}>
            Cancel
          </Button>
        )}
      </div>
    </form>
  );
}
