import { useEffect } from 'react';
import supabase from '@services/supabase';
import { useFeedStore } from '@store/feedStore';

export function useRealtimePosts() {
  const { posts, fetchPosts } = useFeedStore();

  useEffect(() => {
    // Subscribe to post changes
    const subscription = supabase
      .from('posts')
      .on('*', (payload) => {
        if (payload.eventType === 'INSERT') {
          // New post created - refresh feed
          fetchPosts(1);
        } else if (payload.eventType === 'UPDATE') {
          // Post updated (likes, comments) - refresh
          fetchPosts(1);
        }
      })
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  return { posts };
}
