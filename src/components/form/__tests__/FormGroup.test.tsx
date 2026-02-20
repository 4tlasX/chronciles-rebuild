import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { FormGroup } from '../FormGroup';

describe('FormGroup', () => {
  it('renders children', () => {
    render(
      <FormGroup>
        <input type="text" data-testid="child-input" />
      </FormGroup>
    );
    expect(screen.getByTestId('child-input')).toBeInTheDocument();
  });

  it('renders label when provided', () => {
    render(
      <FormGroup label="Username">
        <input type="text" />
      </FormGroup>
    );
    expect(screen.getByText('Username')).toBeInTheDocument();
  });

  it('associates label with htmlFor', () => {
    render(
      <FormGroup label="Email" htmlFor="email-input">
        <input type="email" id="email-input" />
      </FormGroup>
    );
    const label = screen.getByText('Email');
    expect(label).toHaveAttribute('for', 'email-input');
  });

  it('shows required indicator when required', () => {
    render(
      <FormGroup label="Name" required>
        <input type="text" />
      </FormGroup>
    );
    expect(screen.getByText('*')).toBeInTheDocument();
    expect(screen.getByText('*')).toHaveClass('form-required');
  });

  it('does not show required indicator when not required', () => {
    render(
      <FormGroup label="Name">
        <input type="text" />
      </FormGroup>
    );
    expect(screen.queryByText('*')).not.toBeInTheDocument();
  });

  it('shows hint when provided and no error', () => {
    render(
      <FormGroup hint="Enter your full name">
        <input type="text" />
      </FormGroup>
    );
    expect(screen.getByText('Enter your full name')).toBeInTheDocument();
    expect(screen.getByText('Enter your full name')).toHaveClass('form-hint');
  });

  it('shows error when provided', () => {
    render(
      <FormGroup error="This field is required">
        <input type="text" />
      </FormGroup>
    );
    expect(screen.getByText('This field is required')).toBeInTheDocument();
    expect(screen.getByText('This field is required')).toHaveClass('form-error');
  });

  it('shows error instead of hint when both are provided', () => {
    render(
      <FormGroup hint="Helpful hint" error="Error message">
        <input type="text" />
      </FormGroup>
    );
    expect(screen.getByText('Error message')).toBeInTheDocument();
    expect(screen.queryByText('Helpful hint')).not.toBeInTheDocument();
  });

  it('applies form-group class', () => {
    const { container } = render(
      <FormGroup>
        <input type="text" />
      </FormGroup>
    );
    expect(container.firstChild).toHaveClass('form-group');
  });
});
