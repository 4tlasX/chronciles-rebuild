import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { TaxonomySelector } from '../TaxonomySelector';
import type { Taxonomy } from '@/lib/db';

describe('TaxonomySelector', () => {
  const mockOnChange = vi.fn();

  // Use taxonomies that don't match feature taxonomy names to avoid filtering
  const mockTaxonomies: Taxonomy[] = [
    { id: 1, name: 'Task', icon: 'clipboard-list', color: '#3b82f6' },
    { id: 2, name: 'Work', icon: 'briefcase', color: '#10b981' },
    { id: 3, name: 'Event', icon: 'calendar', color: '#f59e0b' },
    { id: 4, name: 'Meeting', icon: 'users', color: '#8b5cf6' },
  ];

  beforeEach(() => {
    mockOnChange.mockClear();
  });

  it('renders trigger button', () => {
    render(
      <TaxonomySelector
        taxonomies={mockTaxonomies}
        selectedId={null}
        onChange={mockOnChange}
        showAllTaxonomies
      />
    );

    expect(screen.getByRole('button')).toBeInTheDocument();
  });

  it('renders placeholder when nothing is selected', () => {
    render(
      <TaxonomySelector
        taxonomies={mockTaxonomies}
        selectedId={null}
        onChange={mockOnChange}
        placeholder="Select a topic..."
        showAllTaxonomies
      />
    );

    expect(screen.getByText('Select a topic...')).toBeInTheDocument();
  });

  it('renders custom placeholder', () => {
    render(
      <TaxonomySelector
        taxonomies={mockTaxonomies}
        selectedId={null}
        onChange={mockOnChange}
        placeholder="Choose category"
        showAllTaxonomies
      />
    );

    expect(screen.getByText('Choose category')).toBeInTheDocument();
  });

  it('renders selected taxonomy name when one is selected', () => {
    render(
      <TaxonomySelector
        taxonomies={mockTaxonomies}
        selectedId={1}
        onChange={mockOnChange}
        showAllTaxonomies
      />
    );

    expect(screen.getByText('Task')).toBeInTheDocument();
  });

  it('opens dropdown when trigger is clicked', () => {
    render(
      <TaxonomySelector
        taxonomies={mockTaxonomies}
        selectedId={null}
        onChange={mockOnChange}
        showAllTaxonomies
      />
    );

    fireEvent.click(screen.getByRole('button'));

    expect(screen.getByRole('listbox')).toBeInTheDocument();
  });

  it('shows all taxonomy options in dropdown', () => {
    render(
      <TaxonomySelector
        taxonomies={mockTaxonomies}
        selectedId={null}
        onChange={mockOnChange}
        showAllTaxonomies
      />
    );

    fireEvent.click(screen.getByRole('button'));

    expect(screen.getByText('Task')).toBeInTheDocument();
    expect(screen.getByText('Work')).toBeInTheDocument();
    expect(screen.getByText('Event')).toBeInTheDocument();
    expect(screen.getByText('Meeting')).toBeInTheDocument();
  });

  it('shows "None" option in dropdown', () => {
    render(
      <TaxonomySelector
        taxonomies={mockTaxonomies}
        selectedId={null}
        onChange={mockOnChange}
        showAllTaxonomies
      />
    );

    fireEvent.click(screen.getByRole('button'));

    expect(screen.getByText('None')).toBeInTheDocument();
  });

  it('calls onChange with taxonomy when option is clicked', () => {
    render(
      <TaxonomySelector
        taxonomies={mockTaxonomies}
        selectedId={null}
        onChange={mockOnChange}
        showAllTaxonomies
      />
    );

    fireEvent.click(screen.getByRole('button'));
    fireEvent.click(screen.getByText('Task'));

    expect(mockOnChange).toHaveBeenCalledWith(mockTaxonomies[0]);
  });

  it('calls onChange with null when None is clicked', () => {
    render(
      <TaxonomySelector
        taxonomies={mockTaxonomies}
        selectedId={1}
        onChange={mockOnChange}
        showAllTaxonomies
      />
    );

    fireEvent.click(screen.getByRole('button'));
    fireEvent.click(screen.getByText('None'));

    expect(mockOnChange).toHaveBeenCalledWith(null);
  });

  it('closes dropdown after selection', () => {
    render(
      <TaxonomySelector
        taxonomies={mockTaxonomies}
        selectedId={null}
        onChange={mockOnChange}
        showAllTaxonomies
      />
    );

    fireEvent.click(screen.getByRole('button'));
    expect(screen.getByRole('listbox')).toBeInTheDocument();

    fireEvent.click(screen.getByText('Task'));

    expect(screen.queryByRole('listbox')).not.toBeInTheDocument();
  });

  it('shows search input in dropdown', () => {
    render(
      <TaxonomySelector
        taxonomies={mockTaxonomies}
        selectedId={null}
        onChange={mockOnChange}
        showAllTaxonomies
      />
    );

    fireEvent.click(screen.getByRole('button'));

    expect(screen.getByPlaceholderText('Search topics...')).toBeInTheDocument();
  });

  it('filters options based on search query', () => {
    render(
      <TaxonomySelector
        taxonomies={mockTaxonomies}
        selectedId={null}
        onChange={mockOnChange}
        showAllTaxonomies
      />
    );

    fireEvent.click(screen.getByRole('button'));
    fireEvent.change(screen.getByPlaceholderText('Search topics...'), {
      target: { value: 'Task' },
    });

    expect(screen.getByText('Task')).toBeInTheDocument();
    expect(screen.queryByText('Work')).not.toBeInTheDocument();
    expect(screen.queryByText('Event')).not.toBeInTheDocument();
  });

  it('shows no results message when search has no matches', () => {
    render(
      <TaxonomySelector
        taxonomies={mockTaxonomies}
        selectedId={null}
        onChange={mockOnChange}
        showAllTaxonomies
      />
    );

    fireEvent.click(screen.getByRole('button'));
    fireEvent.change(screen.getByPlaceholderText('Search topics...'), {
      target: { value: 'xyz' },
    });

    expect(screen.getByText('No topics found')).toBeInTheDocument();
  });

  it('search is case insensitive', () => {
    render(
      <TaxonomySelector
        taxonomies={mockTaxonomies}
        selectedId={null}
        onChange={mockOnChange}
        showAllTaxonomies
      />
    );

    fireEvent.click(screen.getByRole('button'));
    fireEvent.change(screen.getByPlaceholderText('Search topics...'), {
      target: { value: 'task' },
    });

    expect(screen.getByText('Task')).toBeInTheDocument();
  });

  it('marks selected option as selected', () => {
    render(
      <TaxonomySelector
        taxonomies={mockTaxonomies}
        selectedId={1}
        onChange={mockOnChange}
        showAllTaxonomies
      />
    );

    fireEvent.click(screen.getByRole('button'));

    const taskOption = screen.getAllByRole('option').find(
      (el) => el.getAttribute('aria-selected') === 'true'
    );
    expect(taskOption).toBeInTheDocument();
  });

  it('clears search when dropdown is closed', () => {
    render(
      <TaxonomySelector
        taxonomies={mockTaxonomies}
        selectedId={null}
        onChange={mockOnChange}
        showAllTaxonomies
      />
    );

    // Open dropdown and search
    fireEvent.click(screen.getByRole('button'));
    fireEvent.change(screen.getByPlaceholderText('Search topics...'), {
      target: { value: 'Task' },
    });

    // Select an option (closes dropdown)
    fireEvent.click(screen.getByText('Task'));

    // Reopen dropdown
    fireEvent.click(screen.getByRole('button'));

    // Search should be cleared, all options visible
    expect(screen.getByText('Work')).toBeInTheDocument();
  });

  it('toggles dropdown open/closed on trigger click', () => {
    render(
      <TaxonomySelector
        taxonomies={mockTaxonomies}
        selectedId={null}
        onChange={mockOnChange}
        showAllTaxonomies
      />
    );

    const trigger = screen.getByRole('button');

    // Open
    fireEvent.click(trigger);
    expect(screen.getByRole('listbox')).toBeInTheDocument();

    // Close
    fireEvent.click(trigger);
    expect(screen.queryByRole('listbox')).not.toBeInTheDocument();
  });

  it('has correct aria attributes on trigger', () => {
    render(
      <TaxonomySelector
        taxonomies={mockTaxonomies}
        selectedId={null}
        onChange={mockOnChange}
        showAllTaxonomies
      />
    );

    const trigger = screen.getByRole('button');
    expect(trigger).toHaveAttribute('aria-haspopup', 'listbox');
    expect(trigger).toHaveAttribute('aria-expanded', 'false');

    fireEvent.click(trigger);
    expect(trigger).toHaveAttribute('aria-expanded', 'true');
  });

  it('applies taxonomy-selector class', () => {
    const { container } = render(
      <TaxonomySelector
        taxonomies={mockTaxonomies}
        selectedId={null}
        onChange={mockOnChange}
        showAllTaxonomies
      />
    );

    expect(container.querySelector('.taxonomy-selector')).toBeInTheDocument();
  });

  it('handles empty taxonomies array', () => {
    render(
      <TaxonomySelector
        taxonomies={[]}
        selectedId={null}
        onChange={mockOnChange}
        showAllTaxonomies
      />
    );

    fireEvent.click(screen.getByRole('button'));

    // Should still show None option
    expect(screen.getByText('None')).toBeInTheDocument();
  });
});
