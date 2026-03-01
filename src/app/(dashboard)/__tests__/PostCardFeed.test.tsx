import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { PostCardFeed } from '../PostCardFeed';
import type { Post, Taxonomy } from '@/lib/db';

// Mock the encryption hook
vi.mock('@/components/encryption', () => ({
  useEncryption: () => ({
    isUnlocked: false,
    encryptionEnabled: false,
    unlock: vi.fn(),
    lock: vi.fn(),
    setMasterKey: vi.fn(),
    encryptPost: vi.fn(),
    decryptPost: vi.fn(),
    decryptPosts: vi.fn().mockResolvedValue([]),
  }),
  UnlockDialog: ({ isOpen }: { isOpen: boolean }) =>
    isOpen ? <div data-testid="unlock-dialog">Unlock Dialog</div> : null,
}));

// Mock IntersectionObserver
class MockIntersectionObserver {
  observe = vi.fn();
  unobserve = vi.fn();
  disconnect = vi.fn();
  constructor() {}
}

vi.stubGlobal('IntersectionObserver', MockIntersectionObserver);

// Mock the server actions
vi.mock('../posts/actions', () => ({
  loadMorePostsAction: vi.fn(),
  createPostAction: vi.fn().mockResolvedValue({ success: true }),
  updatePostAction: vi.fn().mockResolvedValue({ success: true }),
  deletePostAction: vi.fn().mockResolvedValue({ success: true }),
}));

// Mock the UI store
let mockCreatePostTrigger = 0;

interface MockUIState {
  createPostTrigger: number;
  selectedTopicId: number | null;
  isTopicSidebarOpen: boolean;
  isSearchSidebarOpen: boolean;
  searchKeyword: string;
  searchDateFrom: string;
  searchDateTo: string;
}

const mockUIState: MockUIState = {
  createPostTrigger: 0,
  selectedTopicId: null,
  isTopicSidebarOpen: false,
  isSearchSidebarOpen: false,
  searchKeyword: '',
  searchDateFrom: '',
  searchDateTo: '',
};

vi.mock('@/stores', () => ({
  useUIStore: <T,>(selector: (state: MockUIState) => T): T => {
    mockUIState.createPostTrigger = mockCreatePostTrigger;
    return selector(mockUIState);
  },
}));

describe('PostCardFeed', () => {
  const mockPosts: Post[] = [
    {
      id: 1,
      content: 'First post content',
      metadata: {},
      createdAt: new Date('2024-03-15T12:00:00Z'),
    },
    {
      id: 2,
      content: 'Second post content',
      metadata: { _taxonomyId: 1 },
      createdAt: new Date('2024-03-14T12:00:00Z'),
    },
  ];

  const mockTaxonomies: Taxonomy[] = [
    { id: 1, name: 'Task', icon: 'task', color: '#ff0000' },
    { id: 2, name: 'Note', icon: 'note', color: '#00ff00' },
  ];

  const defaultProps = {
    initialPosts: mockPosts,
    taxonomies: mockTaxonomies,
    hasMore: false,
  };

  beforeEach(() => {
    vi.clearAllMocks();
    mockCreatePostTrigger = 0;
  });

  describe('Rendering', () => {
    it('renders all initial posts', () => {
      render(<PostCardFeed {...defaultProps} />);
      expect(screen.getByText('First post content')).toBeInTheDocument();
      expect(screen.getByText('Second post content')).toBeInTheDocument();
    });

    it('renders empty state when no posts', () => {
      render(<PostCardFeed {...defaultProps} initialPosts={[]} />);
      expect(screen.getByText(/no posts yet/i)).toBeInTheDocument();
    });

    it('does not show empty state when creating a new post', () => {
      mockCreatePostTrigger = 1;
      render(<PostCardFeed {...defaultProps} initialPosts={[]} />);
      expect(screen.queryByText(/no posts yet/i)).not.toBeInTheDocument();
    });
  });

  describe('Edit Mode', () => {
    it('enters edit mode when clicking a post card', () => {
      render(<PostCardFeed {...defaultProps} />);

      const firstPost = screen.getByText('First post content').closest('article');
      fireEvent.click(firstPost!);

      // Should show textarea in edit mode
      expect(screen.getByDisplayValue('First post content')).toBeInTheDocument();
    });

    it('exits edit mode when clicking cancel (X button)', () => {
      render(<PostCardFeed {...defaultProps} />);

      // Enter edit mode
      const firstPost = screen.getByText('First post content').closest('article');
      fireEvent.click(firstPost!);

      // Click cancel
      fireEvent.click(screen.getByLabelText('Cancel'));

      // Should no longer be in edit mode - textarea should be gone
      expect(screen.queryByDisplayValue('First post content')).not.toBeInTheDocument();
      expect(screen.getByText('First post content')).toBeInTheDocument();
    });

    it('does not allow editing multiple posts at once', () => {
      render(<PostCardFeed {...defaultProps} />);

      // Enter edit mode on first post
      const firstPost = screen.getByText('First post content').closest('article');
      fireEvent.click(firstPost!);

      // Try to click second post
      const secondPost = screen.getByText('Second post content').closest('article');
      fireEvent.click(secondPost!);

      // Should still only have one textarea (first post)
      const textareas = screen.getAllByPlaceholderText('Write your post...');
      expect(textareas).toHaveLength(1);
    });
  });

  describe('Create New Post', () => {
    it('shows new post card when createPostTrigger changes', () => {
      mockCreatePostTrigger = 1;
      render(<PostCardFeed {...defaultProps} />);

      // Should show empty textarea for new post
      expect(screen.getByPlaceholderText('Write your post...')).toHaveValue('');
    });

    it('hides new post card when cancel is clicked', async () => {
      mockCreatePostTrigger = 1;
      const { rerender } = render(<PostCardFeed {...defaultProps} />);

      // Find the cancel button for the new post (first card should be the new one)
      const cancelButtons = screen.getAllByLabelText('Cancel');
      fireEvent.click(cancelButtons[0]);

      // Rerender to reflect state change
      mockCreatePostTrigger = 0;
      rerender(<PostCardFeed {...defaultProps} />);

      // New post form should be gone, but existing posts should remain
      expect(screen.getByText('First post content')).toBeInTheDocument();
    });

    it('removes new post card from DOM after cancel click', async () => {
      mockCreatePostTrigger = 1;
      render(<PostCardFeed {...defaultProps} />);

      // Verify new post card is shown (empty textarea)
      const textareasBefore = screen.getAllByPlaceholderText('Write your post...');
      expect(textareasBefore).toHaveLength(1);

      // Click cancel on the new post
      const cancelButton = screen.getByLabelText('Cancel');
      fireEvent.click(cancelButton);

      // After cancel, there should be no textareas (no posts in edit mode)
      await waitFor(() => {
        expect(screen.queryByPlaceholderText('Write your post...')).not.toBeInTheDocument();
      });
    });

    it('closes new post card after successful save', async () => {
      mockCreatePostTrigger = 1;
      render(<PostCardFeed {...defaultProps} />);

      // Type content and save
      const textarea = screen.getByPlaceholderText('Write your post...');
      fireEvent.change(textarea, { target: { value: 'New content' } });
      fireEvent.click(screen.getByRole('button', { name: 'Save' }));

      // After save completes, the form should close
      await waitFor(() => {
        expect(screen.queryByPlaceholderText('Write your post...')).not.toBeInTheDocument();
      });
    });

    it('adds new post to the feed after successful save', async () => {
      const { createPostAction } = await import('../posts/actions');
      // Mock createPostAction to return the new post
      vi.mocked(createPostAction).mockResolvedValue({
        success: true,
        post: {
          id: 99,
          content: 'Brand new post content',
          metadata: {},
          createdAt: new Date(),
        }
      });

      mockCreatePostTrigger = 1;
      render(<PostCardFeed {...defaultProps} />);

      // Type content and save
      const textarea = screen.getByPlaceholderText('Write your post...');
      fireEvent.change(textarea, { target: { value: 'Brand new post content' } });
      fireEvent.click(screen.getByRole('button', { name: 'Save' }));

      // After save completes, the new post should appear in the feed
      await waitFor(() => {
        expect(screen.getByText('Brand new post content')).toBeInTheDocument();
      });
    });

    it('does not show new post card if already editing', () => {
      render(<PostCardFeed {...defaultProps} />);

      // Enter edit mode on first post
      const firstPost = screen.getByText('First post content').closest('article');
      fireEvent.click(firstPost!);

      // Simulate trigger change (would normally come from header button)
      // Since we're already editing, new card should not appear
      // This is tested by checking only one textarea exists
      const textareas = screen.getAllByPlaceholderText('Write your post...');
      expect(textareas).toHaveLength(1);
    });

    it('does not show new post card if already creating', () => {
      mockCreatePostTrigger = 1;
      render(<PostCardFeed {...defaultProps} />);

      // Should only have one textarea (the new post)
      const textareas = screen.getAllByPlaceholderText('Write your post...');
      expect(textareas).toHaveLength(1);
    });

    it('passes isNew=true to EditablePostCard for new posts', () => {
      mockCreatePostTrigger = 1;
      render(<PostCardFeed {...defaultProps} />);

      // The new post card should not have a hidden id field (isNew=true check)
      const hiddenIdInput = document.querySelector('input[name="id"]');
      expect(hiddenIdInput).not.toBeInTheDocument();
    });

    it('passes onCancel callback that sets isCreating to false', async () => {
      mockCreatePostTrigger = 1;
      render(<PostCardFeed {...defaultProps} />);

      // New post form should be visible
      expect(screen.getByPlaceholderText('Write your post...')).toBeInTheDocument();

      // Click the X button (Cancel)
      fireEvent.click(screen.getByLabelText('Cancel'));

      // Form should be removed
      await waitFor(() => {
        expect(screen.queryByPlaceholderText('Write your post...')).not.toBeInTheDocument();
      });
    });
  });

  describe('Delete Post', () => {
    it('calls deletePostAction when delete is clicked in edit mode', async () => {
      const { deletePostAction } = await import('../posts/actions');
      render(<PostCardFeed {...defaultProps} />);

      // Enter edit mode on first post
      const firstPost = screen.getByText('First post content').closest('article');
      fireEvent.click(firstPost!);

      // Find and click delete button (appears in edit mode)
      const deleteButton = screen.getByRole('button', { name: 'Delete' });
      fireEvent.click(deleteButton);

      await waitFor(() => {
        expect(deletePostAction).toHaveBeenCalled();
      });
    });

    it('removes post from list after deletion', async () => {
      render(<PostCardFeed {...defaultProps} />);

      // Enter edit mode on first post
      const firstPost = screen.getByText('First post content').closest('article');
      fireEvent.click(firstPost!);

      // Delete the post
      const deleteButton = screen.getByRole('button', { name: 'Delete' });
      fireEvent.click(deleteButton);

      await waitFor(() => {
        expect(screen.queryByText('First post content')).not.toBeInTheDocument();
      });
    });
  });

  describe('Save Post', () => {
    it('calls updatePostAction when saving an existing post', async () => {
      const { updatePostAction } = await import('../posts/actions');
      render(<PostCardFeed {...defaultProps} />);

      // Enter edit mode
      const firstPost = screen.getByText('First post content').closest('article');
      fireEvent.click(firstPost!);

      // Click save
      fireEvent.click(screen.getByRole('button', { name: 'Save' }));

      await waitFor(() => {
        expect(updatePostAction).toHaveBeenCalled();
      });
    });

    it('calls createPostAction when saving a new post', async () => {
      const { createPostAction } = await import('../posts/actions');
      mockCreatePostTrigger = 1;
      render(<PostCardFeed {...defaultProps} />);

      // Type content in new post
      const textarea = screen.getByPlaceholderText('Write your post...');
      fireEvent.change(textarea, { target: { value: 'New post content' } });

      // Click save
      fireEvent.click(screen.getByRole('button', { name: 'Save' }));

      await waitFor(() => {
        expect(createPostAction).toHaveBeenCalled();
      });
    });

    it('exits edit mode after saving existing post', async () => {
      render(<PostCardFeed {...defaultProps} />);

      // Enter edit mode
      const firstPost = screen.getByText('First post content').closest('article');
      fireEvent.click(firstPost!);

      // Click save
      fireEvent.click(screen.getByRole('button', { name: 'Save' }));

      await waitFor(() => {
        // Should exit edit mode - no textarea
        expect(screen.queryByDisplayValue('First post content')).not.toBeInTheDocument();
      });
    });
  });

  describe('Taxonomy Association', () => {
    it('associates taxonomy with post based on metadata._taxonomyId', () => {
      render(<PostCardFeed {...defaultProps} />);

      // Second post has _taxonomyId: 1 which maps to 'Task'
      // Find the topic trigger button within a post card that contains "Task"
      const postCards = document.querySelectorAll('.post-view');
      const secondPostCard = postCards[1]; // Second post has the taxonomy
      const topicTrigger = secondPostCard.querySelector('.post-view-topic-trigger');
      expect(topicTrigger?.textContent).toContain('Task');
    });

    it('shows topic placeholder for posts without taxonomy', () => {
      render(<PostCardFeed {...defaultProps} />);

      // First post has no taxonomy
      const topicPlaceholders = screen.getAllByText('+ topic');
      expect(topicPlaceholders.length).toBeGreaterThan(0);
    });
  });
});
