import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MetadataFieldSection } from '../MetadataFieldSection';

describe('MetadataFieldSection', () => {
  it('renders children when taxonomy matches field type', () => {
    render(
      <MetadataFieldSection
        fieldType="task"
        selectedTaxonomyName="Task"
        title="Task Settings"
      >
        <div data-testid="task-content">Task content</div>
      </MetadataFieldSection>
    );

    expect(screen.getByTestId('task-content')).toBeInTheDocument();
  });

  it('renders children when taxonomy matches case-insensitively', () => {
    render(
      <MetadataFieldSection
        fieldType="task"
        selectedTaxonomyName="TASK"
        title="Task Settings"
      >
        <div data-testid="task-content">Task content</div>
      </MetadataFieldSection>
    );

    expect(screen.getByTestId('task-content')).toBeInTheDocument();
  });

  it('does not render when taxonomy does not match', () => {
    render(
      <MetadataFieldSection
        fieldType="task"
        selectedTaxonomyName="Goal"
        title="Task Settings"
      >
        <div data-testid="task-content">Task content</div>
      </MetadataFieldSection>
    );

    expect(screen.queryByTestId('task-content')).not.toBeInTheDocument();
  });

  it('does not render when no taxonomy is selected', () => {
    render(
      <MetadataFieldSection
        fieldType="task"
        selectedTaxonomyName={null}
        title="Task Settings"
      >
        <div data-testid="task-content">Task content</div>
      </MetadataFieldSection>
    );

    expect(screen.queryByTestId('task-content')).not.toBeInTheDocument();
  });

  it('renders children when taxonomy matches for goal type', () => {
    render(
      <MetadataFieldSection
        fieldType="goal"
        selectedTaxonomyName="Goal"
        title="Goal Settings"
      >
        <div>Content</div>
      </MetadataFieldSection>
    );

    // Note: title prop is currently not rendered by the component
    // Component only renders children when taxonomy matches fieldType
    expect(screen.getByText('Content')).toBeInTheDocument();
  });

  it('renders for event type', () => {
    render(
      <MetadataFieldSection
        fieldType="event"
        selectedTaxonomyName="Event"
        title="Event Details"
      >
        <div data-testid="event-content">Event content</div>
      </MetadataFieldSection>
    );

    expect(screen.getByTestId('event-content')).toBeInTheDocument();
  });

  it('renders for meeting type', () => {
    render(
      <MetadataFieldSection
        fieldType="meeting"
        selectedTaxonomyName="Meeting"
        title="Meeting Details"
      >
        <div data-testid="meeting-content">Meeting content</div>
      </MetadataFieldSection>
    );

    expect(screen.getByTestId('meeting-content')).toBeInTheDocument();
  });

  it('renders for symptom type', () => {
    render(
      <MetadataFieldSection
        fieldType="symptom"
        selectedTaxonomyName="Symptom"
        title="Symptom Details"
      >
        <div data-testid="symptom-content">Symptom content</div>
      </MetadataFieldSection>
    );

    expect(screen.getByTestId('symptom-content')).toBeInTheDocument();
  });

  it('renders for food type', () => {
    render(
      <MetadataFieldSection
        fieldType="food"
        selectedTaxonomyName="Food"
        title="Food Details"
      >
        <div data-testid="food-content">Food content</div>
      </MetadataFieldSection>
    );

    expect(screen.getByTestId('food-content')).toBeInTheDocument();
  });

  it('renders for medication type', () => {
    render(
      <MetadataFieldSection
        fieldType="medication"
        selectedTaxonomyName="Medication"
        title="Medication Details"
      >
        <div data-testid="medication-content">Medication content</div>
      </MetadataFieldSection>
    );

    expect(screen.getByTestId('medication-content')).toBeInTheDocument();
  });

  it('renders for exercise type', () => {
    render(
      <MetadataFieldSection
        fieldType="exercise"
        selectedTaxonomyName="Exercise"
        title="Exercise Details"
      >
        <div data-testid="exercise-content">Exercise content</div>
      </MetadataFieldSection>
    );

    expect(screen.getByTestId('exercise-content')).toBeInTheDocument();
  });

  it('renders for milestone type', () => {
    render(
      <MetadataFieldSection
        fieldType="milestone"
        selectedTaxonomyName="Milestone"
        title="Milestone Details"
      >
        <div data-testid="milestone-content">Milestone content</div>
      </MetadataFieldSection>
    );

    expect(screen.getByTestId('milestone-content')).toBeInTheDocument();
  });

  it('applies metadata-field-section class when rendered', () => {
    const { container } = render(
      <MetadataFieldSection
        fieldType="task"
        selectedTaxonomyName="Task"
        title="Task Settings"
      >
        <div>Content</div>
      </MetadataFieldSection>
    );

    expect(container.querySelector('.metadata-field-section')).toBeInTheDocument();
  });
});
