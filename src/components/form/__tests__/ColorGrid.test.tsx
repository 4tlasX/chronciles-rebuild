import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { ColorGrid } from '../ColorGrid';

const mockOptions = [
  { value: '#00b4d8', label: 'Cyan' },
  { value: '#06d6a0', label: 'Mint' },
  { value: '#8338ec', label: 'Purple' },
  { value: 'transparent', label: 'Transparent' },
];

describe('ColorGrid', () => {
  it('renders all color options', () => {
    const onChange = vi.fn();
    render(
      <ColorGrid options={mockOptions} value="#00b4d8" onChange={onChange} />
    );

    expect(screen.getByTitle('Cyan')).toBeInTheDocument();
    expect(screen.getByTitle('Mint')).toBeInTheDocument();
    expect(screen.getByTitle('Purple')).toBeInTheDocument();
    expect(screen.getByTitle('Transparent')).toBeInTheDocument();
  });

  it('marks the selected color with selected class', () => {
    const onChange = vi.fn();
    render(
      <ColorGrid options={mockOptions} value="#06d6a0" onChange={onChange} />
    );

    const mintButton = screen.getByTitle('Mint');
    const cyanButton = screen.getByTitle('Cyan');

    expect(mintButton).toHaveClass('color-grid-item-selected');
    expect(cyanButton).not.toHaveClass('color-grid-item-selected');
  });

  it('calls onChange with the color value when clicked', () => {
    const onChange = vi.fn();
    render(
      <ColorGrid options={mockOptions} value="#00b4d8" onChange={onChange} />
    );

    const purpleButton = screen.getByTitle('Purple');
    fireEvent.click(purpleButton);

    expect(onChange).toHaveBeenCalledTimes(1);
    expect(onChange).toHaveBeenCalledWith('#8338ec');
  });

  it('does not call onChange when disabled', () => {
    const onChange = vi.fn();
    render(
      <ColorGrid
        options={mockOptions}
        value="#00b4d8"
        onChange={onChange}
        disabled={true}
      />
    );

    const purpleButton = screen.getByTitle('Purple');
    fireEvent.click(purpleButton);

    expect(onChange).not.toHaveBeenCalled();
  });

  it('applies background color style to buttons', () => {
    const onChange = vi.fn();
    render(
      <ColorGrid options={mockOptions} value="#00b4d8" onChange={onChange} />
    );

    const cyanButton = screen.getByTitle('Cyan');
    expect(cyanButton).toHaveStyle({ backgroundColor: '#00b4d8' });
  });

  it('handles transparent color option specially', () => {
    const onChange = vi.fn();
    render(
      <ColorGrid options={mockOptions} value="#00b4d8" onChange={onChange} />
    );

    const transparentButton = screen.getByTitle('Transparent');
    // Transparent button should not have backgroundColor set
    expect(transparentButton).not.toHaveStyle({ backgroundColor: 'transparent' });
  });

  it('updates selection when value prop changes', () => {
    const onChange = vi.fn();
    const { rerender } = render(
      <ColorGrid options={mockOptions} value="#00b4d8" onChange={onChange} />
    );

    expect(screen.getByTitle('Cyan')).toHaveClass('color-grid-item-selected');

    rerender(
      <ColorGrid options={mockOptions} value="#8338ec" onChange={onChange} />
    );

    expect(screen.getByTitle('Cyan')).not.toHaveClass('color-grid-item-selected');
    expect(screen.getByTitle('Purple')).toHaveClass('color-grid-item-selected');
  });

  it('calls onChange when clicking a different color', () => {
    const onChange = vi.fn();
    render(
      <ColorGrid options={mockOptions} value="#00b4d8" onChange={onChange} />
    );

    // Click Mint (different from current Cyan)
    fireEvent.click(screen.getByTitle('Mint'));
    expect(onChange).toHaveBeenCalledWith('#06d6a0');

    // Click Purple
    fireEvent.click(screen.getByTitle('Purple'));
    expect(onChange).toHaveBeenCalledWith('#8338ec');

    expect(onChange).toHaveBeenCalledTimes(2);
  });
});
