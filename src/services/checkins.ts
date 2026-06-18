import supabase from './supabase';
import { Checkin, LocationCoords } from '@types/index';

const STADIUM_LAT = parseFloat(process.env.EXPO_PUBLIC_STADIUM_LAT || '49.4461');
const STADIUM_LNG = parseFloat(process.env.EXPO_PUBLIC_STADIUM_LNG || '7.7640');
const STADIUM_RADIUS = parseFloat(process.env.EXPO_PUBLIC_STADIUM_RADIUS || '500');

/**
 * Calculate distance between two coordinates (Haversine formula)
 */
function calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371; // Earth's radius in km
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c * 1000; // Distance in meters
}

/**
 * Check if user is at stadium
 */
export function isAtStadium(coords: LocationCoords): boolean {
  const distance = calculateDistance(coords.latitude, coords.longitude, STADIUM_LAT, STADIUM_LNG);
  return distance <= STADIUM_RADIUS;
}

/**
 * Record a checkin
 */
export async function createCheckin(userId: string, coords: LocationCoords) {
  try {
    const distance = calculateDistance(coords.latitude, coords.longitude, STADIUM_LAT, STADIUM_LNG);
    const isAtStadiumFlag = distance <= STADIUM_RADIUS;

    const { data, error } = await supabase
      .from('checkins')
      .insert([
        {
          user_id: userId,
          latitude: coords.latitude,
          longitude: coords.longitude,
          distance_from_stadium: distance,
          is_at_stadium: isAtStadiumFlag,
        },
      ])
      .select()
      .single();

    if (error) throw error;

    // Award points if at stadium
    if (isAtStadiumFlag) {
      await addUserPoints(userId, 10, 'Stadium Checkin');
    }

    return { checkin: data as Checkin, error: null };
  } catch (error) {
    return { checkin: null, error };
  }
}

/**
 * Get user's recent checkins
 */
export async function getUserCheckins(userId: string, limit: number = 10) {
  try {
    const { data, error } = await supabase
      .from('checkins')
      .select('*')
      .eq('user_id', userId)
      .order('checked_in_at', { ascending: false })
      .limit(limit);

    if (error) throw error;

    return { checkins: data as Checkin[], error: null };
  } catch (error) {
    return { checkins: [], error };
  }
}

/**
 * Add points to user profile
 */
async function addUserPoints(userId: string, points: number, reason: string) {
  try {
    // Get current points
    const { data: profile, error: getError } = await supabase
      .from('user_profiles')
      .select('points, level')
      .eq('user_id', userId)
      .single();

    if (getError) throw getError;

    const newPoints = profile.points + points;
    const newLevel = Math.floor(newPoints / 100) + 1;

    // Update profile
    const { error: updateError } = await supabase
      .from('user_profiles')
      .update({ points: newPoints, level: newLevel })
      .eq('user_id', userId);

    if (updateError) throw updateError;

    // Log activity
    await supabase.from('user_activities').insert([
      {
        user_id: userId,
        activity_type: 'points_earned',
        points,
        reason,
      },
    ]);

    return { error: null };
  } catch (error) {
    return { error };
  }
}
