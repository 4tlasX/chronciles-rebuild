'use client';

import { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import type { Post, Taxonomy } from '@/lib/db';
import { EditablePostCard } from '@/components/post';
import { TopicSidebar } from '@/components/topic';
import { SearchSidebar } from '@/components/search';
import { loadMorePostsAction, createPostAction, updatePostAction, deletePostAction } from './posts/actions';
import { createTopicAction, updateTopicAction, deleteTopicAction } from './topics/actions';
import { useUIStore } from '@/stores';

interface PostCardFeedProps {
  initialPosts: Post[];
  taxonomies: Taxonomy[];
  hasMore: boolean;
}

export function PostCardFeed({
  initialPosts,
  taxonomies: initialTaxonomies,
  hasMore: initialHasMore,
}: PostCardFeedProps) {
  const [posts, setPosts] = useState<Post[]>(initialPosts);
  const [taxonomies, setTaxonomies] = useState<Taxonomy[]>(initialTaxonomies);
  const [editingPostId, setEditingPostId] = useState<number | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(initialHasMore);

  const loadMoreRef = useRef<HTMLDivElement>(null);
  const lastTriggerRef = useRef(0);

  // Listen for create post trigger from header button
  const createPostTrigger = useUIStore((state) => state.createPostTrigger);
  const selectedTopicId = useUIStore((state) => state.selectedTopicId);

  // Sidebar states for content displacement
  const isTopicSidebarOpen = useUIStore((state) => state.isTopicSidebarOpen);
  const isSearchSidebarOpen = useUIStore((state) => state.isSearchSidebarOpen);
  const isSidebarOpen = isTopicSidebarOpen || isSearchSidebarOpen;

  // Search filters
  const searchKeyword = useUIStore((state) => state.searchKeyword);
  const searchDateFrom = useUIStore((state) => state.searchDateFrom);
  const searchDateTo = useUIStore((state) => state.searchDateTo);

  useEffect(() => {
    // Only trigger if this is a NEW trigger (different from last one we handled)
    if (createPostTrigger > lastTriggerRef.current && !isCreating && editingPostId === null) {
      lastTriggerRef.current = createPostTrigger;
      setIsCreating(true);
    }
  }, [createPostTrigger, isCreating, editingPostId]);

  // Taxonomy lookup helper
  const getTaxonomyForPost = useCallback(
    (post: Post): Taxonomy | null => {
      const taxonomyId = post.metadata?._taxonomyId as number | undefined;
      if (!taxonomyId) return null;
      return taxonomies.find((t) => t.id === taxonomyId) || null;
    },
    [taxonomies]
  );

  // Filter posts by selected topic and search criteria
  const filteredPosts = useMemo(() => {
    return posts.filter((post) => {
      // Filter by topic
      if (selectedTopicId !== null) {
        const taxonomyId = post.metadata?._taxonomyId as number | undefined;
        if (taxonomyId !== selectedTopicId) return false;
      }

      // Filter by keyword (searches content and metadata)
      if (searchKeyword) {
        const keyword = searchKeyword.toLowerCase();
        const contentMatch = post.content?.toLowerCase().includes(keyword);
        const metadataMatch = post.metadata
          ? JSON.stringify(post.metadata).toLowerCase().includes(keyword)
          : false;
        if (!contentMatch && !metadataMatch) return false;
      }

      // Filter by date range
      if (searchDateFrom || searchDateTo) {
        const postDate = new Date(post.createdAt);
        if (searchDateFrom) {
          const fromDate = new Date(searchDateFrom);
          if (postDate < fromDate) return false;
        }
        if (searchDateTo) {
          const toDate = new Date(searchDateTo);
          toDate.setHours(23, 59, 59, 999); // Include the entire end date
          if (postDate > toDate) return false;
        }
      }

      return true;
    });
  }, [posts, selectedTopicId, searchKeyword, searchDateFrom, searchDateTo]);

  // Calculate post counts per topic
  const postCounts = useMemo(() => {
    const counts: Record<number, number> = {};
    posts.forEach((post) => {
      const taxonomyId = post.metadata?._taxonomyId as number | undefined;
      if (taxonomyId) {
        counts[taxonomyId] = (counts[taxonomyId] || 0) + 1;
      }
    });
    return counts;
  }, [posts]);

  // Load more posts (infinite scroll)
  const loadMore = useCallback(async () => {
    if (isLoadingMore || !hasMore) return;

    setIsLoadingMore(true);
    const result = await loadMorePostsAction(posts.length);

    if (!result.error && result.posts.length > 0) {
      setPosts((prev) => [...prev, ...result.posts]);
      setHasMore(result.hasMore);
    }
    setIsLoadingMore(false);
  }, [posts.length, isLoadingMore, hasMore]);

  // IntersectionObserver for infinite scroll
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !isLoadingMore) {
          loadMore();
        }
      },
      { threshold: 0.1 }
    );

    if (loadMoreRef.current) {
      observer.observe(loadMoreRef.current);
    }

    return () => observer.disconnect();
  }, [hasMore, isLoadingMore, loadMore]);

  // Handle card click
  const handleCardClick = (postId: number) => {
    if (editingPostId !== null || isCreating) return;
    setEditingPostId(postId);
  };

  // Handle edit save
  const handleSave = async (formData: FormData) => {
    const result = await updatePostAction(formData);
    if (result.success && result.post) {
      setPosts((prev) =>
        prev.map((p) => (p.id === result.post!.id ? result.post! : p))
      );
    }
    setEditingPostId(null);
  };

  // Handle new post save
  const handleCreateSave = async (formData: FormData) => {
    const result = await createPostAction(formData);
    if (result.success && result.post) {
      setPosts((prev) => [result.post!, ...prev]);
    }
    setIsCreating(false);
  };

  // Handle create cancel
  const handleCreateCancel = () => {
    setIsCreating(false);
  };

  // Handle delete
  const handleDelete = async (postId: number) => {
    const formData = new FormData();
    formData.set('id', String(postId));
    await deletePostAction(formData);
    setPosts((prev) => prev.filter((p) => p.id !== postId));
    setEditingPostId(null);
  };

  // Topic sidebar handlers
  const handleCreateTopic = async (formData: FormData) => {
    const result = await createTopicAction(formData);
    if (result.success) {
      // Refresh taxonomies - for now just add a placeholder, ideally would refetch
      const name = formData.get('name') as string;
      const icon = formData.get('icon') as string;
      const newTaxonomy: Taxonomy = {
        id: Date.now(), // Temporary ID
        name,
        icon: icon || null,
        color: null,
      };
      setTaxonomies((prev) => [...prev, newTaxonomy]);
    }
    return result;
  };

  const handleUpdateTopic = async (formData: FormData) => {
    const result = await updateTopicAction(formData);
    if (result.success) {
      const id = parseInt(formData.get('id') as string, 10);
      const name = formData.get('name') as string;
      const icon = formData.get('icon') as string;
      setTaxonomies((prev) =>
        prev.map((t) =>
          t.id === id ? { ...t, name: name || t.name, icon: icon || t.icon } : t
        )
      );
    }
    return result;
  };

  const handleDeleteTopic = async (formData: FormData) => {
    const result = await deleteTopicAction(formData);
    if (result.success) {
      const id = parseInt(formData.get('id') as string, 10);
      setTaxonomies((prev) => prev.filter((t) => t.id !== id));
    }
    return result;
  };

  // Get selected topic name for empty state
  const selectedTopic = selectedTopicId
    ? taxonomies.find((t) => t.id === selectedTopicId)
    : null;

  return (
    <div className={`post-card-feed-container ${isSidebarOpen ? 'sidebar-open' : ''}`}>
      <TopicSidebar
        taxonomies={taxonomies}
        postCounts={postCounts}
        onCreateTopic={handleCreateTopic}
        onUpdateTopic={handleUpdateTopic}
        onDeleteTopic={handleDeleteTopic}
      />
      <SearchSidebar />

      <div className="post-card-feed">
        {/* New post card (triggered by header button) */}
        {isCreating && (
          <div className="post-card-wrapper editing">
            <EditablePostCard
              post={{
                id: -1,
                content: '',
                metadata: {},
                createdAt: new Date(),
              }}
              taxonomy={null}
              taxonomies={taxonomies}
              isEditing={true}
              isNew={true}
              onStartEdit={() => {}}
              onSave={handleCreateSave}
              onDelete={() => {}}
              onCancel={handleCreateCancel}
            />
          </div>
        )}

        {/* Post cards */}
        {filteredPosts.map((post) => (
          <div
            key={post.id}
            className={`post-card-wrapper ${editingPostId === post.id ? 'editing' : ''}`}
          >
            <EditablePostCard
              post={post}
              taxonomy={getTaxonomyForPost(post)}
              taxonomies={taxonomies}
              isEditing={editingPostId === post.id}
              onStartEdit={() => handleCardClick(post.id)}
              onSave={handleSave}
              onDelete={handleDelete}
              onCancelEdit={() => setEditingPostId(null)}
            />
          </div>
        ))}

        {/* Infinite scroll trigger */}
        {hasMore && (
          <div ref={loadMoreRef} className="load-more-trigger">
            {isLoadingMore && <div className="load-more-spinner" />}
          </div>
        )}

        {/* Empty state */}
        {filteredPosts.length === 0 && !isCreating && (
          <div className="empty-state">
            {selectedTopic ? (
              <p>No posts with topic "{selectedTopic.name}" yet.</p>
            ) : (
              <p>No posts yet. Click the button above to create your first post.</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
