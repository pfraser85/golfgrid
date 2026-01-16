-- Fix Views to use SECURITY INVOKER
-- This makes views respect RLS policies on underlying tables

-- Drop existing views
DROP VIEW IF EXISTS public.event_details;
DROP VIEW IF EXISTS public.user_friends;

-- Recreate event_details with SECURITY INVOKER
CREATE VIEW public.event_details
WITH (security_invoker = on) AS
SELECT
  e.id AS event_id,
  e.course_name,
  e.tee_time,
  e.status AS event_status,
  e.max_players,
  e.notes,
  e.created_by,
  creator.full_name AS creator_name,
  count(ep.id) AS participant_count,
  array_agg(
    json_build_object(
      'user_id', ep.user_id,
      'name', u.full_name,
      'status', ep.status,
      'profile_picture', u.profile_picture_url
    )
  ) AS participants
FROM events e
  LEFT JOIN users creator ON creator.id = e.created_by
  LEFT JOIN event_participants ep ON ep.event_id = e.id
  LEFT JOIN users u ON u.id = ep.user_id
GROUP BY e.id, e.course_name, e.tee_time, e.status, e.max_players, e.notes, e.created_by, creator.full_name;

-- Recreate user_friends with SECURITY INVOKER
CREATE VIEW public.user_friends
WITH (security_invoker = on) AS
SELECT
  f.user_id,
  f.friend_id,
  u.full_name AS friend_name,
  u.email AS friend_email,
  u.handicap AS friend_handicap,
  u.profile_picture_url AS friend_picture
FROM friendships f
  JOIN users u ON u.id = f.friend_id
WHERE f.status = 'accepted';

-- Verify the views are now security_invoker
SELECT
  schemaname,
  viewname,
  viewowner
FROM pg_views
WHERE schemaname = 'public'
  AND viewname IN ('event_details', 'user_friends')
ORDER BY viewname;

-- Check security_invoker setting directly
SELECT
  c.relname AS view_name,
  CASE
    WHEN c.relrowsecurity THEN 'Has RLS (not applicable to views)'
    ELSE 'No RLS (expected for views)'
  END as rls_status,
  COALESCE(
    (SELECT option_value
     FROM pg_options_to_table(c.reloptions)
     WHERE option_name = 'security_invoker'),
    'off'
  ) as security_invoker
FROM pg_class c
JOIN pg_namespace n ON n.oid = c.relnamespace
WHERE n.nspname = 'public'
  AND c.relkind = 'v'
  AND c.relname IN ('event_details', 'user_friends')
ORDER BY c.relname;
