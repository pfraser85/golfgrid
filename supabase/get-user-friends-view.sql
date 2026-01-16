-- Get the definition of user_friends view
SELECT pg_get_viewdef('public.user_friends'::regclass, true) as view_definition;
