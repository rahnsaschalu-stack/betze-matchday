-- Enable Row Level Security
ALTER TABLE public.user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.post_likes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.post_comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.checkins ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.achievements ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_activities ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.matches ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.match_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.push_tokens ENABLE ROW LEVEL SECURITY;

-- User Profiles Policies
CREATE POLICY "Users can read all profiles"
  ON public.user_profiles
  FOR SELECT
  USING (true);

CREATE POLICY "Users can update own profile"
  ON public.user_profiles
  FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can insert own profile"
  ON public.user_profiles
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Posts Policies
CREATE POLICY "Posts are readable by all"
  ON public.posts
  FOR SELECT
  USING (true);

CREATE POLICY "Users can create posts"
  ON public.posts
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own posts"
  ON public.posts
  FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own posts"
  ON public.posts
  FOR DELETE
  USING (auth.uid() = user_id);

-- Post Likes Policies
CREATE POLICY "Likes are readable by all"
  ON public.post_likes
  FOR SELECT
  USING (true);

CREATE POLICY "Users can like posts"
  ON public.post_likes
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can unlike posts"
  ON public.post_likes
  FOR DELETE
  USING (auth.uid() = user_id);

-- Post Comments Policies
CREATE POLICY "Comments are readable by all"
  ON public.post_comments
  FOR SELECT
  USING (true);

CREATE POLICY "Users can comment"
  ON public.post_comments
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own comments"
  ON public.post_comments
  FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own comments"
  ON public.post_comments
  FOR DELETE
  USING (auth.uid() = user_id);

-- Checkins Policies
CREATE POLICY "Users can read all checkins"
  ON public.checkins
  FOR SELECT
  USING (true);

CREATE POLICY "Users can create own checkins"
  ON public.checkins
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can read own checkins"
  ON public.checkins
  FOR SELECT
  USING (auth.uid() = user_id OR true);

-- Achievements Policies
CREATE POLICY "Users can read all achievements"
  ON public.achievements
  FOR SELECT
  USING (true);

CREATE POLICY "Users can insert own achievements"
  ON public.achievements
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- User Activities Policies
CREATE POLICY "Users can read own activities"
  ON public.user_activities
  FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own activities"
  ON public.user_activities
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Matches Policies
CREATE POLICY "Matches are readable by all"
  ON public.matches
  FOR SELECT
  USING (true);

-- Match Events Policies
CREATE POLICY "Match events are readable by all"
  ON public.match_events
  FOR SELECT
  USING (true);

-- Notifications Policies
CREATE POLICY "Users can read own notifications"
  ON public.notifications
  FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can update own notifications"
  ON public.notifications
  FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Push Tokens Policies
CREATE POLICY "Users can manage own push tokens"
  ON public.push_tokens
  FOR ALL
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);
