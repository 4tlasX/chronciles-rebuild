'use client';

import { useState } from 'react';
import type { Post, Taxonomy } from '@/lib/db';
import { PostListItem, PostView } from '@/components/post';
import { PostCreateForm } from './posts/PostCreateForm';
import { PostEditForm } from './posts/PostEditForm';
import { deletePostAction } from './posts/actions';

interface PostsPanelProps {
  posts: Post[];
  taxonomies: Taxonomy[];
}

export function PostsPanel({ posts, taxonomies }: PostsPanelProps) {
  const [selectedPostId, setSelectedPostId] = useState<number | null>(
    posts.length > 0 ? posts[0].id : null
  );
  const [isEditing, setIsEditing] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const selectedPost = posts.find((p) => p.id === selectedPostId);

  // Helper to get taxonomy for a post from metadata._taxonomyId
  const getTaxonomyForPost = (post: Post): Taxonomy | null => {
    const taxonomyId = post.metadata?._taxonomyId as number | undefined;
    if (!taxonomyId) return null;
    return taxonomies.find((t) => t.id === taxonomyId) || null;
  };

  const selectedPostTaxonomy = selectedPost ? getTaxonomyForPost(selectedPost) : null;

  const handlePostSelect = (postId: number) => {
    setSelectedPostId(postId);
    setIsEditing(false);
  };

  const handleNewPost = () => {
    setSelectedPostId(null);
    setIsEditing(true);
  };

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
  };

  const handleDelete = async () => {
    if (!selectedPost || isDeleting) return;

    setIsDeleting(true);
    const formData = new FormData();
    formData.set('id', String(selectedPost.id));
    await deletePostAction(formData);
    setIsDeleting(false);
    setSelectedPostId(posts.length > 1 ? posts.find(p => p.id !== selectedPost.id)?.id ?? null : null);
  };

  return (
    <div className="panel-layout">
      {/* Posts List Panel */}
      <div className="panel panel-list">
        <div className="panel-header">
          <h2>Posts</h2>
          <button
            className="panel-header-btn"
            onClick={handleNewPost}
            title="New Post"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="12" y1="5" x2="12" y2="19" />
              <line x1="5" y1="12" x2="19" y2="12" />
            </svg>
          </button>
        </div>
        <div className="panel-content">
          {posts.length === 0 ? (
            <div className="empty-state">
              <p>No posts yet</p>
            </div>
          ) : (
            posts.map((post) => (
              <PostListItem
                key={post.id}
                post={post}
                taxonomy={getTaxonomyForPost(post)}
                isActive={post.id === selectedPostId}
                onClick={() => handlePostSelect(post.id)}
              />
            ))
          )}
        </div>
      </div>

      {/* Content Panel */}
      <div className="panel panel-content-area">
        {selectedPost && !isEditing ? (
          <>
            <div className="panel-body">
              <PostView post={selectedPost} taxonomy={selectedPostTaxonomy} />
            </div>
            <div className="panel-actions">
              <button className="panel-action-btn" onClick={handleEdit}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                  <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                </svg>
                Edit
              </button>
              <button
                className="panel-action-btn panel-action-btn-danger"
                onClick={handleDelete}
                disabled={isDeleting}
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="3 6 5 6 21 6" />
                  <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                </svg>
                {isDeleting ? 'Deleting...' : 'Delete'}
              </button>
            </div>
          </>
        ) : (
          <>
            <div className="panel-header">
              <h2>{selectedPost ? 'Edit Post' : 'New Post'}</h2>
            </div>
            <div className="panel-body panel-body-padded">
              {selectedPost ? (
                <PostEditForm
                  post={selectedPost}
                  taxonomies={taxonomies}
                  inline
                  onCancel={handleCancelEdit}
                />
              ) : (
                <PostCreateForm taxonomies={taxonomies} inline />
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
