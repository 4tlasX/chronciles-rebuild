import { create } from 'zustand';

interface UIState {
  // Trigger for creating a new post from header
  createPostTrigger: number;
  triggerCreatePost: () => void;

  // Topic sidebar state
  isTopicSidebarOpen: boolean;
  openTopicSidebar: () => void;
  closeTopicSidebar: () => void;
  toggleTopicSidebar: () => void;

  // Topic filtering
  selectedTopicId: number | null;
  setSelectedTopicId: (id: number | null) => void;

  // Topic editing
  editingTopicId: number | null;
  setEditingTopicId: (id: number | null) => void;

  // Topic creation
  isCreatingTopic: boolean;
  setIsCreatingTopic: (creating: boolean) => void;

  // Search sidebar state
  isSearchSidebarOpen: boolean;
  openSearchSidebar: () => void;
  closeSearchSidebar: () => void;
  toggleSearchSidebar: () => void;

  // Search filters
  searchKeyword: string;
  setSearchKeyword: (keyword: string) => void;
  searchDateFrom: string;
  setSearchDateFrom: (date: string) => void;
  searchDateTo: string;
  setSearchDateTo: (date: string) => void;
  clearSearchFilters: () => void;
}

export const useUIStore = create<UIState>((set) => ({
  createPostTrigger: 0,
  triggerCreatePost: () => set((state) => ({ createPostTrigger: state.createPostTrigger + 1 })),

  // Topic sidebar
  isTopicSidebarOpen: false,
  openTopicSidebar: () => set({ isTopicSidebarOpen: true, isSearchSidebarOpen: false }),
  closeTopicSidebar: () => set({ isTopicSidebarOpen: false, editingTopicId: null, isCreatingTopic: false }),
  toggleTopicSidebar: () => set((state) => ({
    isTopicSidebarOpen: !state.isTopicSidebarOpen,
    isSearchSidebarOpen: false,
    editingTopicId: state.isTopicSidebarOpen ? null : state.editingTopicId,
    isCreatingTopic: state.isTopicSidebarOpen ? false : state.isCreatingTopic,
  })),

  // Topic filtering
  selectedTopicId: null,
  setSelectedTopicId: (id) => set({ selectedTopicId: id }),

  // Topic editing
  editingTopicId: null,
  setEditingTopicId: (id) => set({ editingTopicId: id, isCreatingTopic: false }),

  // Topic creation
  isCreatingTopic: false,
  setIsCreatingTopic: (creating) => set({ isCreatingTopic: creating, editingTopicId: null }),

  // Search sidebar
  isSearchSidebarOpen: false,
  openSearchSidebar: () => set({ isSearchSidebarOpen: true, isTopicSidebarOpen: false }),
  closeSearchSidebar: () => set({ isSearchSidebarOpen: false }),
  toggleSearchSidebar: () => set((state) => ({
    isSearchSidebarOpen: !state.isSearchSidebarOpen,
    isTopicSidebarOpen: false,
  })),

  // Search filters
  searchKeyword: '',
  setSearchKeyword: (keyword) => set({ searchKeyword: keyword }),
  searchDateFrom: '',
  setSearchDateFrom: (date) => set({ searchDateFrom: date }),
  searchDateTo: '',
  setSearchDateTo: (date) => set({ searchDateTo: date }),
  clearSearchFilters: () => set({ searchKeyword: '', searchDateFrom: '', searchDateTo: '' }),
}));
