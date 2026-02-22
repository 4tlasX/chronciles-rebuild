import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { MeetingFields } from '../MeetingFields';
import { defaultMeetingMetadata } from '@/lib/taxonomies';

describe('MeetingFields', () => {
  const mockOnChange = vi.fn();

  beforeEach(() => {
    mockOnChange.mockClear();
  });

  it('renders meeting topic input', () => {
    render(<MeetingFields values={defaultMeetingMetadata} onChange={mockOnChange} />);

    expect(screen.getByLabelText(/meeting topic/i)).toBeInTheDocument();
  });

  it('renders attendees input', () => {
    render(<MeetingFields values={defaultMeetingMetadata} onChange={mockOnChange} />);

    expect(screen.getByLabelText(/attendees/i)).toBeInTheDocument();
  });

  it('renders start date input', () => {
    render(<MeetingFields values={defaultMeetingMetadata} onChange={mockOnChange} />);

    expect(screen.getByLabelText(/start date/i)).toBeInTheDocument();
  });

  it('renders start time input', () => {
    render(<MeetingFields values={defaultMeetingMetadata} onChange={mockOnChange} />);

    expect(screen.getByLabelText(/start time/i)).toBeInTheDocument();
  });

  it('renders end date input', () => {
    render(<MeetingFields values={defaultMeetingMetadata} onChange={mockOnChange} />);

    expect(screen.getByLabelText(/end date/i)).toBeInTheDocument();
  });

  it('renders end time input', () => {
    render(<MeetingFields values={defaultMeetingMetadata} onChange={mockOnChange} />);

    expect(screen.getByLabelText(/end time/i)).toBeInTheDocument();
  });

  it('renders location input', () => {
    render(<MeetingFields values={defaultMeetingMetadata} onChange={mockOnChange} />);

    expect(screen.getByLabelText(/location/i)).toBeInTheDocument();
  });

  it('renders notes textarea', () => {
    render(<MeetingFields values={defaultMeetingMetadata} onChange={mockOnChange} />);

    expect(screen.getByLabelText(/notes/i)).toBeInTheDocument();
  });

  it('renders with default time values', () => {
    render(<MeetingFields values={defaultMeetingMetadata} onChange={mockOnChange} />);

    expect(screen.getByLabelText(/start time/i)).toHaveValue('09:00');
    expect(screen.getByLabelText(/end time/i)).toHaveValue('10:00');
  });

  it('calls onChange when topic is changed', () => {
    render(<MeetingFields values={defaultMeetingMetadata} onChange={mockOnChange} />);

    fireEvent.change(screen.getByLabelText(/meeting topic/i), {
      target: { value: 'Sprint Planning' },
    });

    expect(mockOnChange).toHaveBeenCalledWith('topic', 'Sprint Planning');
  });

  it('calls onChange when attendees are changed', () => {
    render(<MeetingFields values={defaultMeetingMetadata} onChange={mockOnChange} />);

    fireEvent.change(screen.getByLabelText(/attendees/i), {
      target: { value: 'Alice, Bob, Charlie' },
    });

    expect(mockOnChange).toHaveBeenCalledWith('attendees', 'Alice, Bob, Charlie');
  });

  it('calls onChange when start date is changed', () => {
    render(<MeetingFields values={defaultMeetingMetadata} onChange={mockOnChange} />);

    fireEvent.change(screen.getByLabelText(/start date/i), {
      target: { value: '2025-03-15' },
    });

    expect(mockOnChange).toHaveBeenCalledWith('startDate', '2025-03-15');
  });

  it('calls onChange when start time is changed', () => {
    render(<MeetingFields values={defaultMeetingMetadata} onChange={mockOnChange} />);

    fireEvent.change(screen.getByLabelText(/start time/i), {
      target: { value: '14:00' },
    });

    expect(mockOnChange).toHaveBeenCalledWith('startTime', '14:00');
  });

  it('calls onChange when end date is changed', () => {
    render(<MeetingFields values={defaultMeetingMetadata} onChange={mockOnChange} />);

    fireEvent.change(screen.getByLabelText(/end date/i), {
      target: { value: '2025-03-15' },
    });

    expect(mockOnChange).toHaveBeenCalledWith('endDate', '2025-03-15');
  });

  it('calls onChange when end time is changed', () => {
    render(<MeetingFields values={defaultMeetingMetadata} onChange={mockOnChange} />);

    fireEvent.change(screen.getByLabelText(/end time/i), {
      target: { value: '15:00' },
    });

    expect(mockOnChange).toHaveBeenCalledWith('endTime', '15:00');
  });

  it('calls onChange when location is changed', () => {
    render(<MeetingFields values={defaultMeetingMetadata} onChange={mockOnChange} />);

    fireEvent.change(screen.getByLabelText(/location/i), {
      target: { value: 'Conference Room A' },
    });

    expect(mockOnChange).toHaveBeenCalledWith('location', 'Conference Room A');
  });

  it('calls onChange when notes are changed', () => {
    render(<MeetingFields values={defaultMeetingMetadata} onChange={mockOnChange} />);

    fireEvent.change(screen.getByLabelText(/notes/i), {
      target: { value: 'Bring quarterly reports' },
    });

    expect(mockOnChange).toHaveBeenCalledWith('notes', 'Bring quarterly reports');
  });

  it('renders with provided values', () => {
    render(
      <MeetingFields
        values={{
          ...defaultMeetingMetadata,
          topic: 'Weekly Sync',
          attendees: 'Team Alpha',
          startDate: '2025-03-20',
          startTime: '10:00',
          endDate: '2025-03-20',
          endTime: '11:00',
          location: 'Zoom',
          notes: 'Review progress',
        }}
        onChange={mockOnChange}
      />
    );

    expect(screen.getByLabelText(/meeting topic/i)).toHaveValue('Weekly Sync');
    expect(screen.getByLabelText(/attendees/i)).toHaveValue('Team Alpha');
    expect(screen.getByLabelText(/start date/i)).toHaveValue('2025-03-20');
    expect(screen.getByLabelText(/start time/i)).toHaveValue('10:00');
    expect(screen.getByLabelText(/end date/i)).toHaveValue('2025-03-20');
    expect(screen.getByLabelText(/end time/i)).toHaveValue('11:00');
    expect(screen.getByLabelText(/location/i)).toHaveValue('Zoom');
    expect(screen.getByLabelText(/notes/i)).toHaveValue('Review progress');
  });

  it('applies meeting-fields class', () => {
    const { container } = render(
      <MeetingFields values={defaultMeetingMetadata} onChange={mockOnChange} />
    );

    expect(container.querySelector('.meeting-fields')).toBeInTheDocument();
  });

  it('applies metadata-fields class', () => {
    const { container } = render(
      <MeetingFields values={defaultMeetingMetadata} onChange={mockOnChange} />
    );

    expect(container.querySelector('.metadata-fields')).toBeInTheDocument();
  });
});
