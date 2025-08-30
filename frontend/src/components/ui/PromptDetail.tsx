import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

interface PromptEntry {
  id: number;
  date: string;
  highlights: string[];
}

export default function PromptDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [entry, setEntry] = useState<PromptEntry | null>(null);

  useEffect(() => {
    const stored = localStorage.getItem("dailyPrompts");
    if (stored) {
      const prompts: PromptEntry[] = JSON.parse(stored);
      const found = prompts.find((p) => p.id === Number(id));
      if (found) setEntry(found);
    }
  }, [id]);

  if (!entry) {
    return (
      <div className="min-h-screen flex flex-col justify-center items-center bg-[#fff9f5]">
        <p className="text-gray-500">Prompt not found.</p>
        <button
          onClick={() => navigate(-1)}
          className="mt-4 px-4 py-2 bg-[#5C4033] text-white rounded-lg shadow hover:bg-[#3E2B23]"
        >
          ← Back
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-6 font-serif bg-[#fff9f5]">
      {/* Back Button */}
      <button
        onClick={() => navigate(-1)}
        className="mb-6 px-4 py-2 bg-[#5C4033] text-white rounded-lg shadow hover:bg-[#3E2B23]"
      >
        ← Back
      </button>

      {/* One Box for Date + Highlights */}
      <div className="bg-white p-6 rounded-2xl shadow-md border border-[#DDD] break-words whitespace-pre-wrap">
        {/* Date */}
        <h1 className="text-xl font-bold text-[#5C4033] mb-4">{entry.date}</h1>

        {/* Highlights as Bullet Points */}
        <ul className="list-disc ml-6 text-[#2E1F1A] space-y-2">
          {entry.highlights.map(
            (h, i) =>
              h && (
                <li key={i} className="text-base break-words whitespace-pre-wrap">
                  {h}
                </li>
              )
          )}
        </ul>
      </div>
    </div>
  );
}
