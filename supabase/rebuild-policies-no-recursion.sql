-- COMPLETE REBUILD: Fix infinite recursion in RLS policies
-- Problem: events and event_participants policies reference each other circularly

-- ============================================
-- STEP 1: DROP ALL EXISTING POLICIES
-- ============================================

-- Drop all events policies
DROP POLICY IF EXISTS "Users can view own events" ON public.events;
DROP POLICY IF EXISTS "Users can view events they're in" ON public.events;
DROP POLICY IF EXISTS "Friends can view each other's events" ON public.events;
DROP POLICY IF EXISTS "Users can create events" ON public.events;
DROP POLICY IF EXISTS "Users can update own events" ON public.events;
DROP POLICY IF EXISTS "Users can delete own events" ON public.events;

-- Drop all event_participants policies
DROP POLICY IF EXISTS "Users can view participants of their events" ON public.event_participants;
DROP POLICY IF EXISTS "Users can view participants of events they created" ON public.event_participants;
DROP POLICY IF EXISTS "Users can view participants of events they joined" ON public.event_participants;
DROP POLICY IF EXISTS "Event creators can add participants" ON public.event_participants;
DROP POLICY IF EXISTS "Users can join events" ON public.event_participants;
DROP POLICY IF EXISTS "Users can update own participation" ON public.event_participants;
DROP POLICY IF EXISTS "Event creators can update participants" ON public.event_participants;
DROP POLICY IF EXISTS "Users can leave events" ON public.event_participants;
DROP POLICY IF EXISTS "Event creators can remove participants" ON public.event_participants;

-- ============================================
-- STEP 2: CREATE SIMPLE, NON-RECURSIVE POLICIES
-- ============================================

-- EVENTS TABLE POLICIES (no references to event_participants)
-- --------------------------------------------

-- SELECT: Users can only view events they created
CREATE POLICY "events_select_own"
  ON public.events FOR SELECT
  USING (created_by = auth.uid());

-- INSERT: Users can create events
CREATE POLICY "events_insert"
  ON public.events FOR INSERT
  WITH CHECK (created_by = auth.uid());

-- UPDATE: Users can update their own events
CREATE POLICY "events_update_own"
  ON public.events FOR UPDATE
  USING (created_by = auth.uid());

-- DELETE: Users can delete their own events
CREATE POLICY "events_delete_own"
  ON public.events FOR DELETE
  USING (created_by = auth.uid());

-- EVENT_PARTICIPANTS TABLE POLICIES (minimal recursion)
-- --------------------------------------------

-- SELECT: Users can view their own participation records
CREATE POLICY "participants_select_own"
  ON public.event_participants FOR SELECT
  USING (user_id = auth.uid());

-- SELECT: Event creators can view all participants of their events
CREATE POLICY "participants_select_by_creator"
  ON public.event_participants FOR SELECT
  USING (
    event_id IN (
      SELECT id FROM public.events WHERE created_by = auth.uid()
    )
  );

-- INSERT: Event creators can add participants to their events
CREATE POLICY "participants_insert_by_creator"
  ON public.event_participants FOR INSERT
  WITH CHECK (
    event_id IN (
      SELECT id FROM public.events WHERE created_by = auth.uid()
    )
  );

-- INSERT: Users can add themselves to events (self-join)
CREATE POLICY "participants_insert_self"
  ON public.event_participants FOR INSERT
  WITH CHECK (user_id = auth.uid());

-- UPDATE: Users can update their own participation status
CREATE POLICY "participants_update_own"
  ON public.event_participants FOR UPDATE
  USING (user_id = auth.uid());

-- UPDATE: Event creators can update any participant status
CREATE POLICY "participants_update_by_creator"
  ON public.event_participants FOR UPDATE
  USING (
    event_id IN (
      SELECT id FROM public.events WHERE created_by = auth.uid()
    )
  );

-- DELETE: Users can remove themselves from events
CREATE POLICY "participants_delete_self"
  ON public.event_participants FOR DELETE
  USING (user_id = auth.uid());

-- DELETE: Event creators can remove any participant
CREATE POLICY "participants_delete_by_creator"
  ON public.event_participants FOR DELETE
  USING (
    event_id IN (
      SELECT id FROM public.events WHERE created_by = auth.uid()
    )
  );

-- ============================================
-- STEP 3: VERIFY POLICIES
-- ============================================

-- List all policies
SELECT
  tablename,
  policyname,
  cmd as operation,
  CASE
    WHEN policyname LIKE '%own%' OR policyname LIKE '%self%' THEN '✅ Simple'
    WHEN policyname LIKE '%creator%' THEN '⚠️ Uses subquery'
    ELSE '❓ Check carefully'
  END as complexity
FROM pg_policies
WHERE schemaname = 'public'
  AND tablename IN ('events', 'event_participants')
ORDER BY tablename, policyname;
