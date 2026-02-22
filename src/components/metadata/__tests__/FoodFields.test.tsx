import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { FoodFields } from '../FoodFields';
import { defaultFoodMetadata } from '@/lib/taxonomies';

describe('FoodFields', () => {
  const mockOnChange = vi.fn();

  beforeEach(() => {
    mockOnChange.mockClear();
  });

  it('renders meal type select', () => {
    render(<FoodFields values={defaultFoodMetadata} onChange={mockOnChange} />);

    expect(screen.getByLabelText(/meal type/i)).toBeInTheDocument();
  });

  it('renders consumed at input', () => {
    render(<FoodFields values={defaultFoodMetadata} onChange={mockOnChange} />);

    expect(screen.getByLabelText(/when consumed/i)).toBeInTheDocument();
  });

  it('renders ingredients input', () => {
    render(<FoodFields values={defaultFoodMetadata} onChange={mockOnChange} />);

    expect(screen.getByLabelText(/ingredients/i)).toBeInTheDocument();
  });

  it('renders calories input', () => {
    render(<FoodFields values={defaultFoodMetadata} onChange={mockOnChange} />);

    expect(screen.getByLabelText(/calories/i)).toBeInTheDocument();
  });

  it('renders notes textarea', () => {
    render(<FoodFields values={defaultFoodMetadata} onChange={mockOnChange} />);

    expect(screen.getByLabelText(/notes/i)).toBeInTheDocument();
  });

  it('renders with default meal type', () => {
    render(<FoodFields values={defaultFoodMetadata} onChange={mockOnChange} />);

    const mealSelect = screen.getByLabelText(/meal type/i) as HTMLSelectElement;
    expect(mealSelect.value).toBe('lunch');
  });

  it('calls onChange when meal type is changed', () => {
    render(<FoodFields values={defaultFoodMetadata} onChange={mockOnChange} />);

    fireEvent.change(screen.getByLabelText(/meal type/i), {
      target: { value: 'dinner' },
    });

    expect(mockOnChange).toHaveBeenCalledWith('mealType', 'dinner');
  });

  it('calls onChange when ingredients are changed', () => {
    render(<FoodFields values={defaultFoodMetadata} onChange={mockOnChange} />);

    fireEvent.change(screen.getByLabelText(/ingredients/i), {
      target: { value: 'chicken, rice' },
    });

    expect(mockOnChange).toHaveBeenCalledWith('ingredients', 'chicken, rice');
  });

  it('calls onChange when calories are changed', () => {
    render(<FoodFields values={defaultFoodMetadata} onChange={mockOnChange} />);

    fireEvent.change(screen.getByLabelText(/calories/i), {
      target: { value: '500' },
    });

    expect(mockOnChange).toHaveBeenCalledWith('calories', 500);
  });

  it('calls onChange when notes are changed', () => {
    render(<FoodFields values={defaultFoodMetadata} onChange={mockOnChange} />);

    fireEvent.change(screen.getByLabelText(/notes/i), {
      target: { value: 'Homemade' },
    });

    expect(mockOnChange).toHaveBeenCalledWith('notes', 'Homemade');
  });

  it('has all meal type options', () => {
    render(<FoodFields values={defaultFoodMetadata} onChange={mockOnChange} />);

    const mealSelect = screen.getByLabelText(/meal type/i);
    expect(mealSelect.querySelector('option[value="breakfast"]')).toBeInTheDocument();
    expect(mealSelect.querySelector('option[value="lunch"]')).toBeInTheDocument();
    expect(mealSelect.querySelector('option[value="dinner"]')).toBeInTheDocument();
    expect(mealSelect.querySelector('option[value="snack"]')).toBeInTheDocument();
  });

  it('renders with provided meal type', () => {
    render(
      <FoodFields
        values={{ ...defaultFoodMetadata, mealType: 'breakfast' }}
        onChange={mockOnChange}
      />
    );

    const mealSelect = screen.getByLabelText(/meal type/i) as HTMLSelectElement;
    expect(mealSelect.value).toBe('breakfast');
  });

  it('renders with provided calories', () => {
    render(
      <FoodFields
        values={{ ...defaultFoodMetadata, calories: 750 }}
        onChange={mockOnChange}
      />
    );

    expect(screen.getByLabelText(/calories/i)).toHaveValue(750);
  });

  it('renders with provided ingredients', () => {
    render(
      <FoodFields
        values={{ ...defaultFoodMetadata, ingredients: 'eggs, toast' }}
        onChange={mockOnChange}
      />
    );

    expect(screen.getByLabelText(/ingredients/i)).toHaveValue('eggs, toast');
  });

  it('applies food-fields class', () => {
    const { container } = render(
      <FoodFields values={defaultFoodMetadata} onChange={mockOnChange} />
    );

    expect(container.querySelector('.food-fields')).toBeInTheDocument();
  });

  it('applies metadata-fields class', () => {
    const { container } = render(
      <FoodFields values={defaultFoodMetadata} onChange={mockOnChange} />
    );

    expect(container.querySelector('.metadata-fields')).toBeInTheDocument();
  });
});
