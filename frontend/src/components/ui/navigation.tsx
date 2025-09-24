import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Menu, X } from "lucide-react";

const Navigation = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-sm border-b border-border">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-hero rounded-lg flex items-center justify-center">
              <span className="text-primary-foreground font-bold text-lg">A</span>
            </div>
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

          {/* Auth Buttons */}
          <div className="hidden md:flex items-center space-x-4">
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
              <div className="flex flex-col space-y-2 pt-4">
                <Button 
                  variant="ghost" 
                  onClick={() => navigate("/signin")}
                  className="justify-start"
                >
                  Sign In
                </Button>
                <Button 
                  onClick={() => navigate("/signup")}
                  className="bg-gradient-hero text-primary-foreground hover:shadow-soft transition-all justify-start"
                >
                  Sign Up
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navigation;