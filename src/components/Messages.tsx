export default function Messages() {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Messages & Activity</h1>
      <div className="space-y-4">
        <div className="bg-white rounded-lg shadow p-4 border-l-4 border-blue-500">
          <p className="text-sm text-gray-500">Today at 2:30 PM</p>
          <p className="font-medium mt-1">Welcome to GolfGrid!</p>
          <p className="text-sm text-gray-600 mt-1">
            Start by adding friends and marking your availability on the calendar.
          </p>
        </div>
      </div>
    </div>
  );
}
