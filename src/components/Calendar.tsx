"use client";

import { useState } from "react";
import DayTile from "./DayTile";

type AvailabilityType = "morning" | "midday" | "afternoon" | "full-day" | null;

interface DayAvailability {
  date: Date;
  availability: AvailabilityType;
  hasSearch?: boolean;
  hasJoined?: boolean;
  hasAlert?: boolean;
  hasMessage?: boolean;
}

export interface GolfEvent {
  id: string;
  courseName: string;
  dateTime: Date;
  invitedFriends?: string;
}

export default function Calendar() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDay, setSelectedDay] = useState<Date | null>(null);
  const [showCreateEvent, setShowCreateEvent] = useState(false);
  const [showGuide, setShowGuide] = useState(false);
  const [eventDate, setEventDate] = useState<Date | null>(null);
  const [availability, setAvailability] = useState<Map<string, DayAvailability>>(
    new Map()
  );
  const [events, setEvents] = useState<GolfEvent[]>([]);

  // Generate calendar days for current month
  const getDaysInMonth = () => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    const days: (Date | null)[] = [];

    // Add empty slots for days before the month starts
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null);
    }

    // Add all days in the month
    for (let day = 1; day <= daysInMonth; day++) {
      days.push(new Date(year, month, day));
    }

    return days;
  };

  const handleDayClick = (date: Date) => {
    setSelectedDay(date);
  };

  const handleAvailabilityChange = (date: Date, type: AvailabilityType) => {
    const dateKey = date.toISOString().split("T")[0];
    const newAvailability = new Map(availability);

    if (type === null) {
      newAvailability.delete(dateKey);
    } else {
      newAvailability.set(dateKey, {
        date,
        availability: type,
      });
    }

    setAvailability(newAvailability);
    setSelectedDay(null);
  };

  const getAvailabilityForDate = (date: Date): DayAvailability | undefined => {
    const dateKey = date.toISOString().split("T")[0];
    return availability.get(dateKey);
  };

  const getEventsForDate = (date: Date): GolfEvent[] => {
    const dateKey = date.toISOString().split("T")[0];
    return events.filter(event => {
      const eventDateKey = event.dateTime.toISOString().split("T")[0];
      return eventDateKey === dateKey;
    });
  };

  const handleCreateEvent = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const courseName = formData.get("courseName") as string;
    const dateTimeStr = formData.get("dateTime") as string;
    const invitedFriends = formData.get("invitedFriends") as string;

    const newEvent: GolfEvent = {
      id: Date.now().toString(),
      courseName,
      dateTime: new Date(dateTimeStr),
      invitedFriends: invitedFriends || undefined,
    };

    setEvents([...events, newEvent]);
    setShowCreateEvent(false);
  };

  const goToPreviousMonth = () => {
    setCurrentDate(
      new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1)
    );
  };

  const goToNextMonth = () => {
    setCurrentDate(
      new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1)
    );
  };

  const monthName = currentDate.toLocaleString("default", { month: "long" });
  const year = currentDate.getFullYear();
  const days = getDaysInMonth();

  return (
    <div className="p-4 max-w-5xl mx-auto">
      {/* Top border line */}
      <div className="border-t border-gray-200 mb-6"></div>
          {/* Month Navigation and Create Event Button */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-4">
              <button
                onClick={goToPreviousMonth}
                className="p-2 hover:bg-cream-200 rounded-full transition-colors text-navy"
              >
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 19l-7-7 7-7"
                  />
                </svg>
              </button>
              <h2 className="text-3xl font-bold text-navy">
                {monthName} {year}
              </h2>
              <button
                onClick={goToNextMonth}
                className="p-2 hover:bg-cream-200 rounded-full transition-colors text-navy"
              >
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </button>
            </div>

            {/* Help Icon and Create Event Button */}
            <div className="flex items-center gap-3">
              {/* Help/Guide Icon */}
              <button
                onClick={() => setShowGuide(true)}
                className="p-2 hover:bg-cream-200 rounded-full transition-colors text-warmgrey hover:text-navy"
                title="Availability Guide"
              >
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </button>

              {/* Create Event Button */}
              <button
                onClick={() => {
                  setShowCreateEvent(true);
                  setEventDate(null);
                }}
                className="flex items-center gap-2 px-6 py-2 bg-navy text-white rounded-full hover:bg-navy-dark transition-colors shadow-soft"
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 4v16m8-8H4"
                  />
                </svg>
                <span className="font-medium">Create Event</span>
              </button>
            </div>
          </div>

      {/* Border under month/year */}
      <div className="border-b border-gray-200 mb-6"></div>

      {/* Day of Week Headers */}
      <div className="grid grid-cols-7 gap-2 mb-2">
        {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
          <div
            key={day}
            className="text-center text-sm font-semibold text-warmgrey-light py-2"
          >
            {day}
          </div>
        ))}
      </div>

      {/* Calendar Grid */}
      <div className="grid grid-cols-7 gap-2">
        {days.map((date, index) => (
          <DayTile
            key={index}
            date={date}
            availability={date ? getAvailabilityForDate(date) : undefined}
            events={date ? getEventsForDate(date) : []}
            onClick={date ? () => handleDayClick(date) : undefined}
            isSelected={
              date && selectedDay
                ? date.toDateString() === selectedDay.toDateString()
                : false
            }
          />
        ))}
      </div>

      {/* Availability Selection Modal */}
      {selectedDay && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 max-w-sm w-full shadow-2xl">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="text-xl font-bold text-gray-900">
                  {selectedDay.toLocaleDateString("default", {
                    month: "long",
                    day: "numeric",
                    year: "numeric",
                  })}
                </h3>
                <p className="text-sm text-gray-600 mt-1">
                  Mark your availability for this day:
                </p>
              </div>
              <button
                onClick={() => {
                  setShowCreateEvent(true);
                  setEventDate(selectedDay);
                  setSelectedDay(null);
                }}
                className="p-2 bg-navy text-white rounded-full hover:bg-navy-dark transition-colors flex-shrink-0"
                title="Create Event"
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 4v16m8-8H4"
                  />
                </svg>
              </button>
            </div>
            <div className="space-y-3">
              <button
                onClick={() => handleAvailabilityChange(selectedDay, "morning")}
                className="w-full p-4 bg-white border-2 border-gray-200 rounded-full hover:border-gold hover:bg-cream-200 transition-all text-left flex items-center shadow-soft"
              >
                <span className="text-3xl mr-3">🌅</span>
                <div>
                  <div className="font-semibold text-navy">Morning</div>
                  <div className="text-sm text-warmgrey">Early tee time</div>
                </div>
              </button>
              <button
                onClick={() => handleAvailabilityChange(selectedDay, "midday")}
                className="w-full p-4 bg-white border-2 border-gray-200 rounded-full hover:border-gold hover:bg-cream-200 transition-all text-left flex items-center shadow-soft"
              >
                <span className="text-3xl mr-3">☀️</span>
                <div>
                  <div className="font-semibold text-navy">Mid-day</div>
                  <div className="text-sm text-warmgrey">Afternoon round</div>
                </div>
              </button>
              <button
                onClick={() =>
                  handleAvailabilityChange(selectedDay, "afternoon")
                }
                className="w-full p-4 bg-white border-2 border-gray-200 rounded-full hover:border-gold hover:bg-cream-200 transition-all text-left flex items-center shadow-soft"
              >
                <span className="text-3xl mr-3">🌇</span>
                <div>
                  <div className="font-semibold text-navy">Afternoon</div>
                  <div className="text-sm text-warmgrey">Evening tee time</div>
                </div>
              </button>
              <button
                onClick={() => handleAvailabilityChange(selectedDay, "full-day")}
                className="w-full p-4 bg-white border-2 border-gray-200 rounded-full hover:border-gold hover:bg-cream-200 transition-all text-left flex items-center shadow-soft"
              >
                <span className="text-3xl mr-3">👍</span>
                <div>
                  <div className="font-semibold text-navy">All Day</div>
                  <div className="text-sm text-warmgrey">Available anytime</div>
                </div>
              </button>
              <button
                onClick={() => handleAvailabilityChange(selectedDay, null)}
                className="w-full p-4 bg-white border-2 border-gray-200 rounded-full hover:border-red-500 hover:bg-red-50 transition-all text-left flex items-center shadow-soft"
              >
                <span className="text-3xl mr-3">❌</span>
                <div>
                  <div className="font-semibold text-navy">Not Available</div>
                  <div className="text-sm text-warmgrey">Clear availability</div>
                </div>
              </button>
            </div>
            <button
              onClick={() => setSelectedDay(null)}
              className="w-full mt-4 p-3 bg-cream-200 rounded-full font-medium text-navy hover:bg-gray-200 transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Create Event Modal */}
      {showCreateEvent && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full shadow-2xl">
            <h3 className="text-2xl font-bold text-gray-900 mb-6">Create Golf Event</h3>

            <form className="space-y-5" onSubmit={handleCreateEvent}>
              {/* Golf Course Name */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Golf Course Name
                </label>
                <input
                  type="text"
                  name="courseName"
                  required
                  placeholder="e.g., Pebble Beach Golf Links"
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all text-gray-900 placeholder-gray-400"
                />
              </div>

              {/* Date and Time */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Tee Time (Date & Time)
                </label>
                <input
                  type="datetime-local"
                  name="dateTime"
                  required
                  defaultValue={eventDate ? eventDate.toISOString().slice(0, 16) : ''}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all text-gray-900"
                />
              </div>

              {/* Invite Friends */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Invite Friends (Optional)
                </label>
                <input
                  type="text"
                  name="invitedFriends"
                  placeholder="Search friends to invite..."
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all text-gray-900 placeholder-gray-400"
                />
                <p className="text-xs text-gray-500 mt-2">
                  Friend search will be available after Firebase setup
                </p>
              </div>

              {/* Buttons */}
              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowCreateEvent(false)}
                  className="flex-1 px-4 py-3 bg-cream-200 text-navy rounded-full font-medium hover:bg-gray-200 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-3 bg-navy text-white rounded-full font-medium hover:bg-navy-dark transition-colors shadow-soft"
                >
                  Create Event
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Availability Guide Modal */}
      {showGuide && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full shadow-2xl">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold text-gray-900">Availability Guide</h3>
              <button
                onClick={() => setShowGuide(false)}
                className="p-1 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <svg
                  className="w-6 h-6 text-gray-500"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>

            <div className="space-y-4">
              <p className="text-sm text-gray-600">
                Mark your availability and see golf events at a glance:
              </p>

              <div className="space-y-3">
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-white border-2 border-gray-300 rounded-lg mr-3 flex items-center justify-center flex-shrink-0">
                    <span className="text-xl">🌅</span>
                  </div>
                  <div>
                    <div className="font-semibold text-gray-900">Morning</div>
                    <div className="text-sm text-gray-600">Available for early tee times</div>
                  </div>
                </div>

                <div className="flex items-center">
                  <div className="w-12 h-12 bg-white border-2 border-gray-300 rounded-lg mr-3 flex items-center justify-center flex-shrink-0">
                    <span className="text-xl">☀️</span>
                  </div>
                  <div>
                    <div className="font-semibold text-gray-900">Mid-day</div>
                    <div className="text-sm text-gray-600">Available for afternoon rounds</div>
                  </div>
                </div>

                <div className="flex items-center">
                  <div className="w-12 h-12 bg-white border-2 border-gray-300 rounded-lg mr-3 flex items-center justify-center flex-shrink-0">
                    <span className="text-xl">🌇</span>
                  </div>
                  <div>
                    <div className="font-semibold text-gray-900">Afternoon</div>
                    <div className="text-sm text-gray-600">Available for evening tee times</div>
                  </div>
                </div>

                <div className="flex items-center">
                  <div className="w-12 h-12 bg-white border-2 border-gray-300 rounded-lg mr-3 flex items-center justify-center flex-shrink-0">
                    <span className="text-xl">👍</span>
                  </div>
                  <div>
                    <div className="font-semibold text-gray-900">Available anytime</div>
                    <div className="text-sm text-gray-600">Free all day</div>
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-gray-200">
                <h4 className="font-semibold text-gray-900 mb-2">Event Colors</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-4 rounded bg-gradient-to-r from-orange-200 to-orange-400"></div>
                    <span className="text-gray-700">Morning tee times (7am-11am)</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-4 rounded bg-gradient-to-r from-blue-200 to-blue-400"></div>
                    <span className="text-gray-700">Mid-day tee times (11am-2pm)</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-4 rounded bg-gradient-to-r from-purple-200 to-purple-400"></div>
                    <span className="text-gray-700">Afternoon tee times (2pm-8pm)</span>
                  </div>
                </div>
              </div>
            </div>

            <button
              onClick={() => setShowGuide(false)}
              className="w-full mt-6 p-3 bg-navy text-white rounded-full font-medium hover:bg-navy-dark transition-colors shadow-soft"
            >
              Got it!
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
