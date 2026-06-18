import { create } from 'zustand';
import { Post } from '@types/index';
import * as postsService from '@services/posts';

interface FeedState {
  posts: Post[];
  isLoading: boolean;
  error: string | null;
  hasMore: boolean;
  currentPage: number;
  totalCount: number;

  fetchPosts: (page?: number) => Promise<void>;
  createPost: (userId: string, content: string, imageUrl?: string) => Promise<void>;
  toggleLike: (userId: string, postId: string) => Promise<void>;
  refreshFeed: () => Promise<void>;
  setError: (error: string | null) => void;
}

export const useFeedStore = create<FeedState>((set, get) => ({
  posts: [],
  isLoading: false,
  error: null,
  hasMore: true,
  currentPage: 1,
  totalCount: 0,

  fetchPosts: async (page = 1) => {
    set({ isLoading: true, error: null });
    const { posts, totalCount, error } = await postsService.getPosts(page, 20);

    if (error) {
      set({ error: 'Failed to fetch posts', isLoading: false });
      return;
    }

    const state = get();
    const allPosts = page === 1 ? posts : [...state.posts, ...posts];
    const hasMore = allPosts.length < totalCount;

    set({
      posts: allPosts,
      currentPage: page,
      totalCount,
      hasMore,
      isLoading: false,
    });
  },

  createPost: async (userId, content, imageUrl) => {
    set({ isLoading: true, error: null });
    const { post, error } = await postsService.createPost(userId, content, imageUrl);

    if (error) {
      set({ error: 'Failed to create post', isLoading: false });
      return;
    }

    const state = get();
    set({
      posts: post ? [post, ...state.posts] : state.posts,
      isLoading: false,
    });
  },

  toggleLike: async (userId, postId) => {
    const { liked, error } = await postsService.togglePostLike(userId, postId);

    if (error) {
      set({ error: 'Failed to toggle like' });
      return;
    }

    const state = get();
    const updatedPosts = state.posts.map((post) =>
      post.id === postId
        ? {
            ...post,
            likes_count: liked ? post.likes_count + 1 : post.likes_count - 1,
            liked_by_me: liked,
          }
        : post
    );

    set({ posts: updatedPosts });
  },

  refreshFeed: async () => {
    await get().fetchPosts(1);
  },

  setError: (error) => set({ error }),
}));
