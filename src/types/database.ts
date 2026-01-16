// Database types for GolfGrid
// These types match the Supabase schema

export type TimeSlot = 'morning' | 'midday' | 'afternoon' | 'full-day';
export type EventStatus = 'open' | 'full' | 'cancelled' | 'completed';
export type ParticipantStatus = 'invited' | 'confirmed' | 'declined' | 'cancelled';
export type FriendshipStatus = 'pending' | 'accepted' | 'declined' | 'blocked';
export type MessageType = 'event_invite' | 'friend_request' | 'event_update' | 'system' | 'chat';

export interface User {
  id: string;
  email: string;
  full_name: string | null;
  handicap: number | null;
  profile_picture_url: string | null;
  created_at: string;
  updated_at: string;
}

export interface Availability {
  id: string;
  user_id: string;
  date: string; // ISO date string (YYYY-MM-DD)
  time_slot: TimeSlot;
  created_at: string;
  updated_at: string;
}

export interface Event {
  id: string;
  course_name: string;
  tee_time: string; // ISO datetime string
  created_by: string;
  max_players: number;
  status: EventStatus;
  notes: string | null;
  created_at: string;
  updated_at: string;
}

export interface EventParticipant {
  id: string;
  event_id: string;
  user_id: string;
  status: ParticipantStatus;
  joined_at: string;
}

export interface Friendship {
  id: string;
  user_id: string;
  friend_id: string;
  status: FriendshipStatus;
  created_at: string;
  updated_at: string;
}

export interface Message {
  id: string;
  type: MessageType;
  content: string;
  from_user_id: string | null;
  to_user_id: string;
  event_id: string | null;
  read: boolean;
  created_at: string;
}

// Extended types with joined data (for views/queries)
export interface EventWithParticipants extends Event {
  participants: Array<{
    user_id: string;
    name: string | null;
    status: ParticipantStatus;
    profile_picture: string | null;
  }>;
  participant_count: number;
  creator_name: string | null;
}

export interface Friend {
  user_id: string;
  friend_id: string;
  friend_name: string | null;
  friend_email: string;
  friend_handicap: number | null;
  friend_picture: string | null;
}
