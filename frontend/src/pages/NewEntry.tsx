import { useState } from "react";
import { ArrowLeft, Save, Send, Sparkles, Calendar as CalendarIcon, X, Brain, Heart, Lightbulb } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";
import { useNavigate } from "react-router-dom";
import { useEntries } from "@/contexts/EntriesContext";
import { useToast } from "@/hooks/use-toast";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";

const NewEntry = () => {
  const navigate = useNavigate();
  const { addEntry } = useEntries();
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    title: "",
    content: "",
    mood: "",
    tags: "",
    date: new Date()
  });
  const [isPublishing, setIsPublishing] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResults, setAnalysisResults] = useState<any>(null);
  const [showAnalysisDialog, setShowAnalysisDialog] = useState(false);
 const API_BASE = (import.meta as any)?.env?.VITE_NLP_API_BASE || 'http://localhost:8000';


  const moods = [
    "Happy", "Grateful", "Peaceful", "Excited", "Reflective", 
    "Determined", "Anxious", "Hopeful", "Nostalgic", "Content"
  ];

  const handleSubmit = async (action: 'save' | 'publish') => {
    setIsPublishing(action === 'publish');

    const now = new Date();
    const selectedDate = formData.date || now;

    const newEntry = {
      title: formData.title,
      content: formData.content,
      date: selectedDate, // Pass the actual Date object
      time: now.toLocaleTimeString('en-US', {
        hour: 'numeric',
        minute: '2-digit'
      }),
      mood: formData.mood,
      tags: formData.tags.split(',').map(tag => tag.trim()).filter(tag => tag.length > 0),
      wordCount,
      readTime: `${Math.ceil(wordCount / 200)} min read`
    };

    try {
      await addEntry(newEntry);

      toast({
        title: action === 'publish' ? "Entry Published!" : "Entry Saved!",
        description: `Your entry "${formData.title}" has been ${action === 'publish' ? 'published' : 'saved'} successfully.`,
      });

      // Navigate back to entries
      navigate('/dashboard/entries');
    } catch (error) {
      console.error('Error saving entry:', error);
      toast({
        title: "Error",
        description: "Failed to save entry. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsPublishing(false);
    }
  };

  const handleBack = () => {
    navigate(-1);
  };

  const handleGenerateSummary = async () => {
    const text = formData.content.trim();
    if (!text) {
      toast({
        title: "Nothing to analyze",
        description: "Write some thoughts first.",
      });
      return;
    }

    setIsAnalyzing(true);

    try {
      const response = await fetch(`${API_BASE}/analyze`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          text: text,
          include_summary: true,
          include_mood: true,
          include_motivation: true,
          summary_type: 'auto'
        })
      });

      if (!response.ok) {
        let serverText = '';
        try { serverText = await response.text(); } catch {}
        throw new Error(`HTTP ${response.status} ${response.statusText}${serverText ? ` - ${serverText}` : ''}`);
      }

      const data = await response.json();
      setAnalysisResults(data);
      setShowAnalysisDialog(true);

      toast({
        title: "Analysis Complete! ",
        description: "Your entry has been analyzed. Check out the insights!",
      });

    } catch (error: any) {
      console.error('Error analyzing text:', error);
      toast({
        title: "Analysis failed",
        description: typeof error?.message === 'string' ? error.message : "Could not reach NLP service.",
        variant: "destructive"
      });
    } finally {
      setIsAnalyzing(false);
    }
  };

  const wordCount = formData.content.split(' ').filter(word => word.length > 0).length;
  const charCount = formData.content.length;

  return (
    <>
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
                  className="min-h-[27rem] resize-none border-0 p-0 focus:ring-0 text-base leading-relaxed"
                />
                <div className="mt-4 flex items-center justify-between text-xs text-muted-foreground">
                  <span>{charCount} characters</span>
                  <span>{wordCount} words</span>
                </div>
              </CardContent>
            </Card>
            <Button
              size="sm"
              onClick={handleGenerateSummary}
              disabled={isAnalyzing || !formData.content.trim()}
              className="mt-2 bg-gradient-hero text-primary-foreground inline-flex items-center gap-2"
            >
              <Sparkles size={16} className={isAnalyzing ? "animate-spin" : ""} />
              <span>{isAnalyzing ? 'Analyzing...' : 'Generate Summary'}</span>
            </Button>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Date Selection */}
            <Card className="border-0 shadow-soft">
              <CardContent className="p-6">
              <CardTitle className="text-lg mb-3">Select Date</CardTitle>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className="w-full justify-start text-left font-normal"
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {formData.date ? format(formData.date, "PPP") : "Pick a date"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={formData.date}
                      onSelect={(date) => setFormData(prev => ({ ...prev, date: date || new Date() }))}
                      initialFocus
                    />
                    <div className="p-3 border-t flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setFormData(prev => ({ ...prev, date: new Date() }))}
                        className="flex-1"
                      >
                        Today
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setFormData(prev => ({ ...prev, date: undefined }))}
                        className="flex-1"
                      >
                        Clear
                      </Button>
                    </div>
                  </PopoverContent>
                </Popover>
              </CardContent>
            </Card>

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

      {/* Analysis Results Dialog */}
      <Dialog open={showAnalysisDialog} onOpenChange={setShowAnalysisDialog}>
        <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-2xl">
              <Brain className="text-purple-500" size={28} />
              AI Analysis Results
            </DialogTitle>
            <DialogDescription>
              Here's what we found in your journal entry
            </DialogDescription>
          </DialogHeader>

          {analysisResults && (
            <div className="space-y-6 mt-4">
              {/* Summary Section */}
              {analysisResults.summary && (
                <Card className="border-purple-200 bg-purple-50/50">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-lg">
                      <Sparkles className="text-purple-600" size={20} />
                      Summary
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <p className="text-base leading-relaxed">{analysisResults.summary.summary}</p>
                    <div className="flex flex-wrap gap-2 text-sm text-muted-foreground">
                      <Badge variant="outline">Method: {analysisResults.summary.method}</Badge>
                      <Badge variant="outline">Compression: {analysisResults.summary.compression_ratio}%</Badge>
                      <Badge variant="outline">
                        {analysisResults.summary.original_length} → {analysisResults.summary.summary_length} words
                      </Badge>
                    </div>
                    {analysisResults.summary.key_phrases && analysisResults.summary.key_phrases.length > 0 && (
                      <div className="mt-3">
                        <p className="text-sm font-medium mb-2">Key Phrases:</p>
                        <div className="flex flex-wrap gap-1">
                          {analysisResults.summary.key_phrases.map((phrase: string, i: number) => (
                            <Badge key={i} variant="secondary" className="text-xs">
                              {phrase}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              )}

              {/* Mood Analysis Section */}
              {analysisResults.mood && (
                <Card className="border-pink-200 bg-pink-50/50">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-lg">
                      <Heart className="text-pink-600" size={20} />
                      Mood Analysis
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <div className="flex items-center gap-3 mb-2">
                        <span className="text-2xl font-bold text-pink-700">
                          {analysisResults.mood.overall_mood}
                        </span>
                        <Badge className="bg-pink-100 text-pink-800 border-pink-300">
                          {analysisResults.mood.mood_category}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        Confidence: {(analysisResults.mood.confidence * 100).toFixed(0)}%
                      </p>
                      <p className="mt-2 text-base">{analysisResults.mood.description}</p>
                    </div>

                    {analysisResults.mood.sentiment && (
                      <div className="pt-3 border-t">
                        <p className="text-sm font-medium mb-1">Sentiment Analysis:</p>
                        <div className="flex items-center gap-2">
                          <Badge variant="outline">
                            {analysisResults.mood.sentiment.sentiment || 'N/A'}
                          </Badge>
                          <span className="text-sm text-muted-foreground">
                            ({(analysisResults.mood.sentiment.confidence * 100).toFixed(0)}%)
                          </span>
                        </div>
                      </div>
                    )}

                    {analysisResults.mood.suggestions && analysisResults.mood.suggestions.length > 0 && (
                      <div className="pt-3 border-t">
                        <p className="text-sm font-medium mb-2"> Suggestions:</p>
                        <ul className="space-y-1">
                          {analysisResults.mood.suggestions.slice(0, 3).map((suggestion: string, i: number) => (
                            <li key={i} className="text-sm text-muted-foreground ml-4 list-disc">
                              {suggestion}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </CardContent>
                </Card>
              )}

              {/* Motivational Content Section */}
              {analysisResults.motivation && (
                <Card className="border-yellow-200 bg-yellow-50/50">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-lg">
                      <Lightbulb className="text-yellow-600" size={20} />
                      Motivation & Encouragement
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {analysisResults.motivation.motivational_quote && (
                      <div className="bg-white/70 p-4 rounded-lg border border-yellow-200">
                        <p className="text-base italic text-center">
                          "{analysisResults.motivation.motivational_quote}"
                        </p>
                      </div>
                    )}

                    {analysisResults.motivation.encouragement && (
                      <div>
                        <p className="text-sm font-medium mb-2"> Personal Message:</p>
                        <p className="text-sm leading-relaxed">
                          {analysisResults.motivation.encouragement}
                        </p>
                      </div>
                    )}

                    {analysisResults.motivation.affirmations && analysisResults.motivation.affirmations.length > 0 && (
                      <div>
                        <p className="text-sm font-medium mb-2"> Affirmations:</p>
                        <ul className="space-y-1">
                          {analysisResults.motivation.affirmations.slice(0, 3).map((affirmation: string, i: number) => (
                            <li key={i} className="text-sm text-muted-foreground ml-4 list-disc">
                              {affirmation}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {analysisResults.motivation.coping_strategies && analysisResults.motivation.coping_strategies.length > 0 && (
                      <div>
                        <p className="text-sm font-medium mb-2"> Coping Strategies:</p>
                        <ul className="space-y-1">
                          {analysisResults.motivation.coping_strategies.slice(0, 2).map((strategy: string, i: number) => (
                            <li key={i} className="text-sm text-muted-foreground ml-4 list-disc">
                              {strategy}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {analysisResults.motivation.success_tip && (
                      <div className="pt-3 border-t">
                        <p className="text-sm font-medium mb-2"> Success Tip:</p>
                        <p className="text-sm text-muted-foreground">
                          {analysisResults.motivation.success_tip}
                        </p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              )}

              {/* Processing Time */}
              {analysisResults.processing_time && (
                <p className="text-xs text-muted-foreground text-center">
                  Analysis completed in {analysisResults.processing_time}s
                </p>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
};

export default NewEntry;