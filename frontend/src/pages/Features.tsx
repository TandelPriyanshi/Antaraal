import React from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Footer from "@/components/Footer";
import { 
  BookOpen, 
  Brain,
  Lightbulb, 
  Heart, 
  Calendar, 
  Lock, 
  Palette, 
  Search, 
  Share2, 
  Sparkles, 
  Target, 
  TrendingUp, 
  Users,
  Zap,
  CheckCircle,
  Star,
  ArrowRight,
  Shield,
  Cloud
} from "lucide-react";

const Features = () => {
  const features = [
    {
      icon: <BookOpen size={24} className="text-primary" />,
      title: "Daily Journaling",
      description: "Capture your thoughts, emotions, and experiences with our intuitive writing interface.",
      benefits: ["Rich text editor", "Auto-save functionality", "Word count tracking", "Writing streaks"]
    },
    {
      icon: <Brain size={24} className="text-primary" />,
      title: "AI Writing Assistant",
      description: "Get intelligent suggestions and prompts to enhance your writing flow.",
      benefits: ["Smart prompts", "Writing suggestions", "Grammar assistance", "Style improvements"]
    },
    {
      icon: <Lightbulb size={24} className="text-primary" />,
      title: "Writing Prompts",
      description: "Get inspired with hundreds of thought-provoking prompts across different categories.",
      benefits: ["Daily prompts", "Categorized by difficulty", "Personal growth focused", "Creative writing exercises"]
    },
    {
      icon: <Heart size={24} className="text-primary" />,
      title: "Mood Tracking",
      description: "Monitor your emotional journey and discover patterns in your mental wellbeing.",
      benefits: ["Visual mood charts", "Emotion analytics", "Trend identification", "Wellness insights"]
    },
    {
      icon: <Search size={24} className="text-primary" />,
      title: "Smart Search",
      description: "Find any entry instantly with powerful search across all your journal content.",
      benefits: ["Full-text search", "Tag filtering", "Date range queries", "Quick access"]
    },
    {
      icon: <Calendar size={24} className="text-primary" />,
      title: "Calendar View",
      description: "Visualize your journaling journey with an interactive calendar interface.",
      benefits: ["Monthly overview", "Entry highlights", "Streak visualization", "Quick navigation"]
    },
    {
      icon: <Palette size={24} className="text-primary" />,
      title: "Personalization",
      description: "Customize your journaling experience with themes, tags, and personal preferences.",
      benefits: ["Custom themes", "Personal tags", "Layout options", "Font preferences"]
    },
    {
      icon: <Shield size={24} className="text-primary" />,
      title: "Privacy & Security",
      description: "Your thoughts are safe with end-to-end encryption and privacy-first design.",
      benefits: ["Data encryption", "Private by default", "Secure storage", "No data mining"]
    },
    {
      icon: <Cloud size={24} className="text-primary" />,
      title: "Cloud Sync",
      description: "Access your journal from anywhere with seamless cloud synchronization.",
      benefits: ["Multi-device sync", "Offline access", "Automatic backup", "Cross-platform"]
    },
    {
      icon: <TrendingUp size={24} className="text-primary" />,
      title: "Analytics & Insights",
      description: "Gain valuable insights into your writing habits and personal growth.",
      benefits: ["Writing statistics", "Growth tracking", "Habit analysis", "Progress reports"]
    }
  ];

  const testimonials = [
    {
      name: "Sarah Chen",
      role: "Wellness Coach",
      content: "Antaraal has transformed my daily reflection practice. The prompts are incredibly thoughtful.",
      rating: 5
    },
    {
      name: "Michael Rodriguez",
      role: "Student",
      content: "The mood tracking feature helped me understand my emotional patterns better than ever.",
      rating: 5
    },
    {
      name: "Emma Thompson",
      role: "Writer",
      content: "Finally, a journaling app that feels personal and secure. Love the writing prompts!",
      rating: 5
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-subtle">
      {/* Navigation */}
      <nav className="border-b bg-background/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link to="/" className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-hero rounded-lg flex items-center justify-center">
                <span className="text-primary-foreground font-bold text-lg">A</span>
              </div>
              <span className="text-xl font-bold text-foreground">Antaraal</span>
            </Link>
            
            <div className="flex items-center space-x-8">
              <Link to="/" className="text-foreground hover:text-primary transition-colors">
                Home
              </Link>
              <Link to="/signin" className="text-foreground hover:text-primary transition-colors">
                Sign In
              </Link>
              <Link to="/signup">
                <Button className="bg-gradient-hero text-primary-foreground">
                  Get Started
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="py-16 sm:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-foreground mb-6">
            Everything You Need for
            <span className="bg-gradient-hero bg-clip-text text-transparent"> Meaningful Journaling</span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-8">
            Discover the comprehensive set of features designed to enhance your journaling experience 
            and support your personal growth journey.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/signup">
              <Button size="lg" className="bg-gradient-hero text-primary-foreground">
                <Zap size={20} className="mr-2" />
                Start Journaling Free
              </Button>
            </Link>
            <Button size="lg" variant="outline">
              <Users size={20} className="mr-2" />
              View Demo
            </Button>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
              Powerful Features for Every Journaler
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              From beginners to seasoned writers, our features are designed to support 
              your unique journaling style and goals.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="border-0 shadow-soft hover:shadow-elevated transition-all duration-300 group">
                <CardHeader className="pb-4">
                  <div className="p-3 bg-gradient-subtle rounded-lg w-fit mb-4 group-hover:scale-110 transition-transform">
                    {feature.icon}
                  </div>
                  <CardTitle className="text-xl group-hover:text-primary transition-colors">
                    {feature.title}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground mb-4 leading-relaxed">
                    {feature.description}
                  </p>
                  <ul className="space-y-2">
                    {feature.benefits.map((benefit, benefitIndex) => (
                      <li key={benefitIndex} className="flex items-center text-sm text-muted-foreground">
                        <div className="w-1.5 h-1.5 bg-primary rounded-full mr-3 flex-shrink-0" />
                        {benefit}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-16 bg-background/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
              Loved by Thousands of Users
            </h2>
            <p className="text-lg text-muted-foreground">
              See what our community has to say about their journaling experience.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <Card key={index} className="border-0 shadow-soft">
                <CardContent className="p-6">
                  <div className="flex items-center mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Heart key={i} size={16} className="text-red-500 fill-current mr-1" />
                    ))}
                  </div>
                  <blockquote className="text-foreground mb-4 leading-relaxed">
                    "{testimonial.content}"
                  </blockquote>
                  <div>
                    <div className="font-medium text-foreground">{testimonial.name}</div>
                    <div className="text-sm text-muted-foreground">{testimonial.role}</div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <Card className="border-0 shadow-elevated bg-gradient-hero text-primary-foreground">
            <CardContent className="p-8 sm:p-12">
              <h2 className="text-3xl sm:text-4xl font-bold mb-4">
                Ready to Start Your Journey?
              </h2>
              <p className="text-lg opacity-90 mb-8 max-w-2xl mx-auto">
                Join thousands of users who have transformed their lives through mindful journaling. 
                Start your free account today.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link to="/signup">
                  <Button size="lg" variant="secondary">
                    <BookOpen size={20} className="mr-2" />
                    Start Free Today
                  </Button>
                </Link>
                <Link to="/">
                  <Button size="lg" variant="outline" className="bg-white text-primary border-white/80">
                    <ArrowRight size={20} className="mr-2" />
                    Learn More
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Features;
