import { useState } from "react";
import { ArrowLeft, Clock, Tag, Lightbulb, BookOpen, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";

const PromptDetail = () => {
  const [response, setResponse] = useState("");
  const [isWriting, setIsWriting] = useState(false);

  const prompt = {
    id: 1,
    title: "Reflecting on Personal Growth",
    question: "Think about a challenge you faced in the past year. How did you overcome it, and what did you learn about yourself in the process?",
    category: "Self-Discovery",
    difficulty: "Deep",
    estimatedTime: "15-20 minutes",
    tags: ["growth", "challenges", "reflection", "learning"],
    description: "This prompt encourages deep reflection on personal experiences and growth. Take your time to explore your thoughts and feelings about overcoming difficulties.",
    tips: [
      "Be honest about your struggles and victories",
      "Focus on specific details and emotions",
      "Consider how this experience changed your perspective",
      "Think about skills or strengths you discovered"
    ],
    relatedPrompts: [
      "What are three things you're most grateful for today?",
      "Describe a moment when you felt truly proud of yourself",
      "What would you tell your younger self about facing challenges?"
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

  const handleStartWriting = () => {
    setIsWriting(true);
  };

  const handleSaveResponse = () => {
    // Save the response
    console.log("Saving response:", response);
    // Reset or navigate
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Header */}
      <div className="mb-6">
        <Button variant="ghost" size="sm" className="mb-4 -ml-2">
          <ArrowLeft size={16} className="mr-2" />
          Back to Prompts
        </Button>
        
        <div className="space-y-3">
          <div className="flex flex-wrap items-center gap-2">
            <Badge variant="outline" className="text-xs">
              {prompt.category}
            </Badge>
            <Badge className={`text-xs border ${getDifficultyColor(prompt.difficulty)}`}>
              {prompt.difficulty}
            </Badge>
            <div className="flex items-center text-xs text-muted-foreground">
              <Clock size={12} className="mr-1" />
              {prompt.estimatedTime}
            </div>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-foreground">{prompt.title}</h1>
        </div>
      </div>

      {/* Prompt Card */}
      <Card className="border-0 shadow-soft">
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center space-x-2 text-lg">
            <div className="p-2 bg-gradient-subtle rounded-lg">
              <Lightbulb size={20} className="text-primary" />
            </div>
            <span>Writing Prompt</span>
          </CardTitle>
        </CardHeader>
        <Separator />
        <CardContent className="pt-6">
          <blockquote className="text-lg text-foreground leading-relaxed mb-4 p-4 bg-gradient-subtle rounded-lg border-l-4 border-primary">
            {prompt.question}
          </blockquote>
          
          <p className="text-muted-foreground mb-4 leading-relaxed">
            {prompt.description}
          </p>

          <div className="flex flex-wrap items-center gap-2">
            <Tag size={14} className="text-muted-foreground" />
            {prompt.tags.map((tag) => (
              <Badge key={tag} variant="outline" className="text-xs">
                #{tag}
              </Badge>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Writing Tips */}
      <Card className="border-0 shadow-soft">
        <CardHeader className="pb-4">
          <CardTitle className="text-lg">Writing Tips</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2">
            {prompt.tips.map((tip, index) => (
              <li key={index} className="flex items-start space-x-2 text-sm">
                <div className="w-1.5 h-1.5 bg-primary rounded-full mt-2 flex-shrink-0" />
                <span className="text-muted-foreground leading-relaxed">{tip}</span>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>

      {/* Writing Area */}
      <Card className="border-0 shadow-soft">
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg">Your Response</CardTitle>
            {!isWriting && (
              <Button onClick={handleStartWriting} className="bg-gradient-hero text-primary-foreground">
                <BookOpen size={16} className="mr-2" />
                Start Writing
              </Button>
            )}
          </div>
        </CardHeader>
        <Separator />
        <CardContent className="pt-6">
          {isWriting ? (
            <div className="space-y-4">
              <Textarea
                value={response}
                onChange={(e) => setResponse(e.target.value)}
                placeholder="Start writing your thoughts here... Take your time and be authentic with your response."
                className="min-h-96 resize-none border-0 p-4 focus:ring-0 text-base leading-relaxed bg-gradient-subtle"
              />
              <div className="flex items-center justify-between">
                <span className="text-xs text-muted-foreground">
                  {response.length} characters • {response.split(' ').filter(word => word.length > 0).length} words
                </span>
                <div className="flex space-x-2">
                  <Button variant="outline" onClick={() => setIsWriting(false)}>
                    Cancel
                  </Button>
                  <Button 
                    onClick={handleSaveResponse}
                    className="bg-gradient-hero text-primary-foreground"
                    disabled={response.trim().length === 0}
                  >
                    <Send size={16} className="mr-2" />
                    Save Entry
                  </Button>
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center py-12 space-y-4">
              <div className="w-16 h-16 bg-gradient-subtle rounded-full flex items-center justify-center mx-auto">
                <BookOpen size={24} className="text-primary" />
              </div>
              <div>
                <h3 className="font-medium text-foreground mb-2">Ready to Reflect?</h3>
                <p className="text-sm text-muted-foreground max-w-sm mx-auto">
                  Click "Start Writing" to begin your journaling session. Take your time and write from the heart.
                </p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Related Prompts */}
      <Card className="border-0 shadow-soft">
        <CardHeader className="pb-4">
          <CardTitle className="text-lg">Related Prompts</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {prompt.relatedPrompts.map((relatedPrompt, index) => (
              <div key={index} className="p-3 bg-gradient-subtle rounded-lg border hover:shadow-soft transition-all cursor-pointer group">
                <p className="text-sm text-foreground group-hover:text-primary transition-colors">
                  {relatedPrompt}
                </p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default PromptDetail;