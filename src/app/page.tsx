"use client";

import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import AuthModal from "@/components/Auth/AuthModal";
import BottomNav from "@/components/BottomNav";
import Calendar from "@/components/Calendar";
import PlayNow from "@/components/PlayNow";
import Friends from "@/components/Friends";
import Profile from "@/components/Profile";
import Messages from "@/components/Messages";

export default function Home() {
  const { user, loading } = useAuth();
  const [activeTab, setActiveTab] = useState<string>("calendar");

  const renderContent = () => {
    switch (activeTab) {
      case "messages":
        return <Messages />;
      case "play-now":
        return <PlayNow />;
      case "calendar":
        return <Calendar />;
      case "friends":
        return <Friends />;
      case "profile":
        return <Profile />;
      default:
        return <Calendar />;
    }
  };

  // Show loading state
  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-cream">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-navy border-t-gold rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-navy font-semibold">Loading GolfGrid...</p>
        </div>
      </div>
    );
  }

  // Show auth modal if not logged in
  if (!user) {
    return <AuthModal />;
  }

  return (
    <div className="flex flex-col h-screen bg-cream-100">
      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto pb-24">
        {renderContent()}
      </main>

      {/* Bottom Navigation */}
      <BottomNav activeTab={activeTab} setActiveTab={setActiveTab} />
    </div>
  );
}
