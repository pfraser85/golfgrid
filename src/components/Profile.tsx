export default function Profile() {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Profile</h1>
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex flex-col items-center mb-6">
          <div className="w-24 h-24 bg-gray-200 rounded-full flex items-center justify-center text-4xl mb-3">
            👤
          </div>
          <button className="text-sm text-primary-600 hover:text-primary-700 font-medium">
            Upload Photo
          </button>
        </div>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Name
            </label>
            <input
              type="text"
              placeholder="Your name"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email
            </label>
            <input
              type="email"
              placeholder="your@email.com"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Handicap
            </label>
            <input
              type="text"
              placeholder="Your handicap"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Privacy Setting
            </label>
            <select className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent">
              <option>Friends Only</option>
              <option>Public Profile</option>
              <option>Private</option>
            </select>
          </div>
        </div>
      </div>
    </div>
  );
}
