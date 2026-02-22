import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { MedicationFields } from '../MedicationFields';
import { defaultMedicationMetadata } from '@/lib/taxonomies';

describe('MedicationFields', () => {
  const mockOnChange = vi.fn();

  beforeEach(() => {
    mockOnChange.mockClear();
  });

  it('renders dosage input', () => {
    render(<MedicationFields values={defaultMedicationMetadata} onChange={mockOnChange} />);

    expect(screen.getByLabelText(/dosage/i)).toBeInTheDocument();
  });

  it('renders frequency select', () => {
    render(<MedicationFields values={defaultMedicationMetadata} onChange={mockOnChange} />);

    expect(screen.getByLabelText(/frequency/i)).toBeInTheDocument();
  });

  it('renders schedule times section', () => {
    render(<MedicationFields values={defaultMedicationMetadata} onChange={mockOnChange} />);

    // Schedule Times is a group label, not directly associated with one input
    expect(screen.getByText(/schedule times/i)).toBeInTheDocument();
  });

  it('renders active checkbox', () => {
    render(<MedicationFields values={defaultMedicationMetadata} onChange={mockOnChange} />);

    expect(screen.getByLabelText(/currently taking this medication/i)).toBeInTheDocument();
  });

  it('renders notes textarea', () => {
    render(<MedicationFields values={defaultMedicationMetadata} onChange={mockOnChange} />);

    expect(screen.getByLabelText(/notes/i)).toBeInTheDocument();
  });

  it('renders with default frequency', () => {
    render(<MedicationFields values={defaultMedicationMetadata} onChange={mockOnChange} />);

    const frequencySelect = screen.getByLabelText(/frequency/i) as HTMLSelectElement;
    expect(frequencySelect.value).toBe('once_daily');
  });

  it('renders with default active status', () => {
    render(<MedicationFields values={defaultMedicationMetadata} onChange={mockOnChange} />);

    expect(screen.getByLabelText(/currently taking this medication/i)).toBeChecked();
  });

  it('calls onChange when dosage is changed', () => {
    render(<MedicationFields values={defaultMedicationMetadata} onChange={mockOnChange} />);

    fireEvent.change(screen.getByLabelText(/dosage/i), {
      target: { value: '10mg' },
    });

    expect(mockOnChange).toHaveBeenCalledWith('dosage', '10mg');
  });

  it('calls onChange when frequency is changed', () => {
    render(<MedicationFields values={defaultMedicationMetadata} onChange={mockOnChange} />);

    fireEvent.change(screen.getByLabelText(/frequency/i), {
      target: { value: 'twice_daily' },
    });

    expect(mockOnChange).toHaveBeenCalledWith('frequency', 'twice_daily');
  });

  it('calls onChange when active is toggled', () => {
    render(<MedicationFields values={defaultMedicationMetadata} onChange={mockOnChange} />);

    fireEvent.click(screen.getByLabelText(/currently taking this medication/i));

    expect(mockOnChange).toHaveBeenCalledWith('isActive', false);
  });

  it('has all frequency options', () => {
    render(<MedicationFields values={defaultMedicationMetadata} onChange={mockOnChange} />);

    const frequencySelect = screen.getByLabelText(/frequency/i);
    expect(frequencySelect.querySelector('option[value="once_daily"]')).toBeInTheDocument();
    expect(frequencySelect.querySelector('option[value="twice_daily"]')).toBeInTheDocument();
    expect(frequencySelect.querySelector('option[value="three_times_daily"]')).toBeInTheDocument();
    expect(frequencySelect.querySelector('option[value="as_needed"]')).toBeInTheDocument();
    expect(frequencySelect.querySelector('option[value="custom"]')).toBeInTheDocument();
  });

  it('renders Add Time button', () => {
    render(<MedicationFields values={defaultMedicationMetadata} onChange={mockOnChange} />);

    expect(screen.getByRole('button', { name: /add time/i })).toBeInTheDocument();
  });

  it('renders one time input by default', () => {
    render(<MedicationFields values={defaultMedicationMetadata} onChange={mockOnChange} />);

    const timeInputs = screen.getAllByDisplayValue('09:00');
    expect(timeInputs.length).toBe(1);
  });

  it('calls onChange with new time when Add Time is clicked', () => {
    render(<MedicationFields values={defaultMedicationMetadata} onChange={mockOnChange} />);

    fireEvent.click(screen.getByRole('button', { name: /add time/i }));

    expect(mockOnChange).toHaveBeenCalledWith('scheduleTimes', ['09:00', '12:00']);
  });

  it('renders Remove button when multiple times exist', () => {
    render(
      <MedicationFields
        values={{ ...defaultMedicationMetadata, scheduleTimes: ['08:00', '20:00'] }}
        onChange={mockOnChange}
      />
    );

    const removeButtons = screen.getAllByRole('button', { name: /remove/i });
    expect(removeButtons.length).toBe(2);
  });

  it('does not render Remove button when only one time exists', () => {
    render(<MedicationFields values={defaultMedicationMetadata} onChange={mockOnChange} />);

    expect(screen.queryByRole('button', { name: /remove/i })).not.toBeInTheDocument();
  });

  it('calls onChange when Remove button is clicked', () => {
    render(
      <MedicationFields
        values={{ ...defaultMedicationMetadata, scheduleTimes: ['08:00', '20:00'] }}
        onChange={mockOnChange}
      />
    );

    const removeButtons = screen.getAllByRole('button', { name: /remove/i });
    fireEvent.click(removeButtons[0]);

    expect(mockOnChange).toHaveBeenCalledWith('scheduleTimes', ['20:00']);
  });

  it('renders with provided dosage', () => {
    render(
      <MedicationFields
        values={{ ...defaultMedicationMetadata, dosage: '5mg' }}
        onChange={mockOnChange}
      />
    );

    expect(screen.getByLabelText(/dosage/i)).toHaveValue('5mg');
  });

  it('renders with provided frequency', () => {
    render(
      <MedicationFields
        values={{ ...defaultMedicationMetadata, frequency: 'as_needed' }}
        onChange={mockOnChange}
      />
    );

    const frequencySelect = screen.getByLabelText(/frequency/i) as HTMLSelectElement;
    expect(frequencySelect.value).toBe('as_needed');
  });

  it('renders with inactive status', () => {
    render(
      <MedicationFields
        values={{ ...defaultMedicationMetadata, isActive: false }}
        onChange={mockOnChange}
      />
    );

    expect(screen.getByLabelText(/currently taking this medication/i)).not.toBeChecked();
  });

  it('applies medication-fields class', () => {
    const { container } = render(
      <MedicationFields values={defaultMedicationMetadata} onChange={mockOnChange} />
    );

    expect(container.querySelector('.medication-fields')).toBeInTheDocument();
  });

  it('applies metadata-fields class', () => {
    const { container } = render(
      <MedicationFields values={defaultMedicationMetadata} onChange={mockOnChange} />
    );

    expect(container.querySelector('.metadata-fields')).toBeInTheDocument();
  });

  it('renders with provided notes', () => {
    render(
      <MedicationFields
        values={{ ...defaultMedicationMetadata, notes: 'Take with food' }}
        onChange={mockOnChange}
      />
    );

    expect(screen.getByLabelText(/notes/i)).toHaveValue('Take with food');
  });

  it('calls onChange when notes are changed', () => {
    render(<MedicationFields values={defaultMedicationMetadata} onChange={mockOnChange} />);

    fireEvent.change(screen.getByLabelText(/notes/i), {
      target: { value: 'May cause drowsiness' },
    });

    expect(mockOnChange).toHaveBeenCalledWith('notes', 'May cause drowsiness');
  });
});
