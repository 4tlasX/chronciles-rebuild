import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { EditablePostCard } from '../EditablePostCard';
import type { Post, Taxonomy } from '@/lib/db';

describe('EditablePostCard', () => {
  const mockPost: Post = {
    id: 1,
    content: 'Test post content',
    metadata: {},
    createdAt: new Date('2024-03-15T12:00:00Z'),
  };

  const mockTaxonomies: Taxonomy[] = [
    { id: 1, name: 'Task', icon: 'task', color: '#ff0000' },
    { id: 2, name: 'Note', icon: 'note', color: '#00ff00' },
  ];

  const defaultProps = {
    post: mockPost,
    taxonomy: null,
    taxonomies: mockTaxonomies,
    isEditing: false,
    onStartEdit: vi.fn(),
    onSave: vi.fn(),
    onDelete: vi.fn(),
    onCancelEdit: vi.fn(),
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Display Mode (not editing)', () => {
    it('renders post content', () => {
      render(<EditablePostCard {...defaultProps} />);
      expect(screen.getByText('Test post content')).toBeInTheDocument();
    });

    it('renders post date', () => {
      render(<EditablePostCard {...defaultProps} />);
      expect(screen.getByText(/march 15, 2024/i)).toBeInTheDocument();
    });

    it('renders short date', () => {
      render(<EditablePostCard {...defaultProps} />);
      expect(screen.getByText('3/15')).toBeInTheDocument();
    });

    it('renders topic placeholder when no taxonomy', () => {
      render(<EditablePostCard {...defaultProps} />);
      expect(screen.getByText('+ topic')).toBeInTheDocument();
    });

    it('renders taxonomy name when provided', () => {
      render(<EditablePostCard {...defaultProps} taxonomy={mockTaxonomies[0]} />);
      expect(screen.getByText('Task')).toBeInTheDocument();
    });

    it('calls onStartEdit when card is clicked', () => {
      render(<EditablePostCard {...defaultProps} />);
      fireEvent.click(screen.getByRole('article'));
      expect(defaultProps.onStartEdit).toHaveBeenCalled();
    });

    it('calls onDelete when X button is clicked while not editing', () => {
      render(<EditablePostCard {...defaultProps} />);
      fireEvent.click(screen.getByLabelText('Delete post'));
      expect(defaultProps.onDelete).toHaveBeenCalledWith(1);
    });

    it('does not call onStartEdit when X button is clicked', () => {
      render(<EditablePostCard {...defaultProps} />);
      fireEvent.click(screen.getByLabelText('Delete post'));
      expect(defaultProps.onStartEdit).not.toHaveBeenCalled();
    });
  });

  describe('Edit Mode (existing post)', () => {
    const editingProps = {
      ...defaultProps,
      isEditing: true,
    };

    it('renders textarea with post content', () => {
      render(<EditablePostCard {...editingProps} />);
      expect(screen.getByPlaceholderText('Write your post...')).toHaveValue('Test post content');
    });

    it('renders save button', () => {
      render(<EditablePostCard {...editingProps} />);
      expect(screen.getByRole('button', { name: 'Save' })).toBeInTheDocument();
    });

    it('renders hidden id field for existing posts', () => {
      const { container } = render(<EditablePostCard {...editingProps} />);
      const hiddenInput = container.querySelector('input[name="id"]');
      expect(hiddenInput).toBeInTheDocument();
      expect(hiddenInput).toHaveValue('1');
    });

    it('calls onCancelEdit when X button is clicked while editing', () => {
      render(<EditablePostCard {...editingProps} />);
      fireEvent.click(screen.getByLabelText('Cancel'));
      expect(editingProps.onCancelEdit).toHaveBeenCalled();
    });

    it('does not call onDelete when X button is clicked while editing', () => {
      render(<EditablePostCard {...editingProps} />);
      fireEvent.click(screen.getByLabelText('Cancel'));
      expect(editingProps.onDelete).not.toHaveBeenCalled();
    });

    it('calls onSave when form is submitted', async () => {
      render(<EditablePostCard {...editingProps} />);
      fireEvent.click(screen.getByRole('button', { name: 'Save' }));

      await waitFor(() => {
        expect(editingProps.onSave).toHaveBeenCalled();
      });
    });

    it('includes content in form data when saving', async () => {
      let savedFormData: FormData | null = null;
      const onSave = vi.fn((formData: FormData) => {
        savedFormData = formData;
      });

      render(<EditablePostCard {...editingProps} onSave={onSave} />);

      const textarea = screen.getByPlaceholderText('Write your post...');
      fireEvent.change(textarea, { target: { value: 'Updated content' } });
      fireEvent.click(screen.getByRole('button', { name: 'Save' }));

      await waitFor(() => {
        expect(savedFormData?.get('content')).toBe('Updated content');
      });
    });

    it('calls onCancelEdit when Escape key is pressed', () => {
      render(<EditablePostCard {...editingProps} />);
      fireEvent.keyDown(document, { key: 'Escape' });
      expect(editingProps.onCancelEdit).toHaveBeenCalled();
    });

    it('does not call onDelete when Escape is pressed while editing', () => {
      render(<EditablePostCard {...editingProps} />);
      fireEvent.keyDown(document, { key: 'Escape' });
      expect(editingProps.onDelete).not.toHaveBeenCalled();
    });
  });

  describe('New Post Mode (isNew=true)', () => {
    const newPost: Post = {
      id: -1,
      content: '',
      metadata: {},
      createdAt: new Date(),
    };

    const newPostProps = {
      ...defaultProps,
      post: newPost,
      isEditing: true,
      isNew: true,
      onCancel: vi.fn(),
    };

    it('renders empty textarea for new post', () => {
      render(<EditablePostCard {...newPostProps} />);
      expect(screen.getByPlaceholderText('Write your post...')).toHaveValue('');
    });

    it('does not render hidden id field for new posts', () => {
      const { container } = render(<EditablePostCard {...newPostProps} />);
      const hiddenInput = container.querySelector('input[name="id"]');
      expect(hiddenInput).not.toBeInTheDocument();
    });

    it('calls onCancel when X button is clicked for new post', () => {
      render(<EditablePostCard {...newPostProps} />);
      fireEvent.click(screen.getByLabelText('Cancel'));
      expect(newPostProps.onCancel).toHaveBeenCalled();
    });

    it('does not call onCancelEdit when X is clicked for new post', () => {
      render(<EditablePostCard {...newPostProps} />);
      fireEvent.click(screen.getByLabelText('Cancel'));
      expect(newPostProps.onCancelEdit).not.toHaveBeenCalled();
    });

    it('does not call onDelete when X is clicked for new post', () => {
      render(<EditablePostCard {...newPostProps} />);
      fireEvent.click(screen.getByLabelText('Cancel'));
      expect(newPostProps.onDelete).not.toHaveBeenCalled();
    });

    it('calls onCancel when Escape key is pressed for new post', () => {
      render(<EditablePostCard {...newPostProps} />);
      fireEvent.keyDown(document, { key: 'Escape' });
      expect(newPostProps.onCancel).toHaveBeenCalled();
    });

    it('calls onSave when new post form is submitted', async () => {
      render(<EditablePostCard {...newPostProps} />);

      const textarea = screen.getByPlaceholderText('Write your post...');
      fireEvent.change(textarea, { target: { value: 'New post content' } });
      fireEvent.click(screen.getByRole('button', { name: 'Save' }));

      await waitFor(() => {
        expect(newPostProps.onSave).toHaveBeenCalled();
      });
    });

    it('includes content but not id in form data for new post', async () => {
      let savedFormData: FormData | null = null;
      const onSave = vi.fn((formData: FormData) => {
        savedFormData = formData;
      });

      render(<EditablePostCard {...newPostProps} onSave={onSave} />);

      const textarea = screen.getByPlaceholderText('Write your post...');
      fireEvent.change(textarea, { target: { value: 'New post content' } });
      fireEvent.click(screen.getByRole('button', { name: 'Save' }));

      await waitFor(() => {
        expect(savedFormData?.get('content')).toBe('New post content');
        expect(savedFormData?.get('id')).toBeNull();
      });
    });
  });

  describe('Topic Selection', () => {
    const editingProps = {
      ...defaultProps,
      isEditing: true,
    };

    it('opens topic dropdown when topic trigger is clicked', () => {
      render(<EditablePostCard {...editingProps} />);
      fireEvent.click(screen.getByText('+ topic'));

      expect(screen.getByText('None')).toBeInTheDocument();
      expect(screen.getByText('Task')).toBeInTheDocument();
      expect(screen.getByText('Note')).toBeInTheDocument();
    });

    it('closes dropdown after selecting a taxonomy', () => {
      render(<EditablePostCard {...editingProps} />);

      fireEvent.click(screen.getByText('+ topic'));
      fireEvent.click(screen.getByRole('button', { name: /Task/i }));

      // Dropdown should close - None should no longer be visible
      expect(screen.queryByText('None')).not.toBeInTheDocument();
    });

    it('includes taxonomy in form data when saving', async () => {
      let savedFormData: FormData | null = null;
      const onSave = vi.fn((formData: FormData) => {
        savedFormData = formData;
      });

      render(<EditablePostCard {...editingProps} onSave={onSave} />);

      // Select a taxonomy
      fireEvent.click(screen.getByText('+ topic'));
      fireEvent.click(screen.getByRole('button', { name: /Task/i }));

      // Save the form
      fireEvent.click(screen.getByRole('button', { name: 'Save' }));

      await waitFor(() => {
        expect(savedFormData?.get('taxonomyId')).toBe('1');
      });
    });
  });

  describe('Accessibility', () => {
    it('has correct aria-label for delete button when not editing', () => {
      render(<EditablePostCard {...defaultProps} />);
      expect(screen.getByLabelText('Delete post')).toBeInTheDocument();
    });

    it('has correct aria-label for cancel button when editing', () => {
      render(<EditablePostCard {...defaultProps} isEditing={true} />);
      expect(screen.getByLabelText('Cancel')).toBeInTheDocument();
    });

    it('renders as article element', () => {
      render(<EditablePostCard {...defaultProps} />);
      expect(screen.getByRole('article')).toBeInTheDocument();
    });

    it('has editing class when in edit mode', () => {
      render(<EditablePostCard {...defaultProps} isEditing={true} />);
      expect(screen.getByRole('article')).toHaveClass('post-view-editing');
    });
  });
});
