import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { FormRow } from '../FormRow';

describe('FormRow', () => {
  it('renders children', () => {
    render(
      <FormRow>
        <span data-testid="child">Child content</span>
      </FormRow>
    );
    expect(screen.getByTestId('child')).toBeInTheDocument();
  });

  it('applies form-row class by default', () => {
    const { container } = render(
      <FormRow>
        <span>Content</span>
      </FormRow>
    );
    expect(container.firstChild).toHaveClass('form-row');
  });

  it('applies form-row-inline class when inline is true', () => {
    const { container } = render(
      <FormRow inline>
        <span>Content</span>
      </FormRow>
    );
    expect(container.firstChild).toHaveClass('form-row', 'form-row-inline');
  });

  it('does not apply form-row-inline when inline is false', () => {
    const { container } = render(
      <FormRow inline={false}>
        <span>Content</span>
      </FormRow>
    );
    expect(container.firstChild).not.toHaveClass('form-row-inline');
  });

  it('renders multiple children', () => {
    render(
      <FormRow>
        <span data-testid="child1">First</span>
        <span data-testid="child2">Second</span>
      </FormRow>
    );
    expect(screen.getByTestId('child1')).toBeInTheDocument();
    expect(screen.getByTestId('child2')).toBeInTheDocument();
  });
});
