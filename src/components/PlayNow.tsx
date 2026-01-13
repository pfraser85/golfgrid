export default function PlayNow() {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Play Now</h1>
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Search by ZIP Code
        </label>
        <input
          type="text"
          placeholder="Enter ZIP code"
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
        />
      </div>
      <div className="text-center text-gray-500 py-12">
        <p className="text-lg">⛳</p>
        <p className="mt-2">Search for courses near you</p>
      </div>
    </div>
  );
}
