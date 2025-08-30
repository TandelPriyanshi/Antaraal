import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "../../contexts/ToastContext";
import Navbar from "../navbar";
import {
  ChevronLeft,
  ChevronRight,
  Notebook,
  Sparkles,
  Edit3,
  Star,
  Trash2,
  Edit,
} from "lucide-react";

interface JournalEntry {
  id: number;
  date: string;
  title: string;
  content: string;
}

export default function DailyReflections() {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [words, setWords] = useState(0);
  const [characters, setCharacters] = useState(0);
  const [savedEntries, setSavedEntries] = useState<JournalEntry[]>([]);
  const [editingId, setEditingId] = useState<number | null>(null);

  const [currentDate, setCurrentDate] = useState<Date>(new Date());
  const [dateTime, setDateTime] = useState<string>(
    new Date().toISOString().slice(0, 16)
  );

  const navigate = useNavigate();
  const { addToast } = useToast();

  const formatDate = (d: Date) =>
    d.toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });

  const isToday = (d: Date) => {
    const now = new Date();
    return (
      d.getFullYear() === now.getFullYear() &&
      d.getMonth() === now.getMonth() &&
      d.getDate() === now.getDate()
    );
  };

  const goPrev = () => {
    setCurrentDate((prev) => {
      const d = new Date(prev);
      d.setDate(d.getDate() - 1);
      setDateTime(d.toISOString().slice(0, 16));
      return d;
    });
  };

  const goNext = () => {
    setCurrentDate((prev) => {
      if (isToday(prev)) return prev;
      const d = new Date(prev);
      d.setDate(d.getDate() + 1);
      const now = new Date();
      if (d > now) return now;
      setDateTime(d.toISOString().slice(0, 16));
      return d;
    });
  };

  useEffect(() => {
    const stored = localStorage.getItem("dailyReflections");
    if (stored) setSavedEntries(JSON.parse(stored));
  }, []);

  const handleContentChange = (value: string) => {
    setContent(value);
    const wordCount = value.trim() ? value.trim().split(/\s+/).length : 0;
    setWords(wordCount);
    setCharacters(value.length);
  };

  const handleTitleChange = (value: string) => {
    setTitle(value);
  };

  const handleClear = () => {
    setTitle("");
    setContent("");
    setWords(0);
    setCharacters(0);
    setEditingId(null);
  };

  const handleSave = () => {
    if (!title.trim()) {
      addToast("Please add a title before saving!", "error");
      return;
    }
    if (!content.trim()) {
      addToast("Please write something before saving!", "error");
      return;
    }

    const pickedDate = new Date(dateTime);

    if (editingId) {
      const updatedEntries = savedEntries.map((e) =>
        e.id === editingId
          ? {
              ...e,
              title: title.trim(),
              content: content.trim(),
              date: formatDate(pickedDate),
            }
          : e
      );
      setSavedEntries(updatedEntries);
      localStorage.setItem("dailyReflections", JSON.stringify(updatedEntries));
      addToast("Entry updated successfully", "success");
    } else {
      const newEntry: JournalEntry = {
        id: Date.now(),
        date: formatDate(pickedDate),
        title: title.trim(),
        content: content.trim(),
      };
      const updatedEntries = [newEntry, ...savedEntries];
      setSavedEntries(updatedEntries);
      localStorage.setItem("dailyReflections", JSON.stringify(updatedEntries));
      addToast("Entry saved successfully", "success");
    }
    handleClear();
  };

  const handleEdit = (id: number) => {
    const entryToEdit = savedEntries.find((e) => e.id === id);
    if (entryToEdit) {
      setTitle(entryToEdit.title);
      setContent(entryToEdit.content);
      setWords(
        entryToEdit.content.trim()
          ? entryToEdit.content.trim().split(/\s+/).length
          : 0
      );
      setCharacters(entryToEdit.content.length);
      setEditingId(id);
      const entryDate = new Date(entryToEdit.date);
      setDateTime(entryDate.toISOString().slice(0, 16));
      setCurrentDate(entryDate);
    }
  };

  const handleDelete = (id: number) => {
    const deleteEntry = () => {
      const updatedEntries = savedEntries.filter((e) => e.id !== id);
      setSavedEntries(updatedEntries);
      localStorage.setItem("dailyReflections", JSON.stringify(updatedEntries));
      addToast("Entry deleted successfully", "success");
    };

    addToast("Are you sure you want to delete this entry?", "info", {
      action: {
        label: "Delete",
        onClick: deleteEntry,
      },
      duration: 10000, // Give user more time to decide
      closeOnClick: false,
    });
  };

  const renderEditor = () => (
    <div className="bg-white p-6 rounded-xl shadow-md">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold text-gray-800">
          {editingId ? "Edit Reflection" : "New Reflection"}
        </h2>
        <div className="flex items-center space-x-2">
          <button
            onClick={handleClear}
            className="p-2 text-gray-500 hover:text-gray-700"
            title="Clear"
          >
            <Trash2 size={20} />
          </button>
        </div>
      </div>

      <div className="mb-4">
        <input
          type="text"
          value={title}
          onChange={(e) => handleTitleChange(e.target.value)}
          placeholder="Title"
          className="w-full p-3 border focus:border-orange-400 rounded-lg focus:ring-2 focus:ring-orange-400 focus:border-transparent resize-none mb-2"
        />
        <textarea
          value={content}
          onChange={(e) => handleContentChange(e.target.value)}
          placeholder="Write your thoughts here..."
          className="w-full h-60 p-4 border rounded-lg focus:ring-2 focus:ring-orange-400 focus:border-transparent resize-none"
        />
      </div>

      <div className="flex justify-between items-center">
        <div className="text-sm text-gray-500">
          {words} words • {characters} characters
        </div>
        <button
          onClick={handleSave}
          className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-2 rounded-lg flex items-center space-x-2 transition-colors"
        >
          <Edit3 size={18} />
          <span>{editingId ? "Update" : "Save"}</span>
        </button>
      </div>
    </div>
  );

  return (
    <div className="mx-h-screen bg-gray-50">
      <Navbar />
      <main className="pt-20 px-6 pb-6 font-serif bg-[#FAF9F6] min-h-screen">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="flex flex-col items-center">
            {/* <div className="flex items-center gap-4">
              <button
                onClick={goPrev}
                className="p-2 bg-[#5C4033] shadow rounded-full"
              >
                <ChevronLeft className="w-5 h-5 text-white" />
              </button>
              <h2 className="text-2xl font-bold text-[#2E1F1A]">
                {formatDate(currentDate)}
              </h2>
              <button
                onClick={goNext}
                disabled={isToday(currentDate)}
                className={`p-2 bg-[#5C4033] shadow rounded-full ${
                  isToday(currentDate) ? "opacity-50 cursor-not-allowed" : ""
                }`}
              >
                <ChevronRight className="w-5 h-5 text-white" />
              </button>
            </div> */}

            {/* <p className="text-sm text-[#8B5E3C] mt-2">
            </p> */}
            <div className="mt-3 flex">
              <div className="pr-5 m-1.5">
                📅 {isToday(currentDate) ? "Today:" : currentDate.toDateString()}
              </div>
              <input
                type="datetime-local"
                value={dateTime}
                onChange={(e) => {
                  setDateTime(e.target.value);
                  setCurrentDate(new Date(e.target.value));
                }}
                className="w-60 p-2 rounded-lg border border-[#8B5E3C] text-[#2E1F1A] text-sm bg-[#F7F7F7]"
              />
            </div>
          </div>

          {/* Main Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 mt-6 flex-grow w-full max-w-7xl mx-auto h-full">
            {/* Left Sidebar */}
            <div className="col-span-1 flex flex-col gap-6 h-full">
              {/* Writing Prompt Card */}
              <div
                onClick={() => navigate("/prompt")}
                className="bg-[#F9F9F9] p-5 rounded-2xl shadow-md flex-grow border border-[#E0E0E0] cursor-pointer hover:bg-[#f0e6dd] transition"
              >
                <h3 className="flex items-center gap-2 text-lg font-semibold text-[#5C4033]">
                  <Edit3 /> Writing Prompt
                </h3>
                <p className="mt-2 text-sm text-[#555]">
                  What three things are most important today?
                </p>
              </div>

              {/* Daily Inspiration Card */}
              <div
                onClick={() => navigate("/inspiration")}
                className="bg-[#F9F9F9] p-5 rounded-2xl shadow-md flex-grow border border-[#E0E0E0] cursor-pointer hover:bg-[#f0e6dd] transition"
              >
                <h3 className="flex items-center gap-2 text-lg font-semibold text-[#5C4033]">
                  <Sparkles /> Daily Inspiration
                </h3>
                <p className="mt-2 text-sm italic text-[#555]">
                  Click to see today’s inspiration 🌟
                </p>
              </div>

              {/* Writing Stats Card */}
              <div
                onClick={() =>
                  navigate("/stats", {
                    state: { words, characters, entries: savedEntries },
                  })
                }
                className="bg-[#F9F9F9] p-5 rounded-2xl shadow-md flex-grow border border-[#E0E0E0] cursor-pointer hover:bg-[#f0e6dd] transition"
              >
                <h3 className="flex items-center gap-2 text-lg font-semibold text-[#5C4033]">
                  <Notebook /> Writing Stats
                </h3>
                <p className="mt-2 text-sm text-[#555]">Words: {words}</p>
                <p className="text-sm text-[#555]">Characters: {characters}</p>
                <p className="text-sm text-[#555]">
                  Reading time: {Math.ceil(words / 200) || 0} min
                </p>
              </div>
            </div>

            {/* Middle Journal */}
            <div className="col-span-3 flex flex-col bg-[#F9F9F9] p-6 rounded-2xl shadow-md h-full border border-[#E0E0E0]">
              {renderEditor()}
            </div>

            {/* Right Sidebar */}
            <div className="col-span-1 bg-[#F9F9F9] p-5 rounded-2xl shadow-md h-full overflow-y-auto border border-[#E0E0E0]">
              <h2 className="text-lg font-bold text-[#5C4033] mb-3">
                📖 Saved Entries
              </h2>
              <div className="space-y-3">
                {savedEntries.length > 0 ? (
                  savedEntries.map((e) => (
                    <div
                      key={e.id}
                      onClick={() =>
                        navigate(`/entry/${e.id}`, { state: { entry: e } })
                      }
                      className="bg-white p-3 rounded-lg border border-[#DDD] cursor-pointer hover:bg-[#F5F5F5] transition"
                    >
                      <h3 className="text-sm font-semibold text-[#2E1F1A]">
                        {e.date}
                      </h3>
                      <p className="text-xs text-[#666] mt-1 line-clamp-3">
                        {e.content}
                      </p>
                      <div className="flex gap-2 mt-2">
                        <button
                          onClick={(ev) => {
                            ev.stopPropagation();
                            handleEdit(e.id);
                          }}
                          className="text-xs flex items-center gap-1 text-[#5C4033] hover:text-[#2E1F1A]"
                        >
                          <Edit className="w-3 h-3" /> Edit
                        </button>
                        <button
                          onClick={(ev) => {
                            ev.stopPropagation();
                            handleDelete(e.id);
                          }}
                          className="text-xs flex items-center gap-1 text-[#5C4033] hover:text-[#2E1F1A]"
                        >
                          <Trash2 className="w-3 h-3" /> Delete
                        </button>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-[#888] italic">No entries yet.</p>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
