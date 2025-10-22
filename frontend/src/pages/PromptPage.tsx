import { useState, useEffect } from "react";
import { Mic, Send, BookOpen, History, Sparkles, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import api from "@/lib/api";

interface ConversationItem {
  id: number;
  userMessage: string;
  aiResponse: string;
  createdAt: string;
}

const PromptPage = () => {
  const [inputText, setInputText] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [aiResponse, setAiResponse] = useState<string>("");

  const handleSendPrompt = async () => {
    if (!inputText.trim() || isLoading) return;

    const userMessage = inputText;
    setInputText("");
    setIsLoading(true);
    setAiResponse("");

    try {
      const response = await api.post<{ message: string; id: number; createdAt: string }>('/ai/prompt', {
        message: userMessage,
      });

      if (response.data) {
        setAiResponse(response.data.message);
        // Trigger custom event to update history in DashboardLayout
        window.dispatchEvent(new CustomEvent('conversationUpdated'));
      } else if (response.error) {
        setAiResponse(`Error: ${response.error}`);
      }
    } catch (error) {
      console.error('Error sending prompt:', error);
      setAiResponse('Sorry, I encountered an error processing your request. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendPrompt();
    }
  };

  // Listen for conversation loading from menu
  useEffect(() => {
    const handleLoadConversation = (event: CustomEvent) => {
      const conv = event.detail as ConversationItem;
      setInputText(conv.userMessage);
      setAiResponse(conv.aiResponse);
    };

    const handleNewChat = () => {
      setInputText("");
      setAiResponse("");
    };

    window.addEventListener('loadConversation', handleLoadConversation as EventListener);
    window.addEventListener('newChat', handleNewChat);

    return () => {
      window.removeEventListener('loadConversation', handleLoadConversation as EventListener);
      window.removeEventListener('newChat', handleNewChat);
    };
  }, []);

  return (
    <div className="flex flex-col h-full items-center justify-center px-4 pb-8">
      <div className="w-full max-w-3xl mx-auto space-y-8">
        {/* Main Heading - Only show when no response */}
        {!aiResponse && !isLoading && (
          <div className="text-center animate-fade-in">
            <h1 className="text-4xl md:text-5xl font-light text-foreground">
            Where should we begin?
            </h1>
          </div>
        )}

        {/* AI Response Display */}
        {(aiResponse || isLoading) && (
          <div className="bg-card rounded-2xl border border-border p-6 shadow-lg max-h-[400px] overflow-y-auto">
            {isLoading ? (
              <div className="flex items-center justify-center gap-3 text-muted-foreground">
                <Loader2 className="animate-spin" size={20} />
                <span>Thinking...</span>
              </div>
            ) : (
              <div className="prose prose-sm max-w-none text-foreground">
                <p className="whitespace-pre-wrap">{aiResponse}</p>
              </div>
            )}
          </div>
        )}

        {/* Input Area */}
        <div className="relative">
          <div className="bg-card rounded-3xl border border-border shadow-lg overflow-hidden">
            <div className="flex items-center gap-3 px-5 py-4">
              <Input
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Ask anything"
                disabled={isLoading}
                className="flex-1 bg-transparent border-0 text-foreground placeholder:text-muted-foreground focus-visible:ring-0 focus-visible:ring-offset-0 text-base"
              />
              
              <div className="flex items-center gap-2 flex-shrink-0">
                <Button 
                  size="icon"
                  variant="ghost" 
                  className="text-muted-foreground hover:text-foreground hover:bg-accent rounded-full h-9 w-9"
                >
                  <Mic size={18} />
                </Button>
                
                <Button 
                  onClick={handleSendPrompt}
                  disabled={!inputText.trim() || isLoading}
                  size="icon"
                  className="bg-primary text-primary-foreground hover:bg-primary/90 disabled:bg-muted disabled:text-muted-foreground rounded-full h-9 w-9"
                >
                  {isLoading ? <Loader2 className="animate-spin" size={16} /> : <Send size={16} />}
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions - Only show when no response */}
        {!aiResponse && !isLoading && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mt-6">
            <Button 
              variant="outline" 
              className="bg-card/50 border-border text-foreground hover:bg-accent justify-start p-4 h-auto rounded-2xl"
              onClick={() => setInputText("Help me write a gratitude journal entry for today.")}
            >
              <Sparkles className="mr-3 text-primary" size={18} />
              <div className="text-left">
                <div className="font-medium text-sm">Daily Gratitude</div>
                <div className="text-xs text-muted-foreground">Reflect on blessings</div>
              </div>
            </Button>
            
            <Button 
              variant="outline" 
              className="bg-card/50 border-border text-foreground hover:bg-accent justify-start p-4 h-auto rounded-2xl"
              onClick={() => setInputText("Give me a creative writing prompt to explore my imagination.")}
            >
              <BookOpen className="mr-3 text-primary" size={18} />
              <div className="text-left">
                <div className="font-medium text-sm">Creative Prompt</div>
                <div className="text-xs text-muted-foreground">Spark imagination</div>
              </div>
            </Button>
            
            <Button 
              variant="outline" 
              className="bg-card/50 border-border text-foreground hover:bg-accent justify-start p-4 h-auto rounded-2xl"
              onClick={() => setInputText("Help me reflect on my personal growth and goals.")}
            >
              <History className="mr-3 text-primary" size={18} />
              <div className="text-left">
                <div className="font-medium text-sm">Self Reflection</div>
                <div className="text-xs text-muted-foreground">Explore thoughts</div>
              </div>
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default PromptPage;