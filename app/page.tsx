// src/app/page.tsx
export default function Home() {
  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <div className="w-1/3 bg-gray-100 p-4 border-r border-gray-300">
      <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
  <img src="favicon.ico" alt="Logo" className="w-8 h-8" />
  📋 TODO List
</h2>

        {/* Placeholder TODOs */}
        <div className="space-y-2">
          <div className="p-3 bg-white rounded shadow hover:bg-gray-50 cursor-pointer">
            New Additions
          </div>
          <div className="p-3 bg-white rounded shadow hover:bg-gray-50 cursor-pointer">
            Research Update
          </div>
        </div>
      </div>

      {/* Details */}
      <div className="w-2/3 p-6">
        <h2 className="text-2xl font-semibold mb-4">📝 New Additions</h2>
        <textarea
          className="w-full h-60 border border-gray-300 rounded p-4 resize-none"
          defaultValue="To stay representative of framework & new example apps."
        ></textarea>
      </div>
    </div>
  );
}
