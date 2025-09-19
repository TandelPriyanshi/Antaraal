import { useState } from "react";
import { ArrowLeft, Save, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useNavigate } from "react-router-dom";
import { useEntries } from "@/contexts/EntriesContext";
import { useToast } from "@/hooks/use-toast";

const NewEntry = () => {
  const navigate = useNavigate();
  const { addEntry } = useEntries();
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    title: "",
    content: "",
    mood: "",
    tags: ""
  });
  const [isPublishing, setIsPublishing] = useState(false);

  const moods = [
    "Happy", "Grateful", "Peaceful", "Excited", "Reflective", 
    "Determined", "Anxious", "Hopeful", "Nostalgic", "Content"
  ];

  const handleSubmit = async (action: 'save' | 'publish') => {
    setIsPublishing(action === 'publish');
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const now = new Date();
    const newEntry = {
      title: formData.title,
      content: formData.content,
      date: now.toLocaleDateString('en-US', { 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
      }),
      time: now.toLocaleTimeString('en-US', { 
        hour: 'numeric', 
        minute: '2-digit' 
      }),
      mood: formData.mood,
      tags: formData.tags.split(',').map(tag => tag.trim()).filter(tag => tag.length > 0),
      wordCount,
      readTime: `${Math.ceil(wordCount / 200)} min read`
    };
    
    addEntry(newEntry);
    
    toast({
      title: action === 'publish' ? "Entry Published!" : "Entry Saved!",
      description: `Your entry "${formData.title}" has been ${action === 'publish' ? 'published' : 'saved'} successfully.`,
    });
    
    // Navigate back to entries
    navigate('/dashboard/entries');
    setIsPublishing(false);
  };

  const handleBack = () => {
    navigate(-1);
  };

  const wordCount = formData.content.split(' ').filter(word => word.length > 0).length;
  const charCount = formData.content.length;

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Header */}
      <div className="mb-6">
        <Button variant="ghost" size="sm" className="mb-4 -ml-2" onClick={handleBack}>
          <ArrowLeft size={16} className="mr-2" />
          Back
        </Button>
        
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-foreground">New Entry</h1>
            <p className="text-muted-foreground mt-1">Capture your thoughts and reflections</p>
          </div>
          
          <div className="flex items-center space-x-2">
            <Button 
              variant="outline" 
              onClick={() => handleSubmit('save')}
              disabled={!formData.title || !formData.content}
            >
              <Save size={16} className="mr-2" />
              Save Draft
            </Button>
            <Button 
              onClick={() => handleSubmit('publish')}
              disabled={!formData.title || !formData.content || isPublishing}
              className="bg-gradient-hero text-primary-foreground"
            >
              <Send size={16} className="mr-2" />
              {isPublishing ? 'Publishing...' : 'Publish'}
            </Button>
          </div>
        </div>
      </div>

      {/* Entry Form */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Title */}
          <Card className="border-0 shadow-soft">
            <CardContent className="p-6">
              <div className="space-y-2">
                <Label htmlFor="title" className="text-sm font-medium">
                  Entry Title
                </Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                  placeholder="What's on your mind today?"
                  className="text-lg font-medium border-0 px-0 focus:ring-0 placeholder:text-muted-foreground"
                />
              </div>
            </CardContent>
          </Card>

          {/* Content */}
          <Card className="border-0 shadow-soft">
            <CardHeader className="pb-4">
              <CardTitle className="text-lg">Your Thoughts</CardTitle>
            </CardHeader>
            <CardContent>
              <Textarea
                value={formData.content}
                onChange={(e) => setFormData(prev => ({ ...prev, content: e.target.value }))}
                placeholder="Start writing your thoughts here... Let your mind flow freely and capture whatever feels important to you today."
                className="min-h-96 resize-none border-0 p-0 focus:ring-0 text-base leading-relaxed"
              />
              <div className="mt-4 flex items-center justify-between text-xs text-muted-foreground">
                <span>{charCount} characters</span>
                <span>{wordCount} words</span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Mood */}
          <Card className="border-0 shadow-soft">
            <CardHeader className="pb-4">
              <CardTitle className="text-lg">How are you feeling?</CardTitle>
            </CardHeader>
            <CardContent>
              <Select
                value={formData.mood}
                onValueChange={(value) => setFormData(prev => ({ ...prev, mood: value }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select your mood" />
                </SelectTrigger>
                <SelectContent>
                  {moods.map((mood) => (
                    <SelectItem key={mood} value={mood}>
                      {mood}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </CardContent>
          </Card>

          {/* Tags */}
          <Card className="border-0 shadow-soft">
            <CardHeader className="pb-4">
              <CardTitle className="text-lg">Tags</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <Input
                  value={formData.tags}
                  onChange={(e) => setFormData(prev => ({ ...prev, tags: e.target.value }))}
                  placeholder="work, family, travel, goals..."
                />
                <p className="text-xs text-muted-foreground">
                  Separate tags with commas to help organize your entries
                </p>
                {formData.tags && (
                  <div className="flex flex-wrap gap-1 mt-2">
                    {formData.tags.split(',').map((tag, index) => (
                      tag.trim() && (
                        <Badge key={index} variant="outline" className="text-xs">
                          #{tag.trim()}
                        </Badge>
                      )
                    ))}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Quick Stats */}
          <Card className="border-0 shadow-soft bg-gradient-subtle">
            <CardHeader className="pb-4">
              <CardTitle className="text-lg">Writing Session</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Words</span>
                  <span className="text-sm font-medium">{wordCount}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Characters</span>
                  <span className="text-sm font-medium">{charCount}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Est. read time</span>
                  <span className="text-sm font-medium">{Math.ceil(wordCount / 200)} min</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default NewEntry;