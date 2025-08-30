import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { useEffect, useState } from "react";

interface JournalEntry {
  id: number;
  date: string;
  content: string;
}

export default function EntryDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [entry, setEntry] = useState<JournalEntry | null>(null);

  useEffect(() => {
    const stored = localStorage.getItem("dailyReflections");
    if (stored) {
      const entries: JournalEntry[] = JSON.parse(stored);
      const found = entries.find((e) => e.id === Number(id));
      if (found) setEntry(found);
    }
  }, [id]);

  if (!entry) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center">
        <p className="text-gray-500">Entry not found.</p>
        <button
          onClick={() => navigate("/")}
          className="mt-4 px-4 py-2 bg-gray-200 rounded-lg"
        >
          Go Back
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-6 bg-gradient-to-br from-soft to-soft-light font-serif">
      <div className="bg-white p-6 rounded-2xl shadow-md max-w-3xl mx-auto">
        {/* Back button inside the white box */}
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 mb-4 text-gray-600 hover:text-gray-800"
        >
          <ArrowLeft className="w-5 h-5" /> Back
        </button>

        <h2 className="text-xl font-bold text-gray-800">{entry.date}</h2>
        <p className="mt-4 text-gray-700 whitespace-pre-line break-words">
          {entry.content}
        </p>
      </div>
    </div>
  );
}
