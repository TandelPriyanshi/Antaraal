import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Notebook, Edit, Trash2 } from "lucide-react";

interface PromptEntry {
  id: number;
  date: string;
  highlights: string[];
}

export default function PromptPage() {
  const [highlights, setHighlights] = useState<string[]>(["", "", ""]);
  const [savedPrompts, setSavedPrompts] = useState<PromptEntry[]>([]);
  const [editingId, setEditingId] = useState<number | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const stored = localStorage.getItem("dailyPrompts");
    if (stored) setSavedPrompts(JSON.parse(stored));
  }, []);

  const formatDate = (d: Date) =>
    d.toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });

  const handleChange = (index: number, value: string) => {
    const updated = [...highlights];
    updated[index] = value;
    setHighlights(updated);
  };

  const handleSave = () => {
    if (highlights.every((h) => !h.trim())) {
      return alert("Please fill at least one highlight before saving!");
    }

    if (editingId !== null) {
      // Update existing entry
      const updated = savedPrompts.map((p) =>
        p.id === editingId ? { ...p, highlights } : p
      );
      setSavedPrompts(updated);
      localStorage.setItem("dailyPrompts", JSON.stringify(updated));
      setEditingId(null);
      alert("Prompt updated successfully ✅");
    } else {
      // Create new entry
      const today = new Date();
      const newEntry: PromptEntry = {
        id: Date.now(),
        date: formatDate(today),
        highlights,
      };
      const updated = [newEntry, ...savedPrompts];
      setSavedPrompts(updated);
      localStorage.setItem("dailyPrompts", JSON.stringify(updated));
      alert("Prompt saved successfully ✅");
    }

    setHighlights(["", "", ""]);
  };

  const handleEdit = (entry: PromptEntry) => {
    setEditingId(entry.id);
    setHighlights(entry.highlights);
  };

  const handleDelete = (id: number) => {
    if (confirm("Are you sure you want to delete this prompt?")) {
      const updated = savedPrompts.filter((p) => p.id !== id);
      setSavedPrompts(updated);
      localStorage.setItem("dailyPrompts", JSON.stringify(updated));
    }
  };

  return (
    <div className="min-h-screen flex flex-col p-6 font-serif bg-[#fff9f5]">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-[#5C4033]">
          ✨ Daily Highlights
        </h1>
        <button
          onClick={() => navigate(-1)}
          className="px-4 py-2 bg-[#5C4033] text-white rounded-lg shadow hover:bg-[#3E2B23]"
        >
          ← Back
        </button>
      </div>

      {/* Input Section */}
      <div className="bg-[#F9F9F9] p-6 rounded-2xl shadow-md border border-[#E0E0E0] mb-6">
        <h3 className="flex items-center gap-2 text-lg font-semibold text-[#5C4033]">
          <Notebook /> What 3 things mattered today?
        </h3>
        <div className="space-y-3 mt-4">
          {highlights.map((h, i) => (
            <input
              key={i}
              type="text"
              value={h}
              onChange={(e) => handleChange(i, e.target.value)}
              placeholder={`Highlight ${i + 1}`}
              className="w-full p-3 rounded-lg border border-[#DDD] bg-white text-[#2E1F1A]"
            />
          ))}
        </div>

        <div className="flex justify-end mt-4">
          <button
            onClick={handleSave}
            className="px-4 py-2 bg-[#5C4033] text-white rounded-lg shadow hover:bg-[#3E2B23]"
          >
            {editingId ? "Update" : "Save"}
          </button>
        </div>
      </div>

      {/* Saved Prompts */}
      <h2 className="text-lg font-bold text-[#5C4033] mb-3">📖 Saved Prompts</h2>
      <div className="space-y-3">
        {savedPrompts.length > 0 ? (
          savedPrompts.map((p) => (
            <div
              key={p.id}
              className="relative bg-white p-4 rounded-lg shadow-md border border-[#DDD] hover:bg-[#f3f3f3] transition"
            >
              <h3 className="text-sm font-semibold text-[#2E1F1A]">{p.date}</h3>
              <p className="text-xs text-[#777] italic mt-1 cursor-pointer"
                onClick={() => navigate(`/prompt/${p.id}`)}
              >
                Click to view details →
              </p>

              {/* Action buttons */}
              <div className="absolute top-2 right-2 flex gap-2">
                <button
                  onClick={() => handleEdit(p)}
                  className="p-1 rounded hover:bg-[#eee]"
                >
                  <Edit size={16} />
                </button>
                <button
                  onClick={() => handleDelete(p.id)}
                  className="p-1 rounded hover:bg-[#eee]"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          ))
        ) : (
          <p className="text-sm text-[#888] italic">No prompts saved yet.</p>
        )}
      </div>
    </div>
  );
}
