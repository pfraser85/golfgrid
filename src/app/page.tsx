"use client";

import { useState } from "react";
import BottomNav from "@/components/BottomNav";
import Calendar from "@/components/Calendar";
import PlayNow from "@/components/PlayNow";
import Friends from "@/components/Friends";
import Profile from "@/components/Profile";
import Messages from "@/components/Messages";

export default function Home() {
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
