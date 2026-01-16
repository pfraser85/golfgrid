-- Fix the two remaining unrestricted tables
-- Run this in Supabase SQL Editor

-- Enable RLS on event_participants and friendships
ALTER TABLE public.event_participants ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.friendships ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist (to avoid conflicts)
DROP POLICY IF EXISTS "Users can view participants of their events" ON public.event_participants;
DROP POLICY IF EXISTS "Event creators can add participants" ON public.event_participants;
DROP POLICY IF EXISTS "Users can join events" ON public.event_participants;
DROP POLICY IF EXISTS "Users can update own participation" ON public.event_participants;
DROP POLICY IF EXISTS "Event creators can update participants" ON public.event_participants;
DROP POLICY IF EXISTS "Users can leave events" ON public.event_participants;
DROP POLICY IF EXISTS "Event creators can remove participants" ON public.event_participants;

DROP POLICY IF EXISTS "Users can view own friendships" ON public.friendships;
DROP POLICY IF EXISTS "Users can send friend requests" ON public.friendships;
DROP POLICY IF EXISTS "Users can update friend requests to them" ON public.friendships;
DROP POLICY IF EXISTS "Users can update own sent requests" ON public.friendships;
DROP POLICY IF EXISTS "Users can delete own friendships" ON public.friendships;

-- Re-create EVENT_PARTICIPANTS policies
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

CREATE POLICY "Event creators can add participants"
  ON public.event_participants FOR INSERT
  WITH CHECK (
    event_id IN (
      SELECT id FROM public.events WHERE created_by = auth.uid()
    )
  );

CREATE POLICY "Users can join events"
  ON public.event_participants FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own participation"
  ON public.event_participants FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Event creators can update participants"
  ON public.event_participants FOR UPDATE
  USING (
    event_id IN (
      SELECT id FROM public.events WHERE created_by = auth.uid()
    )
  );

CREATE POLICY "Users can leave events"
  ON public.event_participants FOR DELETE
  USING (auth.uid() = user_id);

CREATE POLICY "Event creators can remove participants"
  ON public.event_participants FOR DELETE
  USING (
    event_id IN (
      SELECT id FROM public.events WHERE created_by = auth.uid()
    )
  );

-- Re-create FRIENDSHIPS policies
CREATE POLICY "Users can view own friendships"
  ON public.friendships FOR SELECT
  USING (auth.uid() = user_id OR auth.uid() = friend_id);

CREATE POLICY "Users can send friend requests"
  ON public.friendships FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update friend requests to them"
  ON public.friendships FOR UPDATE
  USING (auth.uid() = friend_id);

CREATE POLICY "Users can update own sent requests"
  ON public.friendships FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own friendships"
  ON public.friendships FOR DELETE
  USING (auth.uid() = user_id OR auth.uid() = friend_id);

-- Verify RLS is now enabled
SELECT
  tablename,
  rowsecurity AS rls_enabled,
  CASE
    WHEN rowsecurity THEN '✅ SECURED'
    ELSE '⚠️ STILL UNPROTECTED'
  END as status
FROM pg_tables
WHERE schemaname = 'public'
  AND tablename IN ('event_participants', 'friendships')
ORDER BY tablename;

-- Count policies
SELECT
  tablename,
  COUNT(*) as policy_count
FROM pg_policies
WHERE schemaname = 'public'
  AND tablename IN ('event_participants', 'friendships')
GROUP BY tablename;
