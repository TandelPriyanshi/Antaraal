import { useState } from "react";
import { ArrowLeft, Calendar, Clock, Edit, Share, Bookmark, Tag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { useParams, useNavigate } from "react-router-dom";
import { useEntries } from "@/contexts/EntriesContext";
import { useToast } from "@/hooks/use-toast";

const EntryDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { getEntry, updateEntry } = useEntries();
  const { toast } = useToast();
  
  const entry = getEntry(id || '');
  const [isEditing, setIsEditing] = useState(false);
  const [content, setContent] = useState(entry?.content || '');

  if (!entry) {
    return (
      <div className="max-w-3xl mx-auto text-center py-12">
        <h1 className="text-2xl font-bold text-foreground mb-4">Entry Not Found</h1>
        <p className="text-muted-foreground mb-6">The entry you're looking for does not exist.</p>
        <Button onClick={() => navigate('/dashboard/entries')}>
          <ArrowLeft size={16} className="mr-2" />
          Back to Entries
        </Button>
      </div>
    );
  }

  const handleSave = () => {
    const wordCount = content.split(' ').filter(word => word.length > 0).length;
    updateEntry(entry.id, {
      content,
      wordCount,
      readTime: `${Math.ceil(wordCount / 200)} min read`
    });
    
    toast({
      title: "Entry Updated!",
      description: "Your changes have been saved successfully.",
    });
    
    setIsEditing(false);
  };

  const moodColors: Record<string, string> = {
    "Happy": "bg-emerald-100 text-emerald-800 border-emerald-200",
    "Grateful": "bg-green-100 text-green-800 border-green-200",
    "Peaceful": "bg-blue-100 text-blue-800 border-blue-200",
    "Excited": "bg-yellow-100 text-yellow-800 border-yellow-200",
    "Reflective": "bg-purple-100 text-purple-800 border-purple-200",
    "Determined": "bg-orange-100 text-orange-800 border-orange-200",
    "Anxious": "bg-red-100 text-red-800 border-red-200",
    "Hopeful": "bg-teal-100 text-teal-800 border-teal-200",
    "Nostalgic": "bg-indigo-100 text-indigo-800 border-indigo-200",
    "Content": "bg-green-100 text-green-800 border-green-200"
  };
  
  const moodColor = moodColors[entry.mood] || "bg-gray-100 text-gray-800 border-gray-200";

  return (
    <div className="max-w-3xl mx-auto">
      {/* Header */}
      <div className="mb-6">
        <Button variant="ghost" size="sm" className="mb-4 -ml-2" onClick={() => navigate('/dashboard/entries')}>
          <ArrowLeft size={16} className="mr-2" />
          Back to Entries
        </Button>
        
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between space-y-4 sm:space-y-0">
          <div className="space-y-2">
            <h1 className="text-2xl sm:text-3xl font-bold text-foreground">{entry.title}</h1>
            <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
              <div className="flex items-center space-x-1">
                <Calendar size={14} />
                <span>{entry.date}</span>
              </div>
              <div className="flex items-center space-x-1">
                <Clock size={14} />
                <span>{entry.time}</span>
              </div>
              <span>{entry.readTime}</span>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <Button size="sm" variant="outline">
              <Share size={14} className="mr-2" />
              Share
            </Button>
            <Button size="sm" variant="outline">
              <Bookmark size={14} className="mr-2" />
              Save
            </Button>
            <Button 
              size="sm" 
              onClick={isEditing ? handleSave : () => setIsEditing(true)}
              className={isEditing ? "bg-gradient-hero text-primary-foreground" : ""}
            >
              <Edit size={14} className="mr-2" />
              {isEditing ? "Save" : "Edit"}
            </Button>
          </div>
        </div>
      </div>

      {/* Entry Metadata */}
      <Card className="mb-6 border-0 shadow-soft">
        <CardContent className="p-4">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex flex-wrap items-center gap-3">
              <Badge className={`${moodColor} border`}>
                {entry.mood}
              </Badge>
              <div className="flex flex-wrap items-center gap-1">
                <Tag size={14} className="text-muted-foreground" />
                {entry.tags.map((tag) => (
                  <Badge key={tag} variant="outline" className="text-xs">
                    #{tag}
                  </Badge>
                ))}
              </div>
            </div>
            <span className="text-sm text-muted-foreground">
              {entry.wordCount} words
            </span>
          </div>
        </CardContent>
      </Card>

      {/* Entry Content */}
      <Card className="border-0 shadow-soft">
        <CardHeader className="pb-4">
          <h2 className="text-lg font-semibold text-foreground">Entry Content</h2>
        </CardHeader>
        <Separator />
        <CardContent className="p-6">
          {isEditing ? (
            <Textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="min-h-96 resize-none border-0 p-0 focus:ring-0 text-base leading-relaxed"
              placeholder="Write your thoughts here..."
            />
          ) : (
            <div className="prose prose-gray max-w-none">
              {content.split('\n').map((paragraph, index) => (
                paragraph.trim() && (
                  <p key={index} className="mb-4 text-foreground leading-relaxed">
                    {paragraph}
                  </p>
                )
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* AI Insights */}
      <Card className="mt-6 border-0 shadow-soft bg-gradient-subtle">
        <CardHeader className="pb-4">
          <h3 className="text-lg font-semibold text-foreground flex items-center">
            <div className="w-6 h-6 bg-gradient-hero rounded-full flex items-center justify-center mr-3">
              <span className="text-primary-foreground font-bold text-xs">AI</span>
            </div>
            Insights & Patterns
          </h3>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="p-4 bg-card rounded-lg border">
              <h4 className="font-medium text-foreground mb-2">Emotional Tone</h4>
              <p className="text-sm text-muted-foreground">
                This entry reflects a positive, grateful mindset with themes of personal growth and family connection.
              </p>
            </div>
            <div className="p-4 bg-card rounded-lg border">
              <h4 className="font-medium text-foreground mb-2">Recurring Themes</h4>
              <p className="text-sm text-muted-foreground">
                Productivity, meditation, and family connections appear frequently in your recent entries.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default EntryDetail;