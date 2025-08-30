import { Link, useNavigate } from "react-router-dom";
import heroImage from "../assets/Bacgroung_img.png";
import FeaturesSection from "../components/FeaturesSection";
import HowItWorksSection from "../components/HowItWorksSection";
import BenefitsSection from "../components/BenefitsSection";
import Navbar from "../components/navbar";
import { useAuth } from "../contexts/AuthContext";

const HomePage = () => {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const handleStartJournaling = (e: React.MouseEvent) => {
    e.preventDefault();
    navigate(isAuthenticated ? '/journal/new' : '/signup');
  };
  return (
    <div className="bg-gradient-to-br from-journal-cream via-background to-journal-sage">
      <Navbar />
      
      {/* Hero Section */}
      <section className="relative min-h-screen flex flex-col overflow-hidden pt-40">
        <div className="absolute inset-0">
          <img
            src={heroImage}
            alt="AI-powered journaling experience"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black/10" />
        </div>

        <div className="relative z-10 max-w-4xl mx-auto px-6 text-center flex-grow flex flex-col justify-center">
          <h1 className="text-5xl md:text-7xl font-bold text-[#8b4a3c] mb-6">
            Antaraal
          </h1>
          <p className="text-xl md:text-2xl mb-4 font-medium text-primary">
            Your AI-Powered Life Journal
          </p>
          <p className="text-lg md:text-xl text-muted-foreground mb-12 max-w-2xl mx-auto leading-relaxed">
            Document your life, track your emotions, and create your personal
            autobiography with AI.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <button
              onClick={handleStartJournaling}
              className="bg-[#8b4a3c] text-white px-8 py-4 rounded-md text-lg font-medium hover:bg-[#733d31] transition shadow-md"
            >
              Start Journaling
            </button>
            <a
              href="#features"
              className="bg-white border border-gray-300 px-8 py-4 rounded-md text-lg font-medium hover:bg-gray-100 transition shadow-md"
            >
              Explore Features
            </a>
          </div>
        </div>
      </section>

      {/* Sections */}
      <FeaturesSection />
      <HowItWorksSection />
      <BenefitsSection />

      {/* Footer */}
      <footer className="bg-[#8b4a3c] mt-16 py-8">
        <div className="max-w-6xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center text-center md:text-left">
          {/* Logo + Name */}
          <div className="flex items-center space-x-2 mb-4 md:mb-0">
            <div className="w-6 h-6 rounded-lg bg-white" />
            <span className="font-semibold text-white">Antaraal</span>
          </div>

          {/* Footer Nav */}
          <div className="flex space-x-6 text-white text-sm">
            <a href="#features" className="hover:text-gray-200 transition">
              Features
            </a>
            <a href="#how-it-works" className="hover:text-gray-200 transition">
              How It Works
            </a>
            <a href="#benefits" className="hover:text-gray-200 transition">
              Benefits
            </a>
            <Link to="/privacy" className="hover:text-gray-200 transition">
              Privacy Policy
            </Link>
          </div>

          {/* Copyright */}
          <p className="text-gray-200 text-sm mt-4 md:mt-0">
            © {new Date().getFullYear()} Antaraal. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default HomePage;
