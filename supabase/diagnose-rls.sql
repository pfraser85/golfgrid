-- Diagnostic: Check RLS status for all tables
-- Run this first to see what's actually enabled

SELECT
  schemaname,
  tablename,
  rowsecurity AS rls_enabled,
  CASE
    WHEN rowsecurity THEN '✅ PROTECTED'
    ELSE '⚠️ UNPROTECTED - CRITICAL'
  END as status
FROM pg_tables
WHERE schemaname = 'public'
  AND tablename IN ('users', 'availability', 'events', 'event_participants', 'friendships', 'messages')
ORDER BY tablename;

-- Also check if policies exist
SELECT
  schemaname,
  tablename,
  policyname,
  cmd AS operation,
  CASE
    WHEN qual IS NOT NULL THEN 'Has USING clause'
    ELSE 'No USING clause'
  END as using_check,
  CASE
    WHEN with_check IS NOT NULL THEN 'Has WITH CHECK clause'
    ELSE 'No WITH CHECK clause'
  END as with_check_status
FROM pg_policies
WHERE schemaname = 'public'
ORDER BY tablename, policyname;
