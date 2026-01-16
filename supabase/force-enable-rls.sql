-- FORCE Enable RLS on problem tables
-- Run this if event_participants and friendships still show unrestricted

-- First, let's see what tables exist
SELECT table_name
FROM information_schema.tables
WHERE table_schema = 'public'
  AND table_type = 'BASE TABLE'
ORDER BY table_name;

-- Force enable RLS on all tables (including any variations of names)
DO $$
DECLARE
  table_record RECORD;
BEGIN
  FOR table_record IN
    SELECT table_name
    FROM information_schema.tables
    WHERE table_schema = 'public'
      AND table_type = 'BASE TABLE'
      AND table_name IN ('users', 'availability', 'events', 'event_participants', 'friendships', 'messages')
  LOOP
    EXECUTE format('ALTER TABLE public.%I ENABLE ROW LEVEL SECURITY;', table_record.table_name);
    RAISE NOTICE 'Enabled RLS on: %', table_record.table_name;
  END LOOP;
END $$;

-- Verify again
SELECT
  tablename,
  rowsecurity AS rls_enabled
FROM pg_tables
WHERE schemaname = 'public'
  AND tablename IN ('users', 'availability', 'events', 'event_participants', 'friendships', 'messages')
ORDER BY tablename;
