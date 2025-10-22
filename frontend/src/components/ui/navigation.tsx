import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Menu, X, User, Settings, LogOut, Home } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

const Navigation = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
    setIsProfileMenuOpen(false);
  };

  const getInitials = (username: string) => {
    return username.split(' ').map(word => word[0]).join('').toUpperCase().slice(0, 2);
  };

  const renderAvatar = (user: any) => {
    if (user.profilePic) {
      return (
        <img
          src={user.profilePic}
          alt={`${user.username}'s profile`}
          className="w-8 h-8 rounded-full object-cover"
        />
      );
    }
    return (
      <div className="w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center font-medium text-sm">
        {getInitials(user.username)}
      </div>
    );
  };

  const renderMobileAvatar = (user: any) => {
    if (user.profilePic) {
      return (
        <img
          src={user.profilePic}
          alt={`${user.username}'s profile`}
          className="w-10 h-10 rounded-full object-cover"
        />
      );
    }
    return (
      <div className="w-10 h-10 bg-primary text-primary-foreground rounded-full flex items-center justify-center font-medium text-sm">
        {getInitials(user.username)}
      </div>
    );
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-sm border-b border-border">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <img
              src="/favicon.ico"
              alt="Antaraal logo"
              className="w-8 h-8 rounded-lg"
            />
            <span className="text-xl font-bold text-foreground">Antaraal</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <Link to="/" className="text-foreground hover:text-primary transition-colors">
              Home
            </Link>
            <Link to="/features" className="text-foreground hover:text-primary transition-colors">
              Features
            </Link>
            <Link to="/subscription" className="text-foreground hover:text-primary transition-colors">
              Subscription
            </Link>
            <Link to="/about" className="text-foreground hover:text-primary transition-colors">
              About
            </Link>
            <Link to="/contact" className="text-foreground hover:text-primary transition-colors">
              Contact
            </Link>
          </div>

          {/* Auth Section - Show profile if logged in, auth buttons if not */}
          <div className="hidden md:flex items-center">
            {user ? (
              // Profile dropdown when logged in
              <div className="relative">
                <button
                  onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
                  className="flex items-center space-x-3 p-2 rounded-lg hover:bg-accent transition-colors"
                >
                  {renderAvatar(user)}
                  <div className="text-left">
                    <div className="text-sm font-medium text-foreground">{user.username}</div>
                    <div className="text-xs text-muted-foreground">{user.email}</div>
                  </div>
                </button>

                {/* Profile Dropdown Menu */}
                {isProfileMenuOpen && (
                  <div className="absolute right-0 mt-2 w-56 bg-background border border-border rounded-lg shadow-lg py-2 z-50">
                    <div className="px-4 py-2 border-b border-border">
                      <p className="text-sm font-medium text-foreground">{user.username}</p>
                      <p className="text-xs text-muted-foreground">{user.email}</p>
                    </div>
                    <button
                      onClick={() => { navigate('/dashboard/entries'); setIsProfileMenuOpen(false); }}
                      className="w-full text-left px-4 py-2 text-sm text-foreground hover:bg-accent flex items-center space-x-2"
                    >
                      <Home size={16} />
                      <span>Dashboard</span>
                    </button>
                    <button
                      onClick={() => { navigate('/profile'); setIsProfileMenuOpen(false); }}
                      className="w-full text-left px-4 py-2 text-sm text-foreground hover:bg-accent flex items-center space-x-2"
                    >
                      <User size={16} />
                      <span>Profile</span>
                    </button>
                    <button
                      onClick={() => { navigate('/settings'); setIsProfileMenuOpen(false); }}
                      className="w-full text-left px-4 py-2 text-sm text-foreground hover:bg-accent flex items-center space-x-2"
                    >
                      <Settings size={16} />
                      <span>Settings</span>
                    </button>
                    <hr className="my-2 border-border" />
                    <button
                      onClick={handleLogout}
                      className="w-full text-left px-4 py-2 text-sm text-destructive hover:bg-destructive/10 flex items-center space-x-2"
                    >
                      <LogOut size={16} />
                      <span>Sign Out</span>
                    </button>
                  </div>
                )}
              </div>
            ) : (
              // Auth buttons when not logged in
              <div className="flex items-center space-x-4">
                <Button
                  variant="ghost"
                  onClick={() => navigate("/signin")}
                >
                  Sign In
                </Button>
                <Button
                  onClick={() => navigate("/signup")}
                  className="bg-gradient-hero text-primary-foreground hover:shadow-soft transition-all"
                >
                  Sign Up
                </Button>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t border-border">
            <div className="flex flex-col space-y-4">
              <Link to="/" className="text-foreground hover:text-primary transition-colors py-2">
                Home
              </Link>
              <Link to="/features" className="text-foreground hover:text-primary transition-colors py-2">
                Features
              </Link>
              <Link to="/subscription" className="text-foreground hover:text-primary transition-colors py-2">
                Subscription
              </Link>
              <Link to="/about" className="text-foreground hover:text-primary transition-colors py-2">
                About
              </Link>
              <Link to="/contact" className="text-foreground hover:text-primary transition-colors py-2">
                Contact
              </Link>

              {/* Mobile Auth Section */}
              {user ? (
                // Mobile profile section when logged in
                <div className="pt-4 border-t border-border">
                  <div className="flex items-center space-x-3 mb-4 p-3 bg-accent rounded-lg">
                    {renderMobileAvatar(user)}
                    <div>
                      <div className="text-sm font-medium text-foreground">{user.username}</div>
                      <div className="text-xs text-muted-foreground">{user.email}</div>
                    </div>
                  </div>
                  <div className="flex flex-col space-y-2">
                    <Button
                      variant="ghost"
                      onClick={() => { navigate('/dashboard/entries'); setIsMenuOpen(false); }}
                      className="justify-start"
                    >
                      <Home size={16} className="mr-2" />
                      Dashboard
                    </Button>
                    <Button
                      variant="ghost"
                      onClick={() => { navigate('/profile'); setIsMenuOpen(false); }}
                      className="justify-start"
                    >
                      <User size={16} className="mr-2" />
                      Profile
                    </Button>
                    <Button
                      variant="ghost"
                      onClick={() => { navigate('/settings'); setIsMenuOpen(false); }}
                      className="justify-start"
                    >
                      <Settings size={16} className="mr-2" />
                      Settings
                    </Button>
                    <Button
                      variant="ghost"
                      onClick={handleLogout}
                      className="justify-start text-destructive hover:bg-destructive/10"
                    >
                      <LogOut size={16} className="mr-2" />
                      Sign Out
                    </Button>
                  </div>
                </div>
              ) : (
                // Mobile auth buttons when not logged in
                <div className="flex flex-col space-y-2 pt-4">
                  <Button
                    variant="ghost"
                    onClick={() => { navigate("/signin"); setIsMenuOpen(false); }}
                    className="justify-start"
                  >
                    Sign In
                  </Button>
                  <Button
                    onClick={() => { navigate("/signup"); setIsMenuOpen(false); }}
                    className="bg-gradient-hero text-primary-foreground hover:shadow-soft transition-all justify-start"
                  >
                    Sign Up
                  </Button>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navigation;