import { Link } from 'react-router-dom';
import { Mail, Phone, MapPin, Heart, BookOpen, Users, Shield } from 'lucide-react';

const Footer = () => {
  return (
    <footer id="contact" className="static bg-primary text-primary-foreground py-12 sm:py-16 lg:py-20">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 xl:px-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8 lg:gap-6 xl:gap-8 mb-8 sm:mb-12">
          {/* Brand Section */}
          <div className="sm:col-span-2 lg:col-span-2">
            <div className="flex items-center space-x-2 mb-4 justify-center sm:justify-start">
              <div className="w-8 h-8 bg-background rounded-lg flex items-center justify-center">
                <span className="text-primary font-bold text-lg">A</span>
              </div>
              <span className="text-xl sm:text-2xl font-bold">Antaraal Life Scribe</span>
            </div>
            <p className="text-primary-foreground/80 mb-4 sm:mb-6 max-w-md text-sm sm:text-base text-center sm:text-left mx-auto sm:mx-0">
              Your AI-powered companion for capturing life's precious moments, reflecting on experiences, and creating lasting memories through intelligent journaling.
            </p>
            <div className="space-y-2 text-center sm:text-left">
              <div className="flex items-center space-x-2 justify-center sm:justify-start">
                <Mail size={16} />
                <span className="text-primary-foreground/80 text-sm sm:text-base">support@antaraal.com</span>
              </div>
              <div className="flex items-center space-x-2 justify-center sm:justify-start">
                <Phone size={16} />
                <span className="text-primary-foreground/80 text-sm sm:text-base">+1 (555) JOURNAL</span>
              </div>
              <div className="flex items-center space-x-2 justify-center sm:justify-start">
                <MapPin size={16} />
                <span className="text-primary-foreground/80 text-sm sm:text-base">San Francisco, CA</span>
              </div>
            </div>
          </div>

          {/* Journaling Features */}
          <div className="text-center sm:text-left">
            <h3 className="font-semibold mb-3 sm:mb-4 text-base sm:text-lg flex items-center justify-center sm:justify-start">
              <BookOpen size={18} className="mr-2" />
              Journaling
            </h3>
            <ul className="space-y-1 sm:space-y-2">
              <li><Link to="/features" className="text-primary-foreground/80 hover:text-primary-foreground transition-colors text-sm sm:text-base">AI Writing Assistant</Link></li>
              <li><Link to="/features" className="text-primary-foreground/80 hover:text-primary-foreground transition-colors text-sm sm:text-base">Mood Tracking</Link></li>
              <li><Link to="/features" className="text-primary-foreground/80 hover:text-primary-foreground transition-colors text-sm sm:text-base">Memory Insights</Link></li>
              <li><Link to="/features" className="text-primary-foreground/80 hover:text-primary-foreground transition-colors text-sm sm:text-base">Daily Prompts</Link></li>
              <li><Link to="/features" className="text-primary-foreground/80 hover:text-primary-foreground transition-colors text-sm sm:text-base">Export & Backup</Link></li>
            </ul>
          </div>

          {/* Support & Community */}
          <div className="text-center sm:text-left">
            <h3 className="font-semibold mb-3 sm:mb-4 text-base sm:text-lg flex items-center justify-center sm:justify-start">
              <Users size={18} className="mr-2" />
              Support
            </h3>
            <ul className="space-y-1 sm:space-y-2">
              <li><Link to="/help" className="text-primary-foreground/80 hover:text-primary-foreground transition-colors text-sm sm:text-base">Help Center</Link></li>
              <li><Link to="/community" className="text-primary-foreground/80 hover:text-primary-foreground transition-colors text-sm sm:text-base">Community</Link></li>
              <li><Link to="/tutorials" className="text-primary-foreground/80 hover:text-primary-foreground transition-colors text-sm sm:text-base">Tutorials</Link></li>
              <li><Link to="/blog" className="text-primary-foreground/80 hover:text-primary-foreground transition-colors text-sm sm:text-base">Wellness Blog</Link></li>
              <li><Link to="/contact" className="text-primary-foreground/80 hover:text-primary-foreground transition-colors text-sm sm:text-base">Contact Us</Link></li>
            </ul>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="border-t border-primary-foreground/20 pt-6 sm:pt-8">
          <div className="flex flex-col lg:flex-row justify-between items-center space-y-4 lg:space-y-0">
            <div className="flex flex-col sm:flex-row items-center space-y-2 sm:space-y-0 sm:space-x-4">
              <p className="text-primary-foreground/60 text-xs sm:text-sm text-center sm:text-left">
                © 2024 Antaraal Life Scribe. Made with <Heart size={12} className="inline mx-1 text-red-400" /> for mindful living.
              </p>
            </div>
            
            <div className="flex flex-col sm:flex-row items-center space-y-2 sm:space-y-0 sm:space-x-6 text-center">
              <Link to="/privacy" className="text-primary-foreground/60 hover:text-primary-foreground transition-colors text-xs sm:text-sm flex items-center">
                <Shield size={12} className="mr-1" />
                Privacy Policy
              </Link>
              <Link to="/terms" className="text-primary-foreground/60 hover:text-primary-foreground transition-colors text-xs sm:text-sm">
                Terms of Service
              </Link>
              <Link to="/security" className="text-primary-foreground/60 hover:text-primary-foreground transition-colors text-xs sm:text-sm">
                Data Security
              </Link>
              <Link to="/accessibility" className="text-primary-foreground/60 hover:text-primary-foreground transition-colors text-xs sm:text-sm">
                Accessibility
              </Link>
            </div>
          </div>
          
          {/* Wellness Message */}
          <div className="mt-4 pt-4 border-t border-primary-foreground/10 text-center">
            <p className="text-primary-foreground/50 text-xs italic">
              "Every moment is a fresh beginning. Your journal is your companion on this beautiful journey of self-discovery."
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
