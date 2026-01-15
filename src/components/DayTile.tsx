import { GolfEvent } from "./Calendar";

interface DayAvailability {
  date: Date;
  availability: "morning" | "midday" | "afternoon" | "full-day" | null;
  hasSearch?: boolean;
  hasJoined?: boolean;
  hasAlert?: boolean;
  hasMessage?: boolean;
}

interface DayTileProps {
  date: Date | null;
  availability?: DayAvailability;
  events?: GolfEvent[];
  onClick?: () => void;
  isSelected?: boolean;
}

export default function DayTile({
  date,
  availability,
  events = [],
  onClick,
  isSelected = false,
}: DayTileProps) {
  if (!date) {
    return <div className="aspect-square"></div>;
  }

  const dayNumber = date.getDate();
  const isToday = new Date().toDateString() === date.toDateString();
  const isPast = date < new Date(new Date().setHours(0, 0, 0, 0));

  // Determine background color based on availability or events
  const getBackgroundColor = () => {
    if (isPast && !availability && events.length === 0) return "bg-gray-100";
    // Show white background if there are events (indicating activity/availability)
    if (events.length > 0) return "bg-white border-2 border-gray-300";
    if (!availability?.availability) return "bg-gray-200";
    return "bg-white border-2 border-gray-300";
  };

  // Get colored border based on availability type
  const getAvailabilityBorder = () => {
    if (!availability?.availability || availability.availability === "full-day") return "";

    switch (availability.availability) {
      case "morning":
        return "border-l-4 border-l-orange-400";
      case "midday":
        return "border-l-4 border-l-blue-400";
      case "afternoon":
        return "border-l-4 border-l-purple-400";
      default:
        return "";
    }
  };

  // Get the availability icon
  const getAvailabilityIcon = () => {
    if (!availability?.availability) return null;

    switch (availability.availability) {
      case "morning":
        return <span className="text-3xl">🌅</span>;
      case "midday":
        return <span className="text-3xl">☀️</span>;
      case "afternoon":
        return <span className="text-3xl">🌇</span>;
      case "full-day":
        return <span className="text-3xl">👍</span>;
      default:
        return null;
    }
  };

  // Get action icons
  const getActionIcons = () => {
    const icons = [];

    if (availability?.hasSearch) {
      icons.push(
        <span key="search" className="text-lg" title="Find matching availability">
          🔍
        </span>
      );
    }

    if (availability?.hasJoined) {
      icons.push(
        <span key="joined" className="text-lg" title="Someone joined">
          ✨
        </span>
      );
    }

    if (availability?.hasAlert) {
      icons.push(
        <span key="alert" className="text-lg" title="Alert">
          ⚠️
        </span>
      );
    }

    if (availability?.hasMessage) {
      icons.push(
        <span key="message" className="text-lg" title="New message">
          ✉️
        </span>
      );
    }

    return icons;
  };

  // Get event color based on tee time
  const getEventColor = (eventTime: Date) => {
    const hour = eventTime.getHours();
    const minute = eventTime.getMinutes();
    const totalMinutes = hour * 60 + minute;

    // Morning: 7:00 AM - 10:59:59 AM (420-659 minutes)
    if (totalMinutes >= 420 && totalMinutes < 660) {
      return {
        bg: "bg-orange-50",
        border: "border-orange-300",
        text: "text-orange-900"
      };
    }
    // Mid-day: 11:00 AM - 1:59:59 PM (660-839 minutes)
    else if (totalMinutes >= 660 && totalMinutes < 840) {
      return {
        bg: "bg-blue-50",
        border: "border-blue-300",
        text: "text-blue-900"
      };
    }
    // Afternoon: 2:00 PM - 8:00 PM (840-1200 minutes)
    else if (totalMinutes >= 840 && totalMinutes <= 1200) {
      return {
        bg: "bg-purple-50",
        border: "border-purple-300",
        text: "text-purple-900"
      };
    }
    // Outside standard times
    return {
      bg: "bg-white",
      border: "border-gray-300",
      text: "text-gray-900"
    };
  };

  const actionIcons = getActionIcons();

  return (
    <button
      onClick={!isPast ? onClick : undefined}
      disabled={isPast}
      className={`
        aspect-square rounded-xl p-2 relative transition-all overflow-hidden
        ${getBackgroundColor()}
        ${getAvailabilityBorder()}
        ${isSelected ? "ring-2 ring-gold ring-offset-2" : ""}
        ${
          !isPast && onClick
            ? "hover:shadow-soft-lg hover:scale-105 cursor-pointer active:scale-95"
            : "cursor-not-allowed opacity-60"
        }
        ${isToday ? "ring-2 ring-navy" : ""}
      `}
    >
      {/* Event cards */}
      {events.length > 0 && (
        <div className="absolute inset-0 p-1.5 flex flex-col justify-center">
          {events.slice(0, 1).map((event) => {
            const colors = getEventColor(event.dateTime);
            return (
              <div
                key={event.id}
                className={`
                  ${colors.bg} ${colors.border}
                  border-2 rounded-xl shadow-soft p-2
                  flex flex-col gap-1.5
                  transition-all hover:shadow-soft-lg
                `}
                title={`${event.courseName} - ${event.dateTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`}
              >
                {/* Course Name */}
                <div className={`text-xs font-bold ${colors.text} truncate leading-tight`}>
                  {event.courseName}
                </div>

                {/* Tee Time */}
                <div className={`text-[10px] font-semibold ${colors.text} opacity-80`}>
                  {event.dateTime.toLocaleTimeString([], {
                    hour: 'numeric',
                    minute: '2-digit',
                    hour12: true
                  })}
                </div>

                {/* Profile Icons */}
                <div className="flex items-center gap-1 mt-0.5">
                  {[1, 2, 3].map((slot) => (
                    <div
                      key={slot}
                      className={`w-5 h-5 rounded-full border ${colors.border} ${colors.bg} flex items-center justify-center`}
                    >
                      <svg
                        className={`w-3 h-3 ${colors.text} opacity-40`}
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                        />
                      </svg>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
          {events.length > 1 && (
            <div className="text-[9px] text-warmgrey font-medium text-center mt-1">
              +{events.length - 1} more
            </div>
          )}
        </div>
      )}

      {/* Date number in top-right */}
      <div className="absolute top-1 right-2 text-sm font-semibold text-navy z-20">
        {dayNumber}
      </div>

      {/* Center content area for action icons */}
      <div className="flex items-center justify-center h-full z-20 relative">
        {/* Action icons */}
        {actionIcons.length > 0 && (
          <div className="flex gap-1 flex-wrap justify-center">
            {actionIcons}
          </div>
        )}
      </div>
    </button>
  );
}
