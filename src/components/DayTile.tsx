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

  // Get event gradient color based on tee time
  const getEventGradient = (eventTime: Date) => {
    const hour = eventTime.getHours();
    const minute = eventTime.getMinutes();
    const totalMinutes = hour * 60 + minute;

    // Morning: 7:00 AM - 10:59:59 AM (420-659 minutes)
    if (totalMinutes >= 420 && totalMinutes < 660) {
      return "bg-gradient-to-br from-orange-200 to-orange-400";
    }
    // Mid-day: 11:00 AM - 1:59:59 PM (660-839 minutes)
    else if (totalMinutes >= 660 && totalMinutes < 840) {
      return "bg-gradient-to-br from-blue-200 to-blue-400";
    }
    // Afternoon: 2:00 PM - 8:00 PM (840-1200 minutes)
    else if (totalMinutes >= 840 && totalMinutes <= 1200) {
      return "bg-gradient-to-br from-purple-200 to-purple-400";
    }
    // Outside standard times
    return "bg-white border border-gray-300";
  };

  // Get vertical position based on time of day
  const getEventPosition = (eventTime: Date) => {
    const hour = eventTime.getHours();
    const minute = eventTime.getMinutes();
    const totalMinutes = hour * 60 + minute;

    // Morning (7-11am): middle of day box (around 40%)
    if (totalMinutes >= 420 && totalMinutes < 660) {
      return "top-[40%]";
    }
    // Mid-day (11am-2pm): lower middle (around 50%)
    else if (totalMinutes >= 660 && totalMinutes < 840) {
      return "top-[50%]";
    }
    // Afternoon (2-8pm): towards bottom but leave 10% grey showing
    else if (totalMinutes >= 840 && totalMinutes <= 1200) {
      return "top-[60%]";
    }
    // Default positioning for outside times
    return "top-[50%]";
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
      {/* Event boxes */}
      {events.length > 0 && (
        <div className="absolute inset-0 p-1">
          {events.map((event, index) => (
            <div
              key={event.id}
              className={`
                absolute left-1 right-1 h-[30%] rounded-lg shadow-sm
                ${getEventGradient(event.dateTime)}
                ${getEventPosition(event.dateTime)}
                flex flex-col items-center justify-center
                px-1 py-0.5
                z-10
              `}
              style={{
                marginLeft: index > 0 ? `${index * 2}px` : "0",
              }}
              title={`${event.courseName} - ${event.dateTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`}
            >
              <span className="text-xs font-semibold text-gray-800 truncate w-full text-center leading-tight">
                {event.courseName}
              </span>
              <span className="text-[10px] font-medium text-gray-700 mt-0.5">
                {event.dateTime.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' })}
              </span>
            </div>
          ))}
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
