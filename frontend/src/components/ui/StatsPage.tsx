import { useLocation, useNavigate } from "react-router-dom";

export default function StatsPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const { words = 0, characters = 0, entries = [] } = location.state || {};

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#f9f9f9] p-6">
      <h1 className="text-2xl font-bold text-[#5C4033] mb-6">📊 Writing Stats</h1>

      <div className="bg-white shadow-lg rounded-2xl p-6 w-full max-w-lg">
        <p className="text-lg text-[#2E1F1A] mb-2">📝 Total Words: {words}</p>
        <p className="text-lg text-[#2E1F1A] mb-2">
          ✍️ Total Characters: {characters}
        </p>
        <p className="text-lg text-[#2E1F1A] mb-6">
          📖 Estimated Reading Time: {Math.ceil(words / 200) || 0} min
        </p>

        <h2 className="text-xl font-semibold text-[#5C4033] mb-4">
          📖 Saved Entries
        </h2>
        <div className="space-y-3 max-h-64 overflow-y-auto">
          {entries.length > 0 ? (
            entries.map((e: any) => (
              <div
                key={e.id}
                className="bg-[#F9F9F9] p-3 rounded-lg border border-[#DDD]"
              >
                <h3 className="text-sm font-semibold text-[#2E1F1A]">
                  {e.date}
                </h3>
                <p className="text-xs text-[#666] mt-1">{e.content}</p>
              </div>
            ))
          ) : (
            <p className="text-sm text-[#888] italic">No entries yet.</p>
          )}
        </div>
      </div>

      <button
        onClick={() => navigate(-1)}
        className="mt-6 px-4 py-2 bg-[#5C4033] text-white rounded-lg shadow hover:bg-[#3E2B23]"
      >
        ← Back
      </button>
    </div>
  );
}
