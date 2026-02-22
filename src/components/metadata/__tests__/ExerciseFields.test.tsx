import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { ExerciseFields } from '../ExerciseFields';
import { defaultExerciseMetadata } from '@/lib/taxonomies';

describe('ExerciseFields', () => {
  const mockOnChange = vi.fn();

  beforeEach(() => {
    mockOnChange.mockClear();
  });

  it('renders exercise type select', () => {
    render(<ExerciseFields values={defaultExerciseMetadata} onChange={mockOnChange} />);

    expect(screen.getByLabelText(/exercise type/i)).toBeInTheDocument();
  });

  it('renders duration input', () => {
    render(<ExerciseFields values={defaultExerciseMetadata} onChange={mockOnChange} />);

    expect(screen.getByLabelText(/duration \(minutes\)/i)).toBeInTheDocument();
  });

  it('renders intensity select', () => {
    render(<ExerciseFields values={defaultExerciseMetadata} onChange={mockOnChange} />);

    expect(screen.getByLabelText(/intensity/i)).toBeInTheDocument();
  });

  it('renders distance input', () => {
    render(<ExerciseFields values={defaultExerciseMetadata} onChange={mockOnChange} />);

    expect(screen.getByLabelText('Distance')).toBeInTheDocument();
  });

  it('renders distance unit select', () => {
    render(<ExerciseFields values={defaultExerciseMetadata} onChange={mockOnChange} />);

    expect(screen.getByLabelText('Unit')).toBeInTheDocument();
  });

  it('renders calories input', () => {
    render(<ExerciseFields values={defaultExerciseMetadata} onChange={mockOnChange} />);

    expect(screen.getByLabelText(/calories burned/i)).toBeInTheDocument();
  });

  it('renders notes textarea', () => {
    render(<ExerciseFields values={defaultExerciseMetadata} onChange={mockOnChange} />);

    expect(screen.getByLabelText(/notes/i)).toBeInTheDocument();
  });

  it('renders when performed input', () => {
    render(<ExerciseFields values={defaultExerciseMetadata} onChange={mockOnChange} />);

    expect(screen.getByLabelText(/when performed/i)).toBeInTheDocument();
  });

  it('renders with default exercise type', () => {
    render(<ExerciseFields values={defaultExerciseMetadata} onChange={mockOnChange} />);

    const typeSelect = screen.getByLabelText(/exercise type/i) as HTMLSelectElement;
    expect(typeSelect.value).toBe('cardio');
  });

  it('renders with default intensity', () => {
    render(<ExerciseFields values={defaultExerciseMetadata} onChange={mockOnChange} />);

    const intensitySelect = screen.getByLabelText(/intensity/i) as HTMLSelectElement;
    expect(intensitySelect.value).toBe('medium');
  });

  it('renders with default distance unit', () => {
    render(<ExerciseFields values={defaultExerciseMetadata} onChange={mockOnChange} />);

    const unitSelect = screen.getByLabelText('Unit') as HTMLSelectElement;
    expect(unitSelect.value).toBe('miles');
  });

  it('calls onChange when type is changed', () => {
    render(<ExerciseFields values={defaultExerciseMetadata} onChange={mockOnChange} />);

    fireEvent.change(screen.getByLabelText(/exercise type/i), {
      target: { value: 'running' },
    });

    expect(mockOnChange).toHaveBeenCalledWith('type', 'running');
  });

  it('calls onChange when duration is changed', () => {
    render(<ExerciseFields values={defaultExerciseMetadata} onChange={mockOnChange} />);

    fireEvent.change(screen.getByLabelText(/duration \(minutes\)/i), {
      target: { value: '45' },
    });

    expect(mockOnChange).toHaveBeenCalledWith('duration', 45);
  });

  it('calls onChange when intensity is changed', () => {
    render(<ExerciseFields values={defaultExerciseMetadata} onChange={mockOnChange} />);

    fireEvent.change(screen.getByLabelText(/intensity/i), {
      target: { value: 'high' },
    });

    expect(mockOnChange).toHaveBeenCalledWith('intensity', 'high');
  });

  it('calls onChange when distance is changed', () => {
    render(<ExerciseFields values={defaultExerciseMetadata} onChange={mockOnChange} />);

    fireEvent.change(screen.getByLabelText('Distance'), {
      target: { value: '5.5' },
    });

    expect(mockOnChange).toHaveBeenCalledWith('distance', 5.5);
  });

  it('calls onChange when distance unit is changed', () => {
    render(<ExerciseFields values={defaultExerciseMetadata} onChange={mockOnChange} />);

    fireEvent.change(screen.getByLabelText('Unit'), {
      target: { value: 'km' },
    });

    expect(mockOnChange).toHaveBeenCalledWith('distanceUnit', 'km');
  });

  it('calls onChange when calories are changed', () => {
    render(<ExerciseFields values={defaultExerciseMetadata} onChange={mockOnChange} />);

    fireEvent.change(screen.getByLabelText(/calories burned/i), {
      target: { value: '350' },
    });

    expect(mockOnChange).toHaveBeenCalledWith('calories', 350);
  });

  it('has all exercise type options', () => {
    render(<ExerciseFields values={defaultExerciseMetadata} onChange={mockOnChange} />);

    const typeSelect = screen.getByLabelText(/exercise type/i);
    expect(typeSelect.querySelector('option[value="yoga"]')).toBeInTheDocument();
    expect(typeSelect.querySelector('option[value="cardio"]')).toBeInTheDocument();
    expect(typeSelect.querySelector('option[value="strength"]')).toBeInTheDocument();
    expect(typeSelect.querySelector('option[value="swimming"]')).toBeInTheDocument();
    expect(typeSelect.querySelector('option[value="running"]')).toBeInTheDocument();
    expect(typeSelect.querySelector('option[value="cycling"]')).toBeInTheDocument();
    expect(typeSelect.querySelector('option[value="walking"]')).toBeInTheDocument();
    expect(typeSelect.querySelector('option[value="hiking"]')).toBeInTheDocument();
    expect(typeSelect.querySelector('option[value="other"]')).toBeInTheDocument();
  });

  it('has all intensity options', () => {
    render(<ExerciseFields values={defaultExerciseMetadata} onChange={mockOnChange} />);

    const intensitySelect = screen.getByLabelText(/intensity/i);
    expect(intensitySelect.querySelector('option[value="low"]')).toBeInTheDocument();
    expect(intensitySelect.querySelector('option[value="medium"]')).toBeInTheDocument();
    expect(intensitySelect.querySelector('option[value="high"]')).toBeInTheDocument();
  });

  it('has all distance unit options', () => {
    render(<ExerciseFields values={defaultExerciseMetadata} onChange={mockOnChange} />);

    const unitSelect = screen.getByLabelText('Unit');
    expect(unitSelect.querySelector('option[value="miles"]')).toBeInTheDocument();
    expect(unitSelect.querySelector('option[value="km"]')).toBeInTheDocument();
  });

  it('shows specify type input when type is "other"', () => {
    render(
      <ExerciseFields
        values={{ ...defaultExerciseMetadata, type: 'other' }}
        onChange={mockOnChange}
      />
    );

    expect(screen.getByLabelText(/specify type/i)).toBeInTheDocument();
  });

  it('does not show specify type input when type is not "other"', () => {
    render(<ExerciseFields values={defaultExerciseMetadata} onChange={mockOnChange} />);

    expect(screen.queryByLabelText(/specify type/i)).not.toBeInTheDocument();
  });

  it('calls onChange when specify type is changed', () => {
    render(
      <ExerciseFields
        values={{ ...defaultExerciseMetadata, type: 'other' }}
        onChange={mockOnChange}
      />
    );

    fireEvent.change(screen.getByLabelText(/specify type/i), {
      target: { value: 'Rock climbing' },
    });

    expect(mockOnChange).toHaveBeenCalledWith('otherType', 'Rock climbing');
  });

  it('renders with provided values', () => {
    render(
      <ExerciseFields
        values={{
          ...defaultExerciseMetadata,
          type: 'running',
          duration: 60,
          intensity: 'high',
          distance: 10,
          distanceUnit: 'km',
          calories: 600,
        }}
        onChange={mockOnChange}
      />
    );

    const typeSelect = screen.getByLabelText(/exercise type/i) as HTMLSelectElement;
    expect(typeSelect.value).toBe('running');
    expect(screen.getByLabelText(/duration \(minutes\)/i)).toHaveValue(60);
    const intensitySelect = screen.getByLabelText(/intensity/i) as HTMLSelectElement;
    expect(intensitySelect.value).toBe('high');
    expect(screen.getByLabelText('Distance')).toHaveValue(10);
    const unitSelect = screen.getByLabelText('Unit') as HTMLSelectElement;
    expect(unitSelect.value).toBe('km');
    expect(screen.getByLabelText(/calories burned/i)).toHaveValue(600);
  });

  it('applies exercise-fields class', () => {
    const { container } = render(
      <ExerciseFields values={defaultExerciseMetadata} onChange={mockOnChange} />
    );

    expect(container.querySelector('.exercise-fields')).toBeInTheDocument();
  });

  it('applies metadata-fields class', () => {
    const { container } = render(
      <ExerciseFields values={defaultExerciseMetadata} onChange={mockOnChange} />
    );

    expect(container.querySelector('.metadata-fields')).toBeInTheDocument();
  });
});
