import { useState } from "react";
import { Lightbulb, Search, Filter, Shuffle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import StatsCard from "@/components/StatsCard";
import PromptCard from "@/components/PromptCard";
import { Clock, ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";

const PromptPage = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");

  const prompts = {
    daily: [
      {
        id: 1,
        title: "Morning Gratitude",
        question: "What are three things you're grateful for today, and why?",
        category: "Gratitude",
        difficulty: "Easy",
        estimatedTime: "5-10 min",
        tags: ["gratitude", "morning", "positive"]
      },
      {
        id: 2,
        title: "Today's Intention",
        question: "What do you want to focus on today, and how will you make it happen?",
        category: "Planning",
        difficulty: "Easy", 
        estimatedTime: "5-10 min",
        tags: ["intention", "goals", "planning"]
      }
    ],
    reflection: [
      {
        id: 3,
        title: "Personal Growth",
        question: "Think about a challenge you faced recently. How did you handle it, and what did you learn?",
        category: "Self-Discovery",
        difficulty: "Medium",
        estimatedTime: "15-20 min",
        tags: ["growth", "challenges", "learning"]
      },
      {
        id: 4,
        title: "Values Exploration",
        question: "What values are most important to you, and how do they show up in your daily life?",
        category: "Self-Discovery",
        difficulty: "Deep",
        estimatedTime: "20-30 min",
        tags: ["values", "identity", "beliefs"]
      }
    ],
    creative: [
      {
        id: 5,
        title: "Future Self Letter",
        question: "Write a letter to yourself one year from now. What would you want them to know?",
        category: "Future Visioning",
        difficulty: "Medium",
        estimatedTime: "15-25 min",
        tags: ["future", "goals", "advice"]
      },
      {
        id: 6,
        title: "Perfect Day",
        question: "Describe your perfect day from start to finish. What makes it perfect?",
        category: "Visualization",
        difficulty: "Easy",
        estimatedTime: "10-15 min",
        tags: ["dreams", "lifestyle", "happiness"]
      }
    ]
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "Easy": return "bg-green-100 text-green-800 border-green-200";
      case "Medium": return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "Deep": return "bg-purple-100 text-purple-800 border-purple-200";
      default: return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const handleStartWriting = (promptId: number) => {
    navigate('/dashboard/prompt-detail', { state: { promptId } });
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-foreground">Writing Prompts</h1>
          <p className="text-muted-foreground mt-1">Discover thought-provoking prompts to inspire your journaling</p>
        </div>
        <Button className="bg-gradient-hero text-primary-foreground">
          <Shuffle size={16} className="mr-2" />
          Random Prompt
        </Button>
      </div>

      {/* Search */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search prompts..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <StatsCard 
          icon={<Lightbulb size={20} className="text-primary" />}
          label="Total Prompts"
          value="124"
        />
        <StatsCard 
          icon={<Clock size={20} className="text-primary" />}
          label="Completed"
          value="23"
        />
        <StatsCard 
          icon={<ArrowRight size={20} className="text-primary" />}
          label="In Progress"
          value="2"
        />
      </div>

      {/* Daily Prompts */}
      <div className="space-y-6">
        <div>
          <h2 className="text-xl font-semibold text-foreground mb-4">Daily Prompts</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {prompts.daily.map((prompt) => (
              <PromptCard 
                key={prompt.id} 
                prompt={prompt} 
                getDifficultyColor={getDifficultyColor}
                onStartWriting={handleStartWriting}
              />
            ))}
          </div>
        </div>

        <div>
          <h2 className="text-xl font-semibold text-foreground mb-4">Deep Reflection</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {prompts.reflection.map((prompt) => (
              <PromptCard 
                key={prompt.id} 
                prompt={prompt} 
                getDifficultyColor={getDifficultyColor}
                onStartWriting={handleStartWriting}
              />
            ))}
          </div>
        </div>

        <div>
          <h2 className="text-xl font-semibold text-foreground mb-4">Creative Writing</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {prompts.creative.map((prompt) => (
              <PromptCard 
                key={prompt.id} 
                prompt={prompt} 
                getDifficultyColor={getDifficultyColor}
                onStartWriting={handleStartWriting}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Load More */}
      <div className="text-center">
        <Button variant="outline" className="w-full sm:w-auto">
          Load More Prompts
        </Button>
      </div>
    </div>
  );
};

export default PromptPage;