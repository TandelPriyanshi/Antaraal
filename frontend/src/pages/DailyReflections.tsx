import { useState } from "react";
import { Search, Filter } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import StatsCard from "@/components/StatsCard";
import ReflectionCard from "@/components/ReflectionCard";
import { Calendar, Edit, Search as SearchIcon } from "lucide-react";

const DailyReflections = () => {
  const [searchQuery, setSearchQuery] = useState("");

  const reflections = [
    {
      id: 1,
      date: "2024-01-15",
      title: "A Productive Monday",
      preview: "Started the week with great energy. Completed my morning routine and made significant progress on my project...",
      mood: "Happy",
      tags: ["productivity", "work", "motivation"],
      wordCount: 245
    },
    {
      id: 2,
      date: "2024-01-14", 
      title: "Weekend Adventures",
      preview: "Spent time with family and explored the local park. The weather was perfect and I felt grateful for these moments...",
      mood: "Peaceful",
      tags: ["family", "nature", "gratitude"],
      wordCount: 189
    },
    {
      id: 3,
      date: "2024-01-13",
      title: "Learning Something New",
      preview: "Today I challenged myself to learn a new skill. It was difficult at first, but I persevered and made progress...",
      mood: "Determined",
      tags: ["learning", "growth", "challenge"],
      wordCount: 312
    }
  ];

  const moodColors = {
    "Happy": "bg-emerald-100 text-emerald-800 border-emerald-200",
    "Peaceful": "bg-blue-100 text-blue-800 border-blue-200",
    "Determined": "bg-orange-100 text-orange-800 border-orange-200"
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-foreground">Daily Reflections</h1>
          <p className="text-muted-foreground mt-1">Capture your thoughts and emotions each day</p>
        </div>
      </div>

      {/* Search */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <SearchIcon size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search reflections..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <StatsCard 
          icon={<Calendar size={20} className="text-primary" />}
          label="Total Entries"
          value="42"
        />
        <StatsCard 
          icon={<Edit size={20} className="text-primary" />}
          label="This Month"
          value="12"
        />
        <StatsCard 
          icon={<SearchIcon size={20} className="text-primary" />}
          label="Words Written"
          value="8,456"
        />
      </div>

      {/* Reflections List */}
      <div className="space-y-4">
        {reflections.map((reflection) => (
          <ReflectionCard 
            key={reflection.id}
            reflection={reflection}
            moodColors={moodColors}
          />
        ))}
      </div>

      {/* Load More */}
      <div className="text-center">
        <Button variant="outline" className="w-full sm:w-auto">
          Load More Reflections
        </Button>
      </div>
    </div>
  );
};

export default DailyReflections;