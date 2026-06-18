import supabase from './supabase';
import { Post, PostComment } from '@types/index';

/**
 * Fetch paginated posts for feed
 */
export async function getPosts(page: number = 1, limit: number = 20) {
  try {
    const from = (page - 1) * limit;
    const to = from + limit - 1;

    const { data, error, count } = await supabase
      .from('posts')
      .select(
        `
        *,
        user_profiles!posts_user_id_fkey(
          id,
          user_id,
          username,
          display_name,
          avatar_url
        )
      `,
        { count: 'exact' }
      )
      .order('created_at', { ascending: false })
      .range(from, to);

    if (error) throw error;

    return { posts: data as Post[], totalCount: count, error: null };
  } catch (error) {
    return { posts: [], totalCount: 0, error };
  }
}

/**
 * Create new post
 */
export async function createPost(userId: string, content: string, imageUrl?: string) {
  try {
    const { data, error } = await supabase
      .from('posts')
      .insert([
        {
          user_id: userId,
          content,
          image_url: imageUrl,
          likes_count: 0,
          comments_count: 0,
        },
      ])
      .select()
      .single();

    if (error) throw error;

    return { post: data as Post, error: null };
  } catch (error) {
    return { post: null, error };
  }
}

/**
 * Like/Unlike post
 */
export async function togglePostLike(userId: string, postId: string) {
  try {
    const { data: existingLike, error: checkError } = await supabase
      .from('post_likes')
      .select('id')
      .eq('user_id', userId)
      .eq('post_id', postId)
      .single();

    if (existingLike) {
      // Unlike
      const { error } = await supabase
        .from('post_likes')
        .delete()
        .eq('id', existingLike.id);

      if (error) throw error;

      return { liked: false, error: null };
    } else {
      // Like
      const { error } = await supabase.from('post_likes').insert([
        {
          user_id: userId,
          post_id: postId,
        },
      ]);

      if (error && error.code !== 'PGRST116') throw error;

      return { liked: true, error: null };
    }
  } catch (error) {
    return { liked: false, error };
  }
}

/**
 * Get post comments
 */
export async function getPostComments(postId: string) {
  try {
    const { data, error } = await supabase
      .from('post_comments')
      .select(
        `
        *,
        user_profiles!post_comments_user_id_fkey(
          id,
          user_id,
          username,
          display_name,
          avatar_url
        )
      `
      )
      .eq('post_id', postId)
      .order('created_at', { ascending: true });

    if (error) throw error;

    return { comments: data as PostComment[], error: null };
  } catch (error) {
    return { comments: [], error };
  }
}

/**
 * Add comment to post
 */
export async function addPostComment(userId: string, postId: string, content: string) {
  try {
    const { data, error } = await supabase
      .from('post_comments')
      .insert([
        {
          user_id: userId,
          post_id: postId,
          content,
        },
      ])
      .select()
      .single();

    if (error) throw error;

    return { comment: data as PostComment, error: null };
  } catch (error) {
    return { comment: null, error };
  }
}
