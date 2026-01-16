-- Deep diagnostic: Check what these objects actually are
-- This will tell us if they're tables, views, or something else

-- Check object types
SELECT
  n.nspname as schema,
  c.relname as name,
  CASE c.relkind
    WHEN 'r' THEN 'table'
    WHEN 'v' THEN 'view'
    WHEN 'm' THEN 'materialized view'
    WHEN 'i' THEN 'index'
    WHEN 'S' THEN 'sequence'
    WHEN 's' THEN 'special'
    WHEN 'f' THEN 'foreign table'
    WHEN 'p' THEN 'partitioned table'
    WHEN 'I' THEN 'partitioned index'
  END as object_type,
  c.relrowsecurity as rls_enabled,
  c.relforcerowsecurity as rls_forced
FROM pg_class c
JOIN pg_namespace n ON n.oid = c.relnamespace
WHERE n.nspname = 'public'
  AND c.relname IN ('event_participants', 'friendships', 'users', 'events', 'availability', 'messages')
ORDER BY c.relname;

-- Check if there are any views with these names
SELECT
  table_schema,
  table_name,
  table_type
FROM information_schema.tables
WHERE table_schema = 'public'
  AND table_name IN ('event_participants', 'friendships')
ORDER BY table_name;

-- Check for any security definer functions/views
SELECT
  n.nspname as schema_name,
  p.proname as function_name,
  pg_get_function_result(p.oid) as result_type,
  CASE p.prosecdef
    WHEN true THEN 'SECURITY DEFINER'
    ELSE 'SECURITY INVOKER'
  END as security_type
FROM pg_proc p
JOIN pg_namespace n ON p.pronamespace = n.oid
WHERE n.nspname = 'public'
  AND (p.proname LIKE '%event_participant%' OR p.proname LIKE '%friendship%')
ORDER BY p.proname;

-- List ALL policies on these tables
SELECT
  schemaname,
  tablename,
  policyname,
  permissive,
  roles,
  cmd as command,
  qual as using_expression,
  with_check as with_check_expression
FROM pg_policies
WHERE schemaname = 'public'
  AND tablename IN ('event_participants', 'friendships')
ORDER BY tablename, policyname;
