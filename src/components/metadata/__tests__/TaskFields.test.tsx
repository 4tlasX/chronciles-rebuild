import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { TaskFields } from '../TaskFields';
import { defaultTaskMetadata } from '@/lib/taxonomies';

describe('TaskFields', () => {
  const mockOnChange = vi.fn();

  beforeEach(() => {
    mockOnChange.mockClear();
  });

  it('renders all task checkboxes', () => {
    render(<TaskFields values={defaultTaskMetadata} onChange={mockOnChange} />);

    expect(screen.getByLabelText('Completed')).toBeInTheDocument();
    expect(screen.getByLabelText('In Progress')).toBeInTheDocument();
    expect(screen.getByLabelText('Auto-migrate if incomplete')).toBeInTheDocument();
  });

  it('renders with default unchecked values', () => {
    render(<TaskFields values={defaultTaskMetadata} onChange={mockOnChange} />);

    expect(screen.getByLabelText('Completed')).not.toBeChecked();
    expect(screen.getByLabelText('In Progress')).not.toBeChecked();
    expect(screen.getByLabelText('Auto-migrate if incomplete')).not.toBeChecked();
  });

  it('renders with completed checked when true', () => {
    render(
      <TaskFields
        values={{ ...defaultTaskMetadata, isCompleted: true }}
        onChange={mockOnChange}
      />
    );

    expect(screen.getByLabelText('Completed')).toBeChecked();
  });

  it('renders with in progress checked when true', () => {
    render(
      <TaskFields
        values={{ ...defaultTaskMetadata, isInProgress: true }}
        onChange={mockOnChange}
      />
    );

    expect(screen.getByLabelText('In Progress')).toBeChecked();
  });

  it('renders with auto-migrate checked when true', () => {
    render(
      <TaskFields
        values={{ ...defaultTaskMetadata, isAutoMigrating: true }}
        onChange={mockOnChange}
      />
    );

    expect(screen.getByLabelText('Auto-migrate if incomplete')).toBeChecked();
  });

  it('calls onChange when completed is toggled', () => {
    render(<TaskFields values={defaultTaskMetadata} onChange={mockOnChange} />);

    fireEvent.click(screen.getByLabelText('Completed'));

    expect(mockOnChange).toHaveBeenCalledWith('isCompleted', true);
  });

  it('calls onChange when in progress is toggled', () => {
    render(<TaskFields values={defaultTaskMetadata} onChange={mockOnChange} />);

    fireEvent.click(screen.getByLabelText('In Progress'));

    expect(mockOnChange).toHaveBeenCalledWith('isInProgress', true);
  });

  it('calls onChange when auto-migrate is toggled', () => {
    render(<TaskFields values={defaultTaskMetadata} onChange={mockOnChange} />);

    fireEvent.click(screen.getByLabelText('Auto-migrate if incomplete'));

    expect(mockOnChange).toHaveBeenCalledWith('isAutoMigrating', true);
  });

  it('disables auto-migrate when completed is checked and sets it to false', () => {
    render(<TaskFields values={defaultTaskMetadata} onChange={mockOnChange} />);

    fireEvent.click(screen.getByLabelText('Completed'));

    // Should call onChange for both isCompleted and isAutoMigrating
    expect(mockOnChange).toHaveBeenCalledWith('isCompleted', true);
    expect(mockOnChange).toHaveBeenCalledWith('isAutoMigrating', false);
  });

  it('disables auto-migrate checkbox when task is completed', () => {
    render(
      <TaskFields
        values={{ ...defaultTaskMetadata, isCompleted: true }}
        onChange={mockOnChange}
      />
    );

    expect(screen.getByLabelText('Auto-migrate if incomplete')).toBeDisabled();
  });

  it('enables auto-migrate checkbox when task is not completed', () => {
    render(
      <TaskFields
        values={{ ...defaultTaskMetadata, isCompleted: false }}
        onChange={mockOnChange}
      />
    );

    expect(screen.getByLabelText('Auto-migrate if incomplete')).not.toBeDisabled();
  });

  it('applies task-fields class', () => {
    const { container } = render(
      <TaskFields values={defaultTaskMetadata} onChange={mockOnChange} />
    );

    expect(container.querySelector('.task-fields')).toBeInTheDocument();
  });

  it('applies metadata-fields class', () => {
    const { container } = render(
      <TaskFields values={defaultTaskMetadata} onChange={mockOnChange} />
    );

    expect(container.querySelector('.metadata-fields')).toBeInTheDocument();
  });
});
