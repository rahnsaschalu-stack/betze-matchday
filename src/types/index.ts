// User Types
export type User = {
  id: string;
  email: string;
  username: string;
  avatar_url?: string;
  bio?: string;
  created_at: string;
  updated_at: string;
};

export type UserProfile = {
  id: string;
  user_id: string;
  username: string;
  display_name: string;
  avatar_url?: string;
  bio?: string;
  points: number;
  level: number;
  created_at: string;
  updated_at: string;
};

// Post Types
export type Post = {
  id: string;
  user_id: string;
  content: string;
  image_url?: string;
  likes_count: number;
  comments_count: number;
  created_at: string;
  updated_at: string;
  user?: UserProfile;
  liked_by_me?: boolean;
};

export type PostComment = {
  id: string;
  post_id: string;
  user_id: string;
  content: string;
  created_at: string;
  updated_at: string;
  user?: UserProfile;
};

// Checkin Types
export type Checkin = {
  id: string;
  user_id: string;
  latitude: number;
  longitude: number;
  distance_from_stadium: number;
  is_at_stadium: boolean;
  checked_in_at: string;
  created_at: string;
};

// Gamification Types
export type Achievement = {
  id: string;
  user_id: string;
  name: string;
  description: string;
  badge_icon: string;
  unlocked_at: string;
};

export type Leaderboard = {
  rank: number;
  user_id: string;
  username: string;
  avatar_url?: string;
  points: number;
  level: number;
};

// Matchday Types
export type Match = {
  id: string;
  date: string;
  opponent: string;
  location: string;
  status: 'scheduled' | 'live' | 'finished';
  home_score?: number;
  away_score?: number;
  created_at: string;
};

export type MatchEvent = {
  id: string;
  match_id: string;
  event_type: 'kickoff' | 'goal' | 'card' | 'substitution' | 'fulltime';
  minute: number;
  description: string;
  created_at: string;
};

// Notification Types
export type Notification = {
  id: string;
  user_id: string;
  title: string;
  body: string;
  type: 'match' | 'achievement' | 'social' | 'system';
  data?: Record<string, any>;
  read: boolean;
  created_at: string;
};

// Location Type
export type LocationCoords = {
  latitude: number;
  longitude: number;
  accuracy?: number;
  altitude?: number;
  heading?: number;
  speed?: number;
};
