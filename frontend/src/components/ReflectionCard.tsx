import { Edit, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface ReflectionCardProps {
  reflection: {
    id: number;
    title: string;
    date: string;
    preview: string;
    mood: string;
    tags: string[];
    wordCount: number;
  };
  moodColors: Record<string, string>;
}

const ReflectionCard = ({ reflection, moodColors }: ReflectionCardProps) => {
  return (
    <Card className="border-0 shadow-soft hover:shadow-elevated transition-all duration-300 group">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="space-y-1 flex-1">
            <CardTitle className="text-lg group-hover:text-primary transition-colors">
              {reflection.title}
            </CardTitle>
            <p className="text-sm text-muted-foreground">{reflection.date}</p>
          </div>
          <div className="flex items-center space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
            <Button size="sm" variant="ghost" className="p-2">
              <Edit size={14} />
            </Button>
            <Button size="sm" variant="ghost" className="p-2 hover:text-destructive">
              <Trash2 size={14} />
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-muted-foreground mb-4 line-clamp-2">
          {reflection.preview}
        </p>
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-2">
            <Badge 
              variant="secondary" 
              className={`${moodColors[reflection.mood]} border`}
            >
              {reflection.mood}
            </Badge>
            {reflection.tags.map((tag) => (
              <Badge key={tag} variant="outline" className="text-xs">
                #{tag}
              </Badge>
            ))}
          </div>
          <span className="text-xs text-muted-foreground">
            {reflection.wordCount} words
          </span>
        </div>
      </CardContent>
    </Card>
  );
};

export default ReflectionCard;