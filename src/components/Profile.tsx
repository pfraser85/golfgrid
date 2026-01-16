"use client";

import { useAuth } from "@/contexts/AuthContext";

export default function Profile() {
  const { user, signOut } = useAuth();

  const handleSignOut = async () => {
    try {
      await signOut();
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  // Get user metadata
  const fullName = user?.user_metadata?.full_name || "User";
  const email = user?.email || "";

  return (
    <div className="min-h-screen bg-cream-100">
      <div className="max-w-2xl mx-auto p-6">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-navy mb-2">Profile</h1>
          <p className="text-gray-600">Manage your GolfGrid account</p>
        </div>

        {/* Profile Card */}
        <div className="bg-white rounded-2xl shadow-md border border-gray-200 p-8">
          {/* Profile Picture Section */}
          <div className="flex flex-col items-center mb-8 pb-8 border-b border-gray-200">
            <div className="w-32 h-32 bg-gradient-to-br from-gold to-gold/70 rounded-full flex items-center justify-center text-6xl mb-4 shadow-lg">
              ⛳
            </div>
            <h2 className="text-2xl font-bold text-navy mb-1">{fullName}</h2>
            <p className="text-gray-600">{email}</p>
          </div>

          {/* Account Information */}
          <div className="space-y-6 mb-8">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Full Name
              </label>
              <div className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-900">
                {fullName}
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Email Address
              </label>
              <div className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-900">
                {email}
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                User ID
              </label>
              <div className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-600 text-sm font-mono break-all">
                {user?.id}
              </div>
            </div>
          </div>

          {/* Sign Out Button */}
          <div className="pt-6 border-t border-gray-200">
            <button
              onClick={handleSignOut}
              className="w-full bg-red-600 hover:bg-red-700 text-white font-semibold py-4 px-6 rounded-xl transition-all duration-200 shadow-md hover:shadow-lg"
            >
              Sign Out
            </button>
          </div>
        </div>

        {/* Additional Info */}
        <div className="mt-6 text-center text-sm text-gray-600">
          <p>Need help? Contact support at support@golfgrid.com</p>
        </div>
      </div>
    </div>
  );
}
