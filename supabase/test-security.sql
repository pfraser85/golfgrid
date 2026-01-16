-- Test that RLS is actually working
-- This query should return ZERO rows if RLS is working properly
-- (because you're querying as the anon role without authentication)

SET ROLE anon;

-- Try to read all users (should work - policy allows viewing all profiles)
SELECT COUNT(*) as user_count FROM public.users;

-- Try to read all events (should return 0 - needs auth.uid())
SELECT COUNT(*) as event_count FROM public.events;

-- Try to read all availability (should return 0 - needs auth.uid())
SELECT COUNT(*) as availability_count FROM public.availability;

-- Try to read event_participants (should return 0 - needs auth.uid())
SELECT COUNT(*) as participant_count FROM public.event_participants;

-- Try to read friendships (should return 0 - needs auth.uid())
SELECT COUNT(*) as friendship_count FROM public.friendships;

RESET ROLE;

-- Expected results:
-- user_count: (any number) - users table allows public SELECT
-- event_count: 0 - RLS is blocking unauthenticated access
-- availability_count: 0 - RLS is blocking
-- participant_count: 0 - RLS is blocking
-- friendship_count: 0 - RLS is blocking

-- If event_count, availability_count, participant_count, or friendship_count
-- show numbers > 0, then RLS is NOT working properly
