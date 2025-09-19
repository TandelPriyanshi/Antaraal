import { useState } from "react";
import { Lightbulb, Quote, BookOpen, Heart, Star, Shuffle, Filter } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const InspirationPage = () => {
  const [searchQuery, setSearchQuery] = useState("");

  const quotes = [
    {
      id: 1,
      text: "The only way to do great work is to love what you do.",
      author: "Steve Jobs",
      category: "Motivation",
      saved: true
    },
    {
      id: 2,
      text: "Life is what happens when you're busy making other plans.",
      author: "John Lennon",
      category: "Life",
      saved: false
    },
    {
      id: 3,
      text: "The future belongs to those who believe in the beauty of their dreams.",
      author: "Eleanor Roosevelt",
      category: "Dreams",
      saved: true
    }
  ];

  const stories = [
    {
      id: 1,
      title: "The Power of Small Habits",
      author: "James Clear",
      excerpt: "We all deal with setbacks but in the long run, the quality of our lives often depends on the quality of the habits we follow.",
      readTime: "5 min",
      category: "Personal Growth",
      saved: false
    },
    {
      id: 2,
      title: "Finding Purpose in Daily Life",
      author: "Viktor Frankl", 
      excerpt: "Everything can be taken from a person but one thing: the last of human freedoms - to choose one's attitude in any given circumstances.",
      readTime: "8 min",
      category: "Philosophy",
      saved: true
    }
  ];

  const prompts = [
    {
      id: 1,
      text: "What are three things that made you smile today?",
      category: "Gratitude",
      difficulty: "Easy"
    },
    {
      id: 2,
      text: "Describe a moment when you felt completely at peace. What was happening around you?",
      category: "Mindfulness",
      difficulty: "Medium"
    },
    {
      id: 3,
      text: "If you could give advice to yourself from five years ago, what would you say?",
      category: "Reflection",
      difficulty: "Deep"
    }
  ];

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "Easy": return "bg-green-100 text-green-800 border-green-200";
      case "Medium": return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "Deep": return "bg-purple-100 text-purple-800 border-purple-200";
      default: return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-foreground">Inspiration Hub</h1>
          <p className="text-muted-foreground mt-1">Discover quotes, stories, and prompts to fuel your journaling</p>
        </div>
        <Button className="bg-gradient-hero text-primary-foreground">
          <Shuffle size={16} className="mr-2" />
          Random Inspiration
        </Button>
      </div>

      {/* Search */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <BookOpen size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search inspiration..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      {/* Content Tabs */}
      <Tabs defaultValue="quotes" className="w-full">
        <TabsList className="grid w-full grid-cols-3 mb-6">
          <TabsTrigger value="quotes" className="flex items-center space-x-2">
            <Quote size={16} />
            <span>Quotes</span>
          </TabsTrigger>
          <TabsTrigger value="stories" className="flex items-center space-x-2">
            <BookOpen size={16} />
            <span>Stories</span>
          </TabsTrigger>
          <TabsTrigger value="prompts" className="flex items-center space-x-2">
            <Lightbulb size={16} />
            <span>Prompts</span>
          </TabsTrigger>
        </TabsList>

        {/* Quotes Tab */}
        <TabsContent value="quotes" className="space-y-4">
          {quotes.map((quote) => (
            <Card key={quote.id} className="border-0 shadow-soft hover:shadow-elevated transition-all duration-300 group">
              <CardContent className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <Quote size={24} className="text-primary opacity-50 flex-shrink-0" />
                  <Button 
                    size="sm" 
                    variant="ghost" 
                    className={`p-2 ${quote.saved ? 'text-red-500' : 'opacity-0 group-hover:opacity-100'} transition-all`}
                  >
                    <Heart size={16} fill={quote.saved ? "currentColor" : "none"} />
                  </Button>
                </div>
                <blockquote className="text-lg text-foreground mb-4 leading-relaxed">
                  "{quote.text}"
                </blockquote>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <span className="text-sm font-medium text-muted-foreground">— {quote.author}</span>
                    <Badge variant="outline" className="text-xs">
                      {quote.category}
                    </Badge>
                  </div>
                  <Button size="sm" variant="outline">
                    Use as Prompt
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        {/* Stories Tab */}
        <TabsContent value="stories" className="space-y-4">
          {stories.map((story) => (
            <Card key={story.id} className="border-0 shadow-soft hover:shadow-elevated transition-all duration-300 group">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="space-y-1 flex-1">
                    <CardTitle className="text-lg group-hover:text-primary transition-colors">
                      {story.title}
                    </CardTitle>
                    <p className="text-sm text-muted-foreground">by {story.author}</p>
                  </div>
                  <Button 
                    size="sm" 
                    variant="ghost" 
                    className={`p-2 ${story.saved ? 'text-red-500' : 'opacity-0 group-hover:opacity-100'} transition-all`}
                  >
                    <Heart size={16} fill={story.saved ? "currentColor" : "none"} />
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-4 leading-relaxed">
                  {story.excerpt}
                </p>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <Badge variant="outline" className="text-xs">
                      {story.category}
                    </Badge>
                    <span className="text-xs text-muted-foreground">{story.readTime}</span>
                  </div>
                  <Button size="sm" className="bg-gradient-hero text-primary-foreground">
                    Read More
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        {/* Prompts Tab */}
        <TabsContent value="prompts" className="space-y-4">
          {prompts.map((prompt) => (
            <Card key={prompt.id} className="border-0 shadow-soft hover:shadow-elevated transition-all duration-300 group">
              <CardContent className="p-6">
                <div className="flex items-start space-x-4">
                  <div className="p-3 bg-gradient-subtle rounded-lg flex-shrink-0">
                    <Lightbulb size={20} className="text-primary" />
                  </div>
                  <div className="flex-1 space-y-3">
                    <p className="text-foreground font-medium leading-relaxed">
                      {prompt.text}
                    </p>
                    <div className="flex flex-wrap items-center justify-between gap-3">
                      <div className="flex items-center space-x-2">
                        <Badge variant="outline" className="text-xs">
                          {prompt.category}
                        </Badge>
                        <Badge className={`text-xs border ${getDifficultyColor(prompt.difficulty)}`}>
                          {prompt.difficulty}
                        </Badge>
                      </div>
                      <Button size="sm" className="bg-gradient-hero text-primary-foreground">
                        Start Writing
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>
      </Tabs>

      {/* Daily Inspiration Card */}
      <Card className="border-0 shadow-elevated bg-gradient-hero text-primary-foreground">
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center space-x-2">
            <Star size={20} />
            <span>Today's Inspiration</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <blockquote className="text-lg mb-4 leading-relaxed opacity-90">
            "The journey of a thousand miles begins with one step."
          </blockquote>
          <p className="text-sm opacity-75">— Lao Tzu</p>
          <Button variant="secondary" size="sm" className="mt-4">
            Reflect on This
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default InspirationPage;