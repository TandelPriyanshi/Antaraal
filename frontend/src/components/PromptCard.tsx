import { Clock, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface PromptCardProps {
  prompt: {
    id: number;
    title: string;
    question: string;
    category: string;
    difficulty: string;
    estimatedTime: string;
    tags: string[];
  };
  getDifficultyColor: (difficulty: string) => string;
  onStartWriting?: (promptId: number) => void;
}

const PromptCard = ({ prompt, getDifficultyColor, onStartWriting }: PromptCardProps) => {
  return (
    <Card className="border-0 shadow-soft hover:shadow-elevated transition-all duration-300 group cursor-pointer">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="space-y-2 flex-1">
            <div className="flex items-center space-x-2">
              <Badge variant="outline" className="text-xs">
                {prompt.category}
              </Badge>
              <Badge className={`text-xs border ${getDifficultyColor(prompt.difficulty)}`}>
                {prompt.difficulty}
              </Badge>
            </div>
            <CardTitle className="text-lg group-hover:text-primary transition-colors">
              {prompt.title}
            </CardTitle>
          </div>
          <div className="flex items-center text-xs text-muted-foreground">
            <Clock size={12} className="mr-1" />
            {prompt.estimatedTime}
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-muted-foreground mb-4 leading-relaxed line-clamp-2">
          {prompt.question}
        </p>
        <div className="flex items-center justify-between">
          <div className="flex flex-wrap gap-1">
            {prompt.tags.slice(0, 3).map((tag: string) => (
              <Badge key={tag} variant="outline" className="text-xs">
                #{tag}
              </Badge>
            ))}
          </div>
          <Button 
            size="sm" 
            className="bg-gradient-hero text-primary-foreground opacity-0 group-hover:opacity-100 transition-opacity"
            onClick={() => onStartWriting?.(prompt.id)}
          >
            Start Writing
            <ArrowRight size={14} className="ml-1" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default PromptCard;