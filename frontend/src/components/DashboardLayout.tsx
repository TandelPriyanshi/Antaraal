import { useState, useRef, ChangeEvent, useEffect } from "react";
import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger
} from "@/components/ui/sheet";
import { 
  BookOpen, 
  BarChart3, 
  Lightbulb, 
  FileText, 
  User, 
  LogOut,
  Menu,
  X,
  Plus,
  Images,
  MessageSquarePlus,
  History,
  Search,
  Sparkles,
  Trash2
} from "lucide-react";
import api from "@/lib/api";

interface ConversationItem {
  id: number;
  userMessage: string;
  aiResponse: string;
  createdAt: string;
}

const DashboardLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [profilePicture, setProfilePicture] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [conversationHistory, setConversationHistory] = useState<ConversationItem[]>([]);
  const [showHistory, setShowHistory] = useState(false);
  const [promptMenuOpen, setPromptMenuOpen] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  // Fetch user profile on component mount
  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) return;

        const response = await fetch('http://localhost:5002/api/profile/me', {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });
        
        if (response.ok) {
          const data = await response.json();
          console.log('Profile data:', data); // Debug log
          if (data.profilePic) {
            // Ensure the URL is properly formed
            const baseUrl = 'http://localhost:5002';
            let profilePicUrl = data.profilePic;
            
            // If it's already a full URL, use it as is
            if (!profilePicUrl.startsWith('http')) {
              // Remove any leading slashes to avoid double slashes
              const cleanPath = profilePicUrl.startsWith('/') 
                ? profilePicUrl.substring(1) 
                : profilePicUrl;
              // Add timestamp to prevent caching
              const timestamp = new Date().getTime();
              // Make sure we don't have double slashes
              const separator = baseUrl.endsWith('/') ? '' : '/';
              profilePicUrl = `${baseUrl}${separator}${cleanPath}?t=${timestamp}`;
            }
            
            console.log('Profile picture URL:', profilePicUrl);
            setProfilePicture(profilePicUrl);
          }
        }
      } catch (error) {
        console.error('Error fetching user profile:', error);
      }
    };

    fetchUserProfile();
  }, []);

  const handleProfilePictureChange = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const token = localStorage.getItem('token');
    if (!token) {
      alert('Please log in to update your profile picture');
      return;
    }

    const formData = new FormData();
    formData.append('profilePicture', file);

    try {
      setIsLoading(true);
      const response = await fetch('http://localhost:5002/api/profile/upload-picture', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        body: formData,
      });

      const data = await response.json();
      
      if (response.ok) {
        console.log('Upload response data:', data); // Debug log
        // Ensure the URL is properly formed
        const baseUrl = 'http://localhost:5002';
        const profilePicUrl = data.filePath.startsWith('http') 
          ? data.filePath 
          : `${baseUrl}${data.filePath.startsWith('/') ? '' : '/'}${data.filePath}`;
        console.log('New profile picture URL:', profilePicUrl); // Debug log
        setProfilePicture(profilePicUrl);
      } else {
        console.error('Failed to upload profile picture:', data.message);
        // Show error to user
        alert(data.message || 'Failed to upload profile picture');
      }
    } catch (error) {
      console.error('Error uploading profile picture:', error);
      alert('An error occurred while uploading the profile picture');
    } finally {
      setIsLoading(false);
    }
  };

  const navigation = [
    { name: 'Entry Details', href: '/dashboard/entries', icon: BookOpen },
    { name: 'Writing Prompts', href: '/dashboard/prompts', icon: FileText },
    { name: 'Album', href: '/dashboard/albums', icon: Images },
    { name: 'Autobiography', href: '/dashboard/inspiration', icon: Lightbulb },
    { name: 'Statistics', href: '/dashboard/stats', icon: BarChart3 },
  ];

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const handleNewEntry = () => {
    // Navigate to new entry form or open modal
    navigate('/dashboard/new-entry');
  };

  // Load conversation history
  const loadConversationHistory = async () => {
    try {
      const response = await api.get<{ conversations: ConversationItem[] }>('/ai/history?limit=50');
      if (response.data) {
        setConversationHistory(response.data.conversations);
      }
    } catch (error) {
      console.error('Failed to load conversation history:', error);
    }
  };

  // Listen for conversation updates
  useEffect(() => {
    const handleConversationUpdate = () => {
      if (showHistory) {
        loadConversationHistory();
      }
    };

    window.addEventListener('conversationUpdated', handleConversationUpdate);

    return () => {
      window.removeEventListener('conversationUpdated', handleConversationUpdate);
    };
  }, [showHistory]);

  const handleNewChat = () => {
    setShowHistory(false);
    setPromptMenuOpen(false);
    window.dispatchEvent(new Event('newChat'));
  };

  const handleShowHistory = async () => {
    setShowHistory(true);
    await loadConversationHistory();
  };

  const loadConversation = (conv: ConversationItem) => {
    setShowHistory(false);
    setPromptMenuOpen(false);
    window.dispatchEvent(new CustomEvent('loadConversation', { detail: conv }));
  };

  const deleteConversation = async (convId: number, e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      await api.delete(`/ai/conversation/${convId}`);
      await loadConversationHistory();
    } catch (error) {
      console.error('Failed to delete conversation:', error);
    }
  };

  return (
    <div className="flex h-screen bg-background">
      {/* Mobile sidebar backdrop */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div className={`
        fixed inset-y-0 left-0 z-50 w-80 bg-card border-r border-border transform transition-transform duration-200 ease-in-out
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
        lg:translate-x-0 lg:static lg:inset-0
      `}>
        <div className="flex items-center justify-between h-16 px-6 border-b border-border">
          <Link to="/" className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-hero rounded-lg flex items-center justify-center">
              <span className="text-primary-foreground font-bold text-xl">A</span>
            </div>
            <span className="text-xl font-bold text-foreground">Antaraal</span>
          </Link>
          <button
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden p-2 hover:bg-muted rounded-md transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        <nav className="flex-1 px-4 py-4">
          <ul className="space-y-1">
            {navigation.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.href;
              
              return (
                <li key={item.name}>
                  <Link
                    to={item.href}
                    className={`
                      flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-200 text-sm font-medium
                      ${isActive 
                        ? 'bg-primary text-primary-foreground' 
                        : 'text-muted-foreground hover:text-foreground hover:bg-muted'
                      }
                    `}
                    onClick={() => setSidebarOpen(false)}
                  >
                    <Icon size={18} />
                    <span>{item.name}</span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        <div className="p-4 border-t border-border">
          <div className="flex items-center space-x-3 mb-4">
            <button 
              onClick={() => fileInputRef.current?.click()}
              className="relative group"
              aria-label="Change profile picture"
            >
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleProfilePictureChange}
                disabled={isLoading}
                accept="image/*"
                className="hidden"
              />
              <div className="w-10 h-10 rounded-full overflow-hidden bg-gradient-subtle flex items-center justify-center relative">
                {isLoading ? (
                  <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-primary"></div>
                ) : profilePicture ? (
                  <div className="w-full h-full overflow-hidden rounded-full bg-muted flex items-center justify-center">
                    <div className="relative w-full h-full">
                      <img 
                        src={profilePicture} 
                        alt="Profile" 
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          console.error('Error loading profile picture:', {
                            url: profilePicture,
                            error: e,
                            timestamp: new Date().toISOString()
                          });
                          const target = e.target as HTMLImageElement;
                          target.onerror = null;
                          target.style.display = 'none';
                        }}
                        onLoad={() => {
                          console.log('Profile picture loaded successfully:', profilePicture);
                        }}
                      />
                      {isLoading && (
                        <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                          <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white"></div>
                        </div>
                      )}
                    </div>
                  </div>
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-muted rounded-full">
                    <User size={18} className="text-muted-foreground" />
                  </div>
                )}
                <div className="absolute inset-0 bg-black/50 opacity-0 transition-opacity flex items-center justify-center">
                  <User size={16} className="text-white" />
                </div>
            </div>
            </button>
            <div>
              <p className="text-sm font-medium text-foreground">Welcome back!</p>
              <p className="text-xs text-muted-foreground">{user?.email || 'User'}</p>
            </div>
          </div>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={handleLogout}
            className="w-full justify-start space-x-2"
          >
            <LogOut size={16} />
            <span>Sign Out</span>
          </Button>
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 flex flex-col">
        {/* Top bar */}
        <div className="bg-background border-b border-border px-6 h-16 flex items-center justify-between">
          <button
            onClick={() => setSidebarOpen(true)}
            className="lg:hidden p-2 hover:bg-muted rounded-md transition-colors"
          >
            <Menu size={20} />
          </button>
          
          <h1 className="text-xl font-semibold text-foreground">
            {navigation.find(item => item.href === location.pathname)?.name || 'Dashboard'}
          </h1>
          
          {location.pathname === '/dashboard/prompts' ? (
            <Sheet open={promptMenuOpen} onOpenChange={setPromptMenuOpen}>
              <SheetTrigger asChild>
                <Button 
                  variant="ghost" 
                  size="icon"
                  className="rounded-lg bg-card hover:bg-accent border border-border shadow-sm h-10 w-10"
                >
                  <Menu size={20} />
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-80 bg-card border-border">
                <SheetHeader>
                  <SheetTitle className="text-foreground">Menu</SheetTitle>
                </SheetHeader>
                
                {!showHistory ? (
                  // Main Menu
                  <div className="mt-6 space-y-2">
                    <Button 
                      variant="ghost" 
                      className="w-full justify-start text-foreground hover:bg-accent"
                      onClick={handleNewChat}
                    >
                      <MessageSquarePlus size={18} className="mr-3" />
                      New Chat
                    </Button>
                    
                    <Button 
                      variant="ghost" 
                      className="w-full justify-start text-foreground hover:bg-accent"
                      onClick={handleShowHistory}
                    >
                      <History size={18} className="mr-3" />
                      History
                    </Button>
                    
                    <Button 
                      variant="ghost" 
                      className="w-full justify-start text-foreground hover:bg-accent"
                      onClick={() => setPromptMenuOpen(false)}
                    >
                      <BookOpen size={18} className="mr-3" />
                      Prompt Library
                    </Button>
                    
                    <Button 
                      variant="ghost" 
                      className="w-full justify-start text-foreground hover:bg-accent"
                      onClick={() => setPromptMenuOpen(false)}
                    >
                      <Search size={18} className="mr-3" />
                      Search
                    </Button>
                    
                    <Button 
                      variant="ghost" 
                      className="w-full justify-start text-foreground hover:bg-accent"
                      onClick={() => setPromptMenuOpen(false)}
                    >
                      <Sparkles size={18} className="mr-3" />
                      AI Prompts
                    </Button>
                  </div>
                ) : (
                  // History View
                  <div className="mt-6">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-sm font-semibold text-foreground">Conversation History</h3>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setShowHistory(false)}
                      >
                        Back
                      </Button>
                    </div>
                    <ScrollArea className="h-[calc(100vh-200px)]">
                      <div className="space-y-2">
                        {conversationHistory.map((conv) => (
                          <div
                            key={conv.id}
                            className="group relative p-3 rounded-lg hover:bg-accent cursor-pointer transition-colors border border-border"
                            onClick={() => loadConversation(conv)}
                          >
                            <div className="flex items-start gap-2">
                              <MessageSquarePlus size={14} className="text-muted-foreground flex-shrink-0 mt-1" />
                              <div className="flex-1 min-w-0">
                                <p className="text-sm text-foreground truncate">
                                  {conv.userMessage.length > 40 ? conv.userMessage.substring(0, 40) + '...' : conv.userMessage}
                                </p>
                                <p className="text-xs text-muted-foreground mt-1">
                                  {new Date(conv.createdAt).toLocaleDateString()} at {new Date(conv.createdAt).toLocaleTimeString()}
                                </p>
                              </div>
                              <Button
                                size="icon"
                                variant="ghost"
                                className="opacity-0 group-hover:opacity-100 h-6 w-6 transition-opacity"
                                onClick={(e) => deleteConversation(conv.id, e)}
                              >
                                <Trash2 size={12} />
                              </Button>
                            </div>
                          </div>
                        ))}
                        {conversationHistory.length === 0 && (
                          <div className="text-sm text-muted-foreground text-center py-8">
                            No conversation history yet.<br />Start chatting to see your conversations here!
                          </div>
                        )}
                      </div>
                    </ScrollArea>
                  </div>
                )}
              </SheetContent>
            </Sheet>
          ) : (
            <div className="flex items-center space-x-2">
              <Button 
                size="sm" 
                onClick={handleNewEntry}
                className="bg-gradient-hero text-primary-foreground hover:shadow-elevated transition-all"
              >
                <Plus size={16} className="mr-2" />
                New Entry
              </Button>
            </div>
          )}
        </div>

        {/* Page content */}
        <div className="flex-1 overflow-auto p-6">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default DashboardLayout;