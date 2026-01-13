export default function Friends() {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Friends</h1>
      <div className="mb-6">
        <input
          type="text"
          placeholder="Search for friends..."
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
        />
      </div>
      <div className="text-center text-gray-500 py-12">
        <p className="text-4xl">👥</p>
        <p className="mt-4 text-lg">No friends yet</p>
        <p className="mt-2 text-sm">Search and add friends to start planning golf outings</p>
      </div>
    </div>
  );
}
