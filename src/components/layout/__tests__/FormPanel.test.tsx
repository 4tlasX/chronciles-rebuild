import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { FormPanel } from '../FormPanel';

describe('FormPanel', () => {
  it('renders title', () => {
    render(
      <FormPanel title="Create Item">
        <input type="text" />
      </FormPanel>
    );
    expect(screen.getByText('Create Item')).toBeInTheDocument();
  });

  it('renders children', () => {
    render(
      <FormPanel title="Title">
        <input type="text" data-testid="input" />
      </FormPanel>
    );
    expect(screen.getByTestId('input')).toBeInTheDocument();
  });

  it('applies form-panel class', () => {
    const { container } = render(
      <FormPanel title="Title">Content</FormPanel>
    );
    expect(container.firstChild).toHaveClass('form-panel');
  });

  it('applies form-panel-title class to title', () => {
    render(<FormPanel title="Title">Content</FormPanel>);
    expect(screen.getByText('Title')).toHaveClass('form-panel-title');
  });
});
