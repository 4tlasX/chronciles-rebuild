import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { KeyValueList } from '../KeyValueList';

describe('KeyValueList', () => {
  it('renders add button', () => {
    render(<KeyValueList />);
    expect(screen.getByRole('button', { name: /add field/i })).toBeInTheDocument();
  });

  it('renders with custom add button text', () => {
    render(<KeyValueList addButtonText="Add Metadata" />);
    expect(screen.getByRole('button', { name: /add metadata/i })).toBeInTheDocument();
  });

  it('starts with no pairs by default', () => {
    render(<KeyValueList />);
    expect(screen.queryAllByRole('textbox')).toHaveLength(0);
  });

  it('renders initial pairs', () => {
    render(
      <KeyValueList
        initialPairs={[
          { key: 'name', value: 'John' },
          { key: 'age', value: '30' },
        ]}
      />
    );
    const inputs = screen.getAllByRole('textbox');
    expect(inputs).toHaveLength(4); // 2 pairs × 2 inputs each
    expect(inputs[0]).toHaveValue('name');
    expect(inputs[1]).toHaveValue('John');
  });

  it('adds a new pair when add button is clicked', () => {
    render(<KeyValueList />);
    fireEvent.click(screen.getByRole('button', { name: /add field/i }));
    expect(screen.getAllByRole('textbox')).toHaveLength(2);
  });

  it('removes a pair when remove button is clicked', () => {
    render(
      <KeyValueList
        initialPairs={[
          { key: 'key1', value: 'value1' },
          { key: 'key2', value: 'value2' },
        ]}
      />
    );
    const removeButtons = screen.getAllByRole('button', { name: /remove/i });
    fireEvent.click(removeButtons[0]);
    const inputs = screen.getAllByRole('textbox');
    expect(inputs).toHaveLength(2);
    expect(inputs[0]).toHaveValue('key2');
  });

  it('calls onChange when pairs change', () => {
    const onChange = vi.fn();
    render(<KeyValueList onChange={onChange} />);
    fireEvent.click(screen.getByRole('button', { name: /add field/i }));
    expect(onChange).toHaveBeenCalledWith([{ key: '', value: '' }]);
  });

  it('renders hidden input with JSON value', () => {
    const { container } = render(
      <KeyValueList
        name="metadata"
        initialPairs={[{ key: 'featured', value: 'true' }]}
      />
    );
    const hiddenInput = container.querySelector('input[type="hidden"]');
    expect(hiddenInput).toHaveAttribute('name', 'metadata');
    expect(hiddenInput).toHaveValue('{"featured":true}');
  });

  it('uses custom placeholders', () => {
    render(
      <KeyValueList
        initialPairs={[{ key: '', value: '' }]}
        keyPlaceholder="Property"
        valuePlaceholder="Data"
      />
    );
    expect(screen.getByPlaceholderText('Property')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Data')).toBeInTheDocument();
  });

  it('converts string values to JSON in hidden input', () => {
    const { container } = render(
      <KeyValueList
        name="meta"
        initialPairs={[
          { key: 'count', value: '42' },
          { key: 'active', value: 'true' },
          { key: 'name', value: 'test' },
        ]}
      />
    );
    const hiddenInput = container.querySelector('input[type="hidden"]');
    const value = JSON.parse(hiddenInput?.getAttribute('value') || '{}');
    expect(value.count).toBe(42);
    expect(value.active).toBe(true);
    expect(value.name).toBe('test');
  });

  it('skips pairs with empty keys', () => {
    const { container } = render(
      <KeyValueList
        name="meta"
        initialPairs={[
          { key: '', value: 'ignored' },
          { key: 'valid', value: 'included' },
        ]}
      />
    );
    const hiddenInput = container.querySelector('input[type="hidden"]');
    const value = JSON.parse(hiddenInput?.getAttribute('value') || '{}');
    expect(value).toEqual({ valid: 'included' });
  });
});
