import supabase from './supabase';
import { Leaderboard, Achievement } from '@types/index';

/**
 * Get global leaderboard
 */
export async function getLeaderboard(limit: number = 50, offset: number = 0) {
  try {
    const { data, error } = await supabase
      .from('user_profiles')
      .select('user_id, username, avatar_url, points, level')
      .order('points', { ascending: false })
      .range(offset, offset + limit - 1);

    if (error) throw error;

    const leaderboard: Leaderboard[] = data.map((item, idx) => ({
      rank: offset + idx + 1,
      user_id: item.user_id,
      username: item.username,
      avatar_url: item.avatar_url,
      points: item.points,
      level: item.level,
    }));

    return { leaderboard, error: null };
  } catch (error) {
    return { leaderboard: [], error };
  }
}

/**
 * Get user's rank and stats
 */
export async function getUserRank(userId: string) {
  try {
    const { data: userProfile, error: getError } = await supabase
      .from('user_profiles')
      .select('points, level')
      .eq('user_id', userId)
      .single();

    if (getError) throw getError;

    // Count users with more points
    const { count, error: countError } = await supabase
      .from('user_profiles')
      .select('*', { count: 'exact', head: true })
      .gt('points', userProfile.points);

    if (countError) throw countError;

    return {
      rank: (count || 0) + 1,
      points: userProfile.points,
      level: userProfile.level,
      error: null,
    };
  } catch (error) {
    return { rank: 0, points: 0, level: 0, error };
  }
}

/**
 * Get user achievements
 */
export async function getUserAchievements(userId: string) {
  try {
    const { data, error } = await supabase
      .from('achievements')
      .select('*')
      .eq('user_id', userId)
      .order('unlocked_at', { ascending: false });

    if (error) throw error;

    return { achievements: data as Achievement[], error: null };
  } catch (error) {
    return { achievements: [], error };
  }
}

/**
 * Unlock achievement for user
 */
export async function unlockAchievement(userId: string, name: string, description: string) {
  try {
    // Check if already unlocked
    const { data: existing } = await supabase
      .from('achievements')
      .select('id')
      .eq('user_id', userId)
      .eq('name', name)
      .single();

    if (existing) {
      return { achievement: existing, error: null };
    }

    // Create achievement
    const { data, error } = await supabase
      .from('achievements')
      .insert([
        {
          user_id: userId,
          name,
          description,
          badge_icon: `badge_${name.toLowerCase().replace(/\s+/g, '_')}`,
        },
      ])
      .select()
      .single();

    if (error) throw error;

    return { achievement: data as Achievement, error: null };
  } catch (error) {
    return { achievement: null, error };
  }
}
