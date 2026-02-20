import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { KeyValuePair } from '../KeyValuePair';

describe('KeyValuePair', () => {
  const defaultProps = {
    index: 0,
    data: { key: '', value: '' },
    onChange: vi.fn(),
    onRemove: vi.fn(),
  };

  it('renders two text inputs', () => {
    render(<KeyValuePair {...defaultProps} />);
    const inputs = screen.getAllByRole('textbox');
    expect(inputs).toHaveLength(2);
  });

  it('renders remove button by default', () => {
    render(<KeyValuePair {...defaultProps} />);
    expect(screen.getByRole('button')).toBeInTheDocument();
  });

  it('does not render remove button when removable is false', () => {
    render(<KeyValuePair {...defaultProps} removable={false} />);
    expect(screen.queryByRole('button')).not.toBeInTheDocument();
  });

  it('displays key value in first input', () => {
    render(<KeyValuePair {...defaultProps} data={{ key: 'myKey', value: '' }} />);
    const inputs = screen.getAllByRole('textbox');
    expect(inputs[0]).toHaveValue('myKey');
  });

  it('displays value in second input', () => {
    render(<KeyValuePair {...defaultProps} data={{ key: '', value: 'myValue' }} />);
    const inputs = screen.getAllByRole('textbox');
    expect(inputs[1]).toHaveValue('myValue');
  });

  it('calls onChange when key changes', () => {
    const onChange = vi.fn();
    render(<KeyValuePair {...defaultProps} onChange={onChange} />);
    const inputs = screen.getAllByRole('textbox');
    fireEvent.change(inputs[0], { target: { value: 'newKey' } });
    expect(onChange).toHaveBeenCalledWith(0, { key: 'newKey', value: '' });
  });

  it('calls onChange when value changes', () => {
    const onChange = vi.fn();
    render(<KeyValuePair {...defaultProps} onChange={onChange} />);
    const inputs = screen.getAllByRole('textbox');
    fireEvent.change(inputs[1], { target: { value: 'newValue' } });
    expect(onChange).toHaveBeenCalledWith(0, { key: '', value: 'newValue' });
  });

  it('calls onRemove when remove button is clicked', () => {
    const onRemove = vi.fn();
    render(<KeyValuePair {...defaultProps} index={2} onRemove={onRemove} />);
    fireEvent.click(screen.getByRole('button'));
    expect(onRemove).toHaveBeenCalledWith(2);
  });

  it('uses custom placeholders', () => {
    render(
      <KeyValuePair
        {...defaultProps}
        keyPlaceholder="Field Name"
        valuePlaceholder="Field Value"
      />
    );
    expect(screen.getByPlaceholderText('Field Name')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Field Value')).toBeInTheDocument();
  });

  it('has accessible labels', () => {
    render(<KeyValuePair {...defaultProps} index={1} />);
    expect(screen.getByLabelText('Key 2')).toBeInTheDocument();
    expect(screen.getByLabelText('Value 2')).toBeInTheDocument();
  });
});
