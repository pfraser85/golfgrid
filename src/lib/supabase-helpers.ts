import { supabase } from "./supabase";
import type { Event, Availability, TimeSlot } from "@/types/database";

// ============================================
// EVENTS
// ============================================

export async function fetchUserEvents(userId: string) {
  // RLS policies will automatically filter events the user can see
  // Note: Not joining event_participants to avoid infinite recursion in RLS policies
  const { data, error } = await supabase
    .from("events")
    .select("*")
    .order("tee_time", { ascending: true });

  if (error) {
    console.error("Error fetching events:", error);
    return [];
  }

  return data as Event[];
}

export async function createEvent(
  userId: string,
  courseName: string,
  teeTime: Date,
  invitedFriends?: string
) {
  const { data, error } = await supabase
    .from("events")
    .insert({
      course_name: courseName,
      tee_time: teeTime.toISOString(),
      created_by: userId,
      notes: invitedFriends || null,
    })
    .select()
    .single();

  if (error) {
    console.error("Error creating event:", error);
    throw error;
  }

  // Note: Database trigger automatically adds creator as participant
  return data as Event;
}

export async function updateEvent(
  eventId: string,
  courseName: string,
  teeTime: Date,
  invitedFriends?: string
) {
  const { data, error } = await supabase
    .from("events")
    .update({
      course_name: courseName,
      tee_time: teeTime.toISOString(),
      notes: invitedFriends || null,
    })
    .eq("id", eventId)
    .select()
    .single();

  if (error) {
    console.error("Error updating event:", error);
    throw error;
  }

  return data as Event;
}

export async function deleteEvent(eventId: string) {
  const { error } = await supabase
    .from("events")
    .delete()
    .eq("id", eventId);

  if (error) {
    console.error("Error deleting event:", error);
    throw error;
  }
}

// ============================================
// AVAILABILITY
// ============================================

export async function fetchUserAvailability(userId: string) {
  const { data, error } = await supabase
    .from("availability")
    .select("*")
    .eq("user_id", userId);

  if (error) {
    console.error("Error fetching availability:", error);
    return [];
  }

  return data as Availability[];
}

export async function setAvailability(
  userId: string,
  date: string,
  timeSlot: TimeSlot
) {
  // Use upsert to insert or update
  const { data, error } = await supabase
    .from("availability")
    .upsert({
      user_id: userId,
      date: date,
      time_slot: timeSlot,
    }, {
      onConflict: "user_id,date"
    })
    .select()
    .single();

  if (error) {
    console.error("Error setting availability:", error);
    throw error;
  }

  return data as Availability;
}

export async function removeAvailability(userId: string, date: string) {
  const { error } = await supabase
    .from("availability")
    .delete()
    .eq("user_id", userId)
    .eq("date", date);

  if (error) {
    console.error("Error removing availability:", error);
    throw error;
  }
}

export async function clearAllAvailability(userId: string) {
  const { error } = await supabase
    .from("availability")
    .delete()
    .eq("user_id", userId);

  if (error) {
    console.error("Error clearing all availability:", error);
    throw error;
  }
}

export async function batchSetAvailability(
  userId: string,
  availabilityData: Array<{ date: string; time_slot: TimeSlot }>
) {
  // Batch insert/update availability
  const records = availabilityData.map(item => ({
    user_id: userId,
    date: item.date,
    time_slot: item.time_slot,
  }));

  const { error } = await supabase
    .from("availability")
    .upsert(records, {
      onConflict: "user_id,date"
    });

  if (error) {
    console.error("Error batch setting availability:", error);
    throw error;
  }
}
