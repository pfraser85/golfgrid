-- GolfGrid Database Schema
-- Created: January 15, 2026
-- This schema creates all tables, indexes, and functions for GolfGrid

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================
-- USERS TABLE
-- ============================================
CREATE TABLE public.users (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  full_name TEXT,
  handicap INTEGER,
  profile_picture_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Index for faster lookups
CREATE INDEX users_email_idx ON public.users(email);

-- ============================================
-- AVAILABILITY TABLE
-- ============================================
CREATE TABLE public.availability (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
  date DATE NOT NULL,
  time_slot TEXT NOT NULL CHECK (time_slot IN ('morning', 'midday', 'afternoon', 'full-day')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, date)
);

-- Indexes for faster queries
CREATE INDEX availability_user_id_idx ON public.availability(user_id);
CREATE INDEX availability_date_idx ON public.availability(date);
CREATE INDEX availability_user_date_idx ON public.availability(user_id, date);

-- ============================================
-- EVENTS TABLE
-- ============================================
CREATE TABLE public.events (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  course_name TEXT NOT NULL,
  tee_time TIMESTAMP WITH TIME ZONE NOT NULL,
  created_by UUID REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
  max_players INTEGER DEFAULT 4,
  status TEXT DEFAULT 'open' CHECK (status IN ('open', 'full', 'cancelled', 'completed')),
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes for faster queries
CREATE INDEX events_created_by_idx ON public.events(created_by);
CREATE INDEX events_tee_time_idx ON public.events(tee_time);
CREATE INDEX events_status_idx ON public.events(status);

-- ============================================
-- EVENT PARTICIPANTS TABLE (Many-to-Many)
-- ============================================
CREATE TABLE public.event_participants (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  event_id UUID REFERENCES public.events(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
  status TEXT DEFAULT 'confirmed' CHECK (status IN ('invited', 'confirmed', 'declined', 'cancelled')),
  joined_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(event_id, user_id)
);

-- Indexes for faster queries
CREATE INDEX event_participants_event_id_idx ON public.event_participants(event_id);
CREATE INDEX event_participants_user_id_idx ON public.event_participants(user_id);

-- ============================================
-- FRIENDSHIPS TABLE (Many-to-Many)
-- ============================================
CREATE TABLE public.friendships (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
  friend_id UUID REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'accepted', 'declined', 'blocked')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, friend_id),
  CHECK (user_id != friend_id)
);

-- Indexes for faster queries
CREATE INDEX friendships_user_id_idx ON public.friendships(user_id);
CREATE INDEX friendships_friend_id_idx ON public.friendships(friend_id);
CREATE INDEX friendships_status_idx ON public.friendships(status);

-- ============================================
-- MESSAGES TABLE
-- ============================================
CREATE TABLE public.messages (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  type TEXT NOT NULL CHECK (type IN ('event_invite', 'friend_request', 'event_update', 'system', 'chat')),
  content TEXT NOT NULL,
  from_user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
  to_user_id UUID REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
  event_id UUID REFERENCES public.events(id) ON DELETE CASCADE,
  read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes for faster queries
CREATE INDEX messages_to_user_id_idx ON public.messages(to_user_id);
CREATE INDEX messages_event_id_idx ON public.messages(event_id);
CREATE INDEX messages_read_idx ON public.messages(read);

-- ============================================
-- FUNCTIONS & TRIGGERS
-- ============================================

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers for updated_at
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON public.users
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_availability_updated_at BEFORE UPDATE ON public.availability
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_events_updated_at BEFORE UPDATE ON public.events
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_friendships_updated_at BEFORE UPDATE ON public.friendships
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Function to automatically add event creator as participant
CREATE OR REPLACE FUNCTION add_creator_as_participant()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.event_participants (event_id, user_id, status)
  VALUES (NEW.id, NEW.created_by, 'confirmed');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER add_creator_to_event AFTER INSERT ON public.events
  FOR EACH ROW EXECUTE FUNCTION add_creator_as_participant();

-- Function to update event status when full
CREATE OR REPLACE FUNCTION update_event_status_on_participant_change()
RETURNS TRIGGER AS $$
DECLARE
  participant_count INTEGER;
  max_players_count INTEGER;
BEGIN
  -- Get current participant count and max players
  SELECT COUNT(*), e.max_players INTO participant_count, max_players_count
  FROM public.event_participants ep
  JOIN public.events e ON e.id = ep.event_id
  WHERE ep.event_id = NEW.event_id AND ep.status = 'confirmed'
  GROUP BY e.max_players;

  -- Update event status if full
  IF participant_count >= max_players_count THEN
    UPDATE public.events SET status = 'full' WHERE id = NEW.event_id;
  ELSE
    UPDATE public.events SET status = 'open' WHERE id = NEW.event_id;
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_event_status AFTER INSERT OR UPDATE ON public.event_participants
  FOR EACH ROW EXECUTE FUNCTION update_event_status_on_participant_change();

-- ============================================
-- VIEWS (helpful for common queries)
-- ============================================

-- View for getting user's friends (accepted friendships)
CREATE VIEW user_friends AS
SELECT
  f.user_id,
  f.friend_id,
  u.full_name as friend_name,
  u.email as friend_email,
  u.handicap as friend_handicap,
  u.profile_picture_url as friend_picture
FROM public.friendships f
JOIN public.users u ON u.id = f.friend_id
WHERE f.status = 'accepted';

-- View for getting event details with participants
CREATE VIEW event_details AS
SELECT
  e.id as event_id,
  e.course_name,
  e.tee_time,
  e.status as event_status,
  e.max_players,
  e.notes,
  e.created_by,
  creator.full_name as creator_name,
  COUNT(ep.id) as participant_count,
  ARRAY_AGG(
    JSON_BUILD_OBJECT(
      'user_id', ep.user_id,
      'name', u.full_name,
      'status', ep.status,
      'profile_picture', u.profile_picture_url
    )
  ) as participants
FROM public.events e
LEFT JOIN public.users creator ON creator.id = e.created_by
LEFT JOIN public.event_participants ep ON ep.event_id = e.id
LEFT JOIN public.users u ON u.id = ep.user_id
GROUP BY e.id, e.course_name, e.tee_time, e.status, e.max_players, e.notes, e.created_by, creator.full_name;

-- ============================================
-- COMMENTS
-- ============================================

COMMENT ON TABLE public.users IS 'User profiles linked to auth.users';
COMMENT ON TABLE public.availability IS 'User availability by date and time slot';
COMMENT ON TABLE public.events IS 'Golf events created by users';
COMMENT ON TABLE public.event_participants IS 'Many-to-many relationship between events and users';
COMMENT ON TABLE public.friendships IS 'Friend relationships between users';
COMMENT ON TABLE public.messages IS 'Messages and notifications between users';
