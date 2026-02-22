import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { SymptomFields } from '../SymptomFields';
import { defaultSymptomMetadata } from '@/lib/taxonomies';

describe('SymptomFields', () => {
  const mockOnChange = vi.fn();

  beforeEach(() => {
    mockOnChange.mockClear();
  });

  it('renders severity slider', () => {
    render(<SymptomFields values={defaultSymptomMetadata} onChange={mockOnChange} />);

    // Label includes severity level like "Severity: Moderate"
    expect(screen.getByLabelText(/severity:/i)).toBeInTheDocument();
  });

  it('renders occurred at input', () => {
    render(<SymptomFields values={defaultSymptomMetadata} onChange={mockOnChange} />);

    expect(screen.getByLabelText(/when did it occur/i)).toBeInTheDocument();
  });

  it('renders duration input', () => {
    render(<SymptomFields values={defaultSymptomMetadata} onChange={mockOnChange} />);

    expect(screen.getByLabelText(/duration \(minutes\)/i)).toBeInTheDocument();
  });

  it('renders notes textarea', () => {
    render(<SymptomFields values={defaultSymptomMetadata} onChange={mockOnChange} />);

    expect(screen.getByLabelText(/notes/i)).toBeInTheDocument();
  });

  it('renders with default severity value', () => {
    render(<SymptomFields values={defaultSymptomMetadata} onChange={mockOnChange} />);

    const slider = screen.getByLabelText(/severity:/i) as HTMLInputElement;
    expect(slider.value).toBe('5');
  });

  it('displays severity label with description', () => {
    render(<SymptomFields values={defaultSymptomMetadata} onChange={mockOnChange} />);

    // Default severity 5 shows "Severity: Moderate"
    expect(screen.getByText(/severity: moderate/i)).toBeInTheDocument();
  });

  it('calls onChange when severity is changed', () => {
    render(<SymptomFields values={defaultSymptomMetadata} onChange={mockOnChange} />);

    fireEvent.change(screen.getByLabelText(/severity:/i), {
      target: { value: '8' },
    });

    expect(mockOnChange).toHaveBeenCalledWith('severity', 8);
  });

  it('calls onChange when duration is changed', () => {
    render(<SymptomFields values={defaultSymptomMetadata} onChange={mockOnChange} />);

    fireEvent.change(screen.getByLabelText(/duration \(minutes\)/i), {
      target: { value: '30' },
    });

    expect(mockOnChange).toHaveBeenCalledWith('duration', 30);
  });

  it('calls onChange when notes are changed', () => {
    render(<SymptomFields values={defaultSymptomMetadata} onChange={mockOnChange} />);

    fireEvent.change(screen.getByLabelText(/notes/i), {
      target: { value: 'Mild headache' },
    });

    expect(mockOnChange).toHaveBeenCalledWith('notes', 'Mild headache');
  });

  it('renders with provided severity value', () => {
    render(
      <SymptomFields
        values={{ ...defaultSymptomMetadata, severity: 9 }}
        onChange={mockOnChange}
      />
    );

    const slider = screen.getByLabelText(/severity:/i) as HTMLInputElement;
    expect(slider.value).toBe('9');
  });

  it('renders with provided duration value', () => {
    render(
      <SymptomFields
        values={{ ...defaultSymptomMetadata, duration: 45 }}
        onChange={mockOnChange}
      />
    );

    expect(screen.getByLabelText(/duration \(minutes\)/i)).toHaveValue(45);
  });

  it('renders with provided notes', () => {
    render(
      <SymptomFields
        values={{ ...defaultSymptomMetadata, notes: 'Test notes' }}
        onChange={mockOnChange}
      />
    );

    expect(screen.getByLabelText(/notes/i)).toHaveValue('Test notes');
  });

  it('severity slider has min of 1 and max of 10', () => {
    render(<SymptomFields values={defaultSymptomMetadata} onChange={mockOnChange} />);

    const slider = screen.getByLabelText(/severity:/i) as HTMLInputElement;
    expect(slider.min).toBe('1');
    expect(slider.max).toBe('10');
  });

  it('applies symptom-fields class', () => {
    const { container } = render(
      <SymptomFields values={defaultSymptomMetadata} onChange={mockOnChange} />
    );

    expect(container.querySelector('.symptom-fields')).toBeInTheDocument();
  });

  it('applies metadata-fields class', () => {
    const { container } = render(
      <SymptomFields values={defaultSymptomMetadata} onChange={mockOnChange} />
    );

    expect(container.querySelector('.metadata-fields')).toBeInTheDocument();
  });

  it('shows different severity labels for different values', () => {
    const { rerender } = render(
      <SymptomFields
        values={{ ...defaultSymptomMetadata, severity: 1 }}
        onChange={mockOnChange}
      />
    );
    expect(screen.getByText(/severity: minimal/i)).toBeInTheDocument();

    rerender(
      <SymptomFields
        values={{ ...defaultSymptomMetadata, severity: 10 }}
        onChange={mockOnChange}
      />
    );
    expect(screen.getByText(/severity: extreme/i)).toBeInTheDocument();
  });
});
