-- Fix infinite recursion in event_participants policies
-- The problem: SELECT policy queries event_participants table within itself

-- Drop the problematic policy
DROP POLICY IF EXISTS "Users can view participants of their events" ON public.event_participants;

-- Create a simpler, non-recursive policy
-- Users can view participants of events they created
CREATE POLICY "Users can view participants of events they created"
  ON public.event_participants FOR SELECT
  USING (
    event_id IN (
      SELECT id FROM public.events WHERE created_by = auth.uid()
    )
  );

-- Users can view participants of events they're in (direct check, no recursion)
CREATE POLICY "Users can view participants of events they joined"
  ON public.event_participants FOR SELECT
  USING (
    user_id = auth.uid()  -- User can see their own participation record
  );

-- Verify policies
SELECT
  tablename,
  policyname,
  cmd as operation
FROM pg_policies
WHERE schemaname = 'public'
  AND tablename = 'event_participants'
ORDER BY policyname;
