-- GolfGrid Row Level Security Policies
-- Created: January 15, 2026
-- These policies ensure users can only access data they're authorized to see

-- ============================================
-- ENABLE RLS ON ALL TABLES
-- ============================================

ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.availability ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.event_participants ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.friendships ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;

-- ============================================
-- USERS TABLE POLICIES
-- ============================================

-- Users can view all profiles (for friend discovery)
CREATE POLICY "Users can view all profiles"
  ON public.users FOR SELECT
  USING (true);

-- Users can only update their own profile
CREATE POLICY "Users can update own profile"
  ON public.users FOR UPDATE
  USING (auth.uid() = id);

-- Users can insert their own profile (on signup)
CREATE POLICY "Users can insert own profile"
  ON public.users FOR INSERT
  WITH CHECK (auth.uid() = id);

-- ============================================
-- AVAILABILITY TABLE POLICIES
-- ============================================

-- Users can view their own availability
CREATE POLICY "Users can view own availability"
  ON public.availability FOR SELECT
  USING (auth.uid() = user_id);

-- Friends can view each other's availability
CREATE POLICY "Friends can view each other's availability"
  ON public.availability FOR SELECT
  USING (
    user_id IN (
      SELECT friend_id FROM public.friendships
      WHERE user_id = auth.uid() AND status = 'accepted'
      UNION
      SELECT user_id FROM public.friendships
      WHERE friend_id = auth.uid() AND status = 'accepted'
    )
  );

-- Users can insert their own availability
CREATE POLICY "Users can insert own availability"
  ON public.availability FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Users can update their own availability
CREATE POLICY "Users can update own availability"
  ON public.availability FOR UPDATE
  USING (auth.uid() = user_id);

-- Users can delete their own availability
CREATE POLICY "Users can delete own availability"
  ON public.availability FOR DELETE
  USING (auth.uid() = user_id);

-- ============================================
-- EVENTS TABLE POLICIES
-- ============================================

-- Users can view events they created
CREATE POLICY "Users can view own events"
  ON public.events FOR SELECT
  USING (auth.uid() = created_by);

-- Users can view events they're participating in
CREATE POLICY "Users can view events they're in"
  ON public.events FOR SELECT
  USING (
    id IN (
      SELECT event_id FROM public.event_participants
      WHERE user_id = auth.uid()
    )
  );

-- Friends can view each other's events
CREATE POLICY "Friends can view each other's events"
  ON public.events FOR SELECT
  USING (
    created_by IN (
      SELECT friend_id FROM public.friendships
      WHERE user_id = auth.uid() AND status = 'accepted'
      UNION
      SELECT user_id FROM public.friendships
      WHERE friend_id = auth.uid() AND status = 'accepted'
    )
  );

-- Users can create events
CREATE POLICY "Users can create events"
  ON public.events FOR INSERT
  WITH CHECK (auth.uid() = created_by);

-- Users can update their own events
CREATE POLICY "Users can update own events"
  ON public.events FOR UPDATE
  USING (auth.uid() = created_by);

-- Users can delete their own events
CREATE POLICY "Users can delete own events"
  ON public.events FOR DELETE
  USING (auth.uid() = created_by);

-- ============================================
-- EVENT PARTICIPANTS TABLE POLICIES
-- ============================================

-- Users can view participants of events they're in or created
CREATE POLICY "Users can view participants of their events"
  ON public.event_participants FOR SELECT
  USING (
    event_id IN (
      SELECT id FROM public.events WHERE created_by = auth.uid()
    )
    OR event_id IN (
      SELECT event_id FROM public.event_participants WHERE user_id = auth.uid()
    )
  );

-- Event creators can add participants
CREATE POLICY "Event creators can add participants"
  ON public.event_participants FOR INSERT
  WITH CHECK (
    event_id IN (
      SELECT id FROM public.events WHERE created_by = auth.uid()
    )
  );

-- Users can join events themselves
CREATE POLICY "Users can join events"
  ON public.event_participants FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Users can update their own participation status
CREATE POLICY "Users can update own participation"
  ON public.event_participants FOR UPDATE
  USING (auth.uid() = user_id);

-- Event creators can update participant status
CREATE POLICY "Event creators can update participants"
  ON public.event_participants FOR UPDATE
  USING (
    event_id IN (
      SELECT id FROM public.events WHERE created_by = auth.uid()
    )
  );

-- Users can leave events
CREATE POLICY "Users can leave events"
  ON public.event_participants FOR DELETE
  USING (auth.uid() = user_id);

-- Event creators can remove participants
CREATE POLICY "Event creators can remove participants"
  ON public.event_participants FOR DELETE
  USING (
    event_id IN (
      SELECT id FROM public.events WHERE created_by = auth.uid()
    )
  );

-- ============================================
-- FRIENDSHIPS TABLE POLICIES
-- ============================================

-- Users can view their own friend requests (sent and received)
CREATE POLICY "Users can view own friendships"
  ON public.friendships FOR SELECT
  USING (auth.uid() = user_id OR auth.uid() = friend_id);

-- Users can send friend requests
CREATE POLICY "Users can send friend requests"
  ON public.friendships FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Users can accept/decline friend requests they received
CREATE POLICY "Users can update friend requests to them"
  ON public.friendships FOR UPDATE
  USING (auth.uid() = friend_id);

-- Users can update their own sent requests (e.g., cancel)
CREATE POLICY "Users can update own sent requests"
  ON public.friendships FOR UPDATE
  USING (auth.uid() = user_id);

-- Users can delete friendships they're part of
CREATE POLICY "Users can delete own friendships"
  ON public.friendships FOR DELETE
  USING (auth.uid() = user_id OR auth.uid() = friend_id);

-- ============================================
-- MESSAGES TABLE POLICIES
-- ============================================

-- Users can view messages sent to them
CREATE POLICY "Users can view messages to them"
  ON public.messages FOR SELECT
  USING (auth.uid() = to_user_id);

-- Users can view messages they sent
CREATE POLICY "Users can view messages they sent"
  ON public.messages FOR SELECT
  USING (auth.uid() = from_user_id);

-- Users can send messages
CREATE POLICY "Users can send messages"
  ON public.messages FOR INSERT
  WITH CHECK (auth.uid() = from_user_id);

-- Users can update messages sent to them (e.g., mark as read)
CREATE POLICY "Users can update messages to them"
  ON public.messages FOR UPDATE
  USING (auth.uid() = to_user_id);

-- Users can delete messages sent to them
CREATE POLICY "Users can delete messages to them"
  ON public.messages FOR DELETE
  USING (auth.uid() = to_user_id);

-- ============================================
-- SECURITY NOTES
-- ============================================

-- These policies ensure:
-- 1. Users can only modify their own data
-- 2. Users can view data relevant to them (friends, events they're in, etc.)
-- 3. Event creators have special permissions for their events
-- 4. Friend relationships are properly secured
-- 5. Messages are private between sender and receiver
