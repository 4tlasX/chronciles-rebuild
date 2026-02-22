import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { GoalFields } from '../GoalFields';
import { defaultGoalMetadata } from '@/lib/taxonomies';

describe('GoalFields', () => {
  const mockOnChange = vi.fn();

  beforeEach(() => {
    mockOnChange.mockClear();
  });

  it('renders goal type select', () => {
    render(<GoalFields values={defaultGoalMetadata} onChange={mockOnChange} />);

    expect(screen.getByLabelText(/goal type/i)).toBeInTheDocument();
  });

  it('renders goal status select', () => {
    render(<GoalFields values={defaultGoalMetadata} onChange={mockOnChange} />);

    expect(screen.getByLabelText('Status')).toBeInTheDocument();
  });

  it('renders target date input', () => {
    render(<GoalFields values={defaultGoalMetadata} onChange={mockOnChange} />);

    expect(screen.getByLabelText(/target date/i)).toBeInTheDocument();
  });

  it('renders with default type value', () => {
    render(<GoalFields values={defaultGoalMetadata} onChange={mockOnChange} />);

    const typeSelect = screen.getByLabelText(/goal type/i) as HTMLSelectElement;
    expect(typeSelect.value).toBe('short_term');
  });

  it('renders with default status value', () => {
    render(<GoalFields values={defaultGoalMetadata} onChange={mockOnChange} />);

    const statusSelect = screen.getByLabelText('Status') as HTMLSelectElement;
    expect(statusSelect.value).toBe('active');
  });

  it('calls onChange when type is changed', () => {
    render(<GoalFields values={defaultGoalMetadata} onChange={mockOnChange} />);

    fireEvent.change(screen.getByLabelText(/goal type/i), {
      target: { value: 'long_term' },
    });

    expect(mockOnChange).toHaveBeenCalledWith('type', 'long_term');
  });

  it('calls onChange when status is changed', () => {
    render(<GoalFields values={defaultGoalMetadata} onChange={mockOnChange} />);

    fireEvent.change(screen.getByLabelText('Status'), {
      target: { value: 'completed' },
    });

    expect(mockOnChange).toHaveBeenCalledWith('status', 'completed');
  });

  it('calls onChange when target date is changed', () => {
    render(<GoalFields values={defaultGoalMetadata} onChange={mockOnChange} />);

    fireEvent.change(screen.getByLabelText(/target date/i), {
      target: { value: '2025-12-31' },
    });

    expect(mockOnChange).toHaveBeenCalledWith('targetDate', '2025-12-31');
  });

  it('renders with provided type value', () => {
    render(
      <GoalFields
        values={{ ...defaultGoalMetadata, type: 'long_term' }}
        onChange={mockOnChange}
      />
    );

    const typeSelect = screen.getByLabelText(/goal type/i) as HTMLSelectElement;
    expect(typeSelect.value).toBe('long_term');
  });

  it('renders with provided status value', () => {
    render(
      <GoalFields
        values={{ ...defaultGoalMetadata, status: 'archived' }}
        onChange={mockOnChange}
      />
    );

    const statusSelect = screen.getByLabelText('Status') as HTMLSelectElement;
    expect(statusSelect.value).toBe('archived');
  });

  it('renders with provided target date', () => {
    render(
      <GoalFields
        values={{ ...defaultGoalMetadata, targetDate: '2025-06-15' }}
        onChange={mockOnChange}
      />
    );

    expect(screen.getByLabelText(/target date/i)).toHaveValue('2025-06-15');
  });

  it('has type options for short_term and long_term', () => {
    render(<GoalFields values={defaultGoalMetadata} onChange={mockOnChange} />);

    const typeSelect = screen.getByLabelText(/goal type/i);
    expect(typeSelect.querySelector('option[value="short_term"]')).toBeInTheDocument();
    expect(typeSelect.querySelector('option[value="long_term"]')).toBeInTheDocument();
  });

  it('has status options for active, completed, and archived', () => {
    render(<GoalFields values={defaultGoalMetadata} onChange={mockOnChange} />);

    const statusSelect = screen.getByLabelText('Status');
    expect(statusSelect.querySelector('option[value="active"]')).toBeInTheDocument();
    expect(statusSelect.querySelector('option[value="completed"]')).toBeInTheDocument();
    expect(statusSelect.querySelector('option[value="archived"]')).toBeInTheDocument();
  });

  it('applies goal-fields class', () => {
    const { container } = render(
      <GoalFields values={defaultGoalMetadata} onChange={mockOnChange} />
    );

    expect(container.querySelector('.goal-fields')).toBeInTheDocument();
  });

  it('applies metadata-fields class', () => {
    const { container } = render(
      <GoalFields values={defaultGoalMetadata} onChange={mockOnChange} />
    );

    expect(container.querySelector('.metadata-fields')).toBeInTheDocument();
  });
});
