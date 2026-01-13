interface BottomNavProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

interface NavItem {
  id: string;
  label: string;
  icon: string;
}

const navItems: NavItem[] = [
  { id: "messages", label: "Messages", icon: "💬" },
  { id: "play-now", label: "Play Now", icon: "⛳" },
  { id: "calendar", label: "Calendar", icon: "📅" },
  { id: "friends", label: "Friends", icon: "👥" },
  { id: "profile", label: "Profile", icon: "🙍" },
];

export default function BottomNav({ activeTab, setActiveTab }: BottomNavProps) {
  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-cream-100 border-t border-gray-200 h-20 safe-area-inset-bottom shadow-soft">
      <div className="flex h-full items-center justify-around px-2">
        {navItems.map((item) => (
          <button
            key={item.id}
            onClick={() => setActiveTab(item.id)}
            className={`flex flex-col items-center justify-center flex-1 h-full transition-all relative ${
              activeTab === item.id
                ? "text-navy"
                : "text-warmgrey hover:text-navy"
            }`}
          >
            {activeTab === item.id && (
              <div className="absolute top-2 left-1/2 transform -translate-x-1/2 w-12 h-1 bg-gold rounded-full"></div>
            )}
            <span className="text-2xl mb-1">{item.icon}</span>
            <span className="text-xs font-medium">{item.label}</span>
          </button>
        ))}
      </div>
    </nav>
  );
}
