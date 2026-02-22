import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { EventFields } from '../EventFields';
import { defaultEventMetadata } from '@/lib/taxonomies';

describe('EventFields', () => {
  const mockOnChange = vi.fn();

  beforeEach(() => {
    mockOnChange.mockClear();
  });

  it('renders start date input', () => {
    render(<EventFields values={defaultEventMetadata} onChange={mockOnChange} />);

    expect(screen.getByLabelText(/start date/i)).toBeInTheDocument();
  });

  it('renders start time input', () => {
    render(<EventFields values={defaultEventMetadata} onChange={mockOnChange} />);

    expect(screen.getByLabelText(/start time/i)).toBeInTheDocument();
  });

  it('renders end date input', () => {
    render(<EventFields values={defaultEventMetadata} onChange={mockOnChange} />);

    expect(screen.getByLabelText(/end date/i)).toBeInTheDocument();
  });

  it('renders end time input', () => {
    render(<EventFields values={defaultEventMetadata} onChange={mockOnChange} />);

    expect(screen.getByLabelText(/end time/i)).toBeInTheDocument();
  });

  it('renders location input', () => {
    render(<EventFields values={defaultEventMetadata} onChange={mockOnChange} />);

    expect(screen.getByLabelText('Location')).toBeInTheDocument();
  });

  it('renders address input', () => {
    render(<EventFields values={defaultEventMetadata} onChange={mockOnChange} />);

    expect(screen.getByLabelText(/address/i)).toBeInTheDocument();
  });

  it('renders phone input', () => {
    render(<EventFields values={defaultEventMetadata} onChange={mockOnChange} />);

    expect(screen.getByLabelText(/phone/i)).toBeInTheDocument();
  });

  it('renders notes textarea', () => {
    render(<EventFields values={defaultEventMetadata} onChange={mockOnChange} />);

    expect(screen.getByLabelText(/notes/i)).toBeInTheDocument();
  });

  it('renders with default time values', () => {
    render(<EventFields values={defaultEventMetadata} onChange={mockOnChange} />);

    expect(screen.getByLabelText(/start time/i)).toHaveValue('09:00');
    expect(screen.getByLabelText(/end time/i)).toHaveValue('10:00');
  });

  it('calls onChange when start date is changed', () => {
    render(<EventFields values={defaultEventMetadata} onChange={mockOnChange} />);

    fireEvent.change(screen.getByLabelText(/start date/i), {
      target: { value: '2025-04-01' },
    });

    expect(mockOnChange).toHaveBeenCalledWith('startDate', '2025-04-01');
  });

  it('calls onChange when start time is changed', () => {
    render(<EventFields values={defaultEventMetadata} onChange={mockOnChange} />);

    fireEvent.change(screen.getByLabelText(/start time/i), {
      target: { value: '14:30' },
    });

    expect(mockOnChange).toHaveBeenCalledWith('startTime', '14:30');
  });

  it('calls onChange when end date is changed', () => {
    render(<EventFields values={defaultEventMetadata} onChange={mockOnChange} />);

    fireEvent.change(screen.getByLabelText(/end date/i), {
      target: { value: '2025-04-01' },
    });

    expect(mockOnChange).toHaveBeenCalledWith('endDate', '2025-04-01');
  });

  it('calls onChange when end time is changed', () => {
    render(<EventFields values={defaultEventMetadata} onChange={mockOnChange} />);

    fireEvent.change(screen.getByLabelText(/end time/i), {
      target: { value: '16:00' },
    });

    expect(mockOnChange).toHaveBeenCalledWith('endTime', '16:00');
  });

  it('calls onChange when location is changed', () => {
    render(<EventFields values={defaultEventMetadata} onChange={mockOnChange} />);

    fireEvent.change(screen.getByLabelText('Location'), {
      target: { value: 'City Hall' },
    });

    expect(mockOnChange).toHaveBeenCalledWith('location', 'City Hall');
  });

  it('calls onChange when address is changed', () => {
    render(<EventFields values={defaultEventMetadata} onChange={mockOnChange} />);

    fireEvent.change(screen.getByLabelText(/address/i), {
      target: { value: '123 Main St' },
    });

    expect(mockOnChange).toHaveBeenCalledWith('address', '123 Main St');
  });

  it('calls onChange when phone is changed', () => {
    render(<EventFields values={defaultEventMetadata} onChange={mockOnChange} />);

    fireEvent.change(screen.getByLabelText(/phone/i), {
      target: { value: '555-1234' },
    });

    expect(mockOnChange).toHaveBeenCalledWith('phone', '555-1234');
  });

  it('calls onChange when notes are changed', () => {
    render(<EventFields values={defaultEventMetadata} onChange={mockOnChange} />);

    fireEvent.change(screen.getByLabelText(/notes/i), {
      target: { value: 'Bring tickets' },
    });

    expect(mockOnChange).toHaveBeenCalledWith('notes', 'Bring tickets');
  });

  it('calls onChange with null when start date is cleared', () => {
    render(
      <EventFields
        values={{ ...defaultEventMetadata, startDate: '2025-04-01' }}
        onChange={mockOnChange}
      />
    );

    fireEvent.change(screen.getByLabelText(/start date/i), {
      target: { value: '' },
    });

    expect(mockOnChange).toHaveBeenCalledWith('startDate', null);
  });

  it('calls onChange with null when end date is cleared', () => {
    render(
      <EventFields
        values={{ ...defaultEventMetadata, endDate: '2025-04-01' }}
        onChange={mockOnChange}
      />
    );

    fireEvent.change(screen.getByLabelText(/end date/i), {
      target: { value: '' },
    });

    expect(mockOnChange).toHaveBeenCalledWith('endDate', null);
  });

  it('renders with provided values', () => {
    render(
      <EventFields
        values={{
          ...defaultEventMetadata,
          startDate: '2025-05-10',
          startTime: '18:00',
          endDate: '2025-05-10',
          endTime: '21:00',
          location: 'Concert Hall',
          address: '456 Music Ave',
          phone: '555-6789',
          notes: 'VIP tickets',
        }}
        onChange={mockOnChange}
      />
    );

    expect(screen.getByLabelText(/start date/i)).toHaveValue('2025-05-10');
    expect(screen.getByLabelText(/start time/i)).toHaveValue('18:00');
    expect(screen.getByLabelText(/end date/i)).toHaveValue('2025-05-10');
    expect(screen.getByLabelText(/end time/i)).toHaveValue('21:00');
    expect(screen.getByLabelText('Location')).toHaveValue('Concert Hall');
    expect(screen.getByLabelText(/address/i)).toHaveValue('456 Music Ave');
    expect(screen.getByLabelText(/phone/i)).toHaveValue('555-6789');
    expect(screen.getByLabelText(/notes/i)).toHaveValue('VIP tickets');
  });

  it('applies event-fields class', () => {
    const { container } = render(
      <EventFields values={defaultEventMetadata} onChange={mockOnChange} />
    );

    expect(container.querySelector('.event-fields')).toBeInTheDocument();
  });

  it('applies metadata-fields class', () => {
    const { container } = render(
      <EventFields values={defaultEventMetadata} onChange={mockOnChange} />
    );

    expect(container.querySelector('.metadata-fields')).toBeInTheDocument();
  });
});
