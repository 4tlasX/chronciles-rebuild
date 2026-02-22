import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { MilestoneFields } from '../MilestoneFields';
import { defaultMilestoneMetadata } from '@/lib/taxonomies';

describe('MilestoneFields', () => {
  const mockOnChange = vi.fn();

  beforeEach(() => {
    mockOnChange.mockClear();
  });

  it('renders completed checkbox', () => {
    render(<MilestoneFields values={defaultMilestoneMetadata} onChange={mockOnChange} />);

    expect(screen.getByLabelText('Completed')).toBeInTheDocument();
  });

  it('renders with default unchecked state', () => {
    render(<MilestoneFields values={defaultMilestoneMetadata} onChange={mockOnChange} />);

    expect(screen.getByLabelText('Completed')).not.toBeChecked();
  });

  it('renders with checked state when isCompleted is true', () => {
    render(
      <MilestoneFields
        values={{ ...defaultMilestoneMetadata, isCompleted: true, completedAt: '2025-01-15T10:00:00Z' }}
        onChange={mockOnChange}
      />
    );

    expect(screen.getByLabelText('Completed')).toBeChecked();
  });

  it('calls onChange with isCompleted true when checkbox is checked', () => {
    render(<MilestoneFields values={defaultMilestoneMetadata} onChange={mockOnChange} />);

    fireEvent.click(screen.getByLabelText('Completed'));

    expect(mockOnChange).toHaveBeenCalledWith('isCompleted', true);
  });

  it('calls onChange with completedAt when checkbox is checked', () => {
    render(<MilestoneFields values={defaultMilestoneMetadata} onChange={mockOnChange} />);

    fireEvent.click(screen.getByLabelText('Completed'));

    // Should set completedAt to current timestamp
    expect(mockOnChange).toHaveBeenCalledWith('completedAt', expect.any(String));
  });

  it('calls onChange with isCompleted false when checkbox is unchecked', () => {
    render(
      <MilestoneFields
        values={{ ...defaultMilestoneMetadata, isCompleted: true, completedAt: '2025-01-15T10:00:00Z' }}
        onChange={mockOnChange}
      />
    );

    fireEvent.click(screen.getByLabelText('Completed'));

    expect(mockOnChange).toHaveBeenCalledWith('isCompleted', false);
  });

  it('calls onChange with completedAt null when checkbox is unchecked', () => {
    render(
      <MilestoneFields
        values={{ ...defaultMilestoneMetadata, isCompleted: true, completedAt: '2025-01-15T10:00:00Z' }}
        onChange={mockOnChange}
      />
    );

    fireEvent.click(screen.getByLabelText('Completed'));

    expect(mockOnChange).toHaveBeenCalledWith('completedAt', null);
  });

  it('displays completed date when milestone is completed', () => {
    const completedAt = '2025-01-15T10:00:00Z';
    render(
      <MilestoneFields
        values={{ ...defaultMilestoneMetadata, isCompleted: true, completedAt }}
        onChange={mockOnChange}
      />
    );

    expect(screen.getByText(/completed on/i)).toBeInTheDocument();
  });

  it('does not display completed date when milestone is not completed', () => {
    render(<MilestoneFields values={defaultMilestoneMetadata} onChange={mockOnChange} />);

    expect(screen.queryByText(/completed on/i)).not.toBeInTheDocument();
  });

  it('applies milestone-fields class', () => {
    const { container } = render(
      <MilestoneFields values={defaultMilestoneMetadata} onChange={mockOnChange} />
    );

    expect(container.querySelector('.milestone-fields')).toBeInTheDocument();
  });

  it('applies metadata-fields class', () => {
    const { container } = render(
      <MilestoneFields values={defaultMilestoneMetadata} onChange={mockOnChange} />
    );

    expect(container.querySelector('.metadata-fields')).toBeInTheDocument();
  });
});
