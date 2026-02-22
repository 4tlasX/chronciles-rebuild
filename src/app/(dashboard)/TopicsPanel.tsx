'use client';

import { useState } from 'react';
import type { Post, Taxonomy } from '@/lib/db';
import { TopicListItem, TopicIcon, TopicForm } from '@/components/topic';
import { PostListItem, PostView, PostForm } from '@/components/post';
import { createTopicAction, updateTopicAction, deleteTopicAction } from './topics/actions';
import { updatePostAction, deletePostAction } from './posts/actions';

interface TopicsPanelProps {
  topics: Taxonomy[];
  posts: Post[];
}

export function TopicsPanel({ topics, posts }: TopicsPanelProps) {
  const [selectedTopicId, setSelectedTopicId] = useState<number | null>(
    topics.length > 0 ? topics[0].id : null
  );
  const [selectedPostId, setSelectedPostId] = useState<number | null>(null);
  const [isCreatingTopic, setIsCreatingTopic] = useState(false);
  const [editingTopicId, setEditingTopicId] = useState<number | null>(null);
  const [isEditingPost, setIsEditingPost] = useState(false);

  const selectedTopic = topics.find((t) => t.id === selectedTopicId);

  // Get posts for selected topic (filter by _taxonomyId in metadata)
  const topicPosts = selectedTopicId
    ? posts.filter((p) => p.metadata?._taxonomyId === selectedTopicId)
    : [];

  const selectedPost = topicPosts.find((p) => p.id === selectedPostId);

  // Get post counts per topic
  const getPostCount = (topicId: number) => {
    return posts.filter((p) => p.metadata?._taxonomyId === topicId).length;
  };

  const handleTopicSelect = (topicId: number) => {
    setSelectedTopicId(topicId);
    setSelectedPostId(null);
    setEditingTopicId(null);
  };

  const handlePostSelect = (postId: number) => {
    setSelectedPostId(postId);
    setIsEditingPost(false);
  };

  const handleCreateTopic = async (formData: FormData) => {
    await createTopicAction(formData);
    setIsCreatingTopic(false);
  };

  const handleUpdateTopic = async (formData: FormData) => {
    await updateTopicAction(formData);
    setEditingTopicId(null);
  };

  const handleDeleteTopic = async () => {
    if (!selectedTopic) return;
    const formData = new FormData();
    formData.set('id', String(selectedTopic.id));
    await deleteTopicAction(formData);
    setSelectedTopicId(topics.length > 1 ? topics.find(t => t.id !== selectedTopic.id)?.id ?? null : null);
  };

  const editingTopic = editingTopicId ? topics.find(t => t.id === editingTopicId) : null;

  const handleUpdatePost = async (formData: FormData) => {
    await updatePostAction(formData);
    setIsEditingPost(false);
  };

  const handleDeletePost = async () => {
    if (!selectedPost) return;
    const formData = new FormData();
    formData.set('id', String(selectedPost.id));
    await deletePostAction(formData);
    setSelectedPostId(null);
    setIsEditingPost(false);
  };

  return (
    <div className="panel-layout panel-layout-three">
      {/* Topics Sidebar */}
      <div className="panel panel-sidebar">
        <div className="panel-header">
          <h2>Topics</h2>
          <button
            className="panel-header-btn"
            onClick={() => setIsCreatingTopic(true)}
            title="New Topic"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="12" y1="5" x2="12" y2="19" />
              <line x1="5" y1="12" x2="19" y2="12" />
            </svg>
          </button>
        </div>

        {isCreatingTopic && (
          <div className="panel-form-inline">
            <TopicForm
              onSubmit={handleCreateTopic}
              onCancel={() => setIsCreatingTopic(false)}
              submitLabel="Create"
            />
          </div>
        )}

        <div className="panel-content">
          {topics.length === 0 && !isCreatingTopic ? (
            <div className="empty-state">
              <p>No topics yet</p>
            </div>
          ) : (
            topics.map((topic) => (
              <TopicListItem
                key={topic.id}
                topic={topic}
                postCount={getPostCount(topic.id)}
                isActive={topic.id === selectedTopicId}
                onClick={() => handleTopicSelect(topic.id)}
              />
            ))
          )}
        </div>
      </div>

      {/* Posts List for Selected Topic */}
      <div className="panel panel-list">
        {selectedTopic ? (
          <>
            <div className="panel-header">
              <div className="panel-header-topic">
                <TopicIcon icon={selectedTopic.icon} size="md" />
                <h2>{selectedTopic.name}</h2>
              </div>
              <div className="panel-header-actions">
                <button
                  className="panel-header-btn"
                  onClick={() => setEditingTopicId(selectedTopic.id)}
                  title="Edit Topic"
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                  </svg>
                </button>
                <button
                  className="panel-header-btn panel-header-btn-danger"
                  onClick={handleDeleteTopic}
                  title="Delete Topic"
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="3 6 5 6 21 6" />
                    <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                  </svg>
                </button>
              </div>
            </div>

            {editingTopic && (
              <div className="panel-form-inline">
                <TopicForm
                  topic={editingTopic}
                  onSubmit={handleUpdateTopic}
                  onCancel={() => setEditingTopicId(null)}
                  submitLabel="Save"
                />
              </div>
            )}

            <div className="panel-content">
              {topicPosts.length === 0 ? (
                <div className="empty-state">
                  <p>No posts with this topic</p>
                </div>
              ) : (
                topicPosts.map((post) => (
                  <PostListItem
                    key={post.id}
                    post={post}
                    taxonomy={selectedTopic}
                    isActive={post.id === selectedPostId}
                    onClick={() => handlePostSelect(post.id)}
                  />
                ))
              )}
            </div>
          </>
        ) : (
          <div className="panel-content">
            <div className="empty-state">
              <p>Select a topic to view posts</p>
            </div>
          </div>
        )}
      </div>

      {/* Post Content Panel */}
      <div className="panel panel-content-area">
        {selectedPost ? (
          <>
            {isEditingPost ? (
              <div className="panel-body panel-body-padded">
                <PostForm
                  post={selectedPost}
                  taxonomies={topics}
                  initialTaxonomyId={selectedTopicId}
                  onSubmit={handleUpdatePost}
                  onCancel={() => setIsEditingPost(false)}
                  submitLabel="Save"
                />
              </div>
            ) : (
              <div className="panel-body">
                <PostView post={selectedPost} taxonomy={selectedTopic} />
              </div>
            )}
            {!isEditingPost && (
              <div className="panel-actions">
                <button
                  className="panel-action-btn"
                  onClick={() => setIsEditingPost(true)}
                >
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                  </svg>
                  Edit
                </button>
                <button
                  className="panel-action-btn panel-action-btn-danger"
                  onClick={handleDeletePost}
                >
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="3 6 5 6 21 6" />
                    <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                  </svg>
                  Delete
                </button>
              </div>
            )}
          </>
        ) : (
          <div className="panel-content">
            <div className="empty-state">
              <p>{selectedTopic ? 'Select a post to view' : 'Select a topic first'}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
