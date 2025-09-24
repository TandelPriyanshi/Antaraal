import React from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Footer from "@/components/Footer";
import Navigation from "@/components/ui/navigation";
import AnimateOnScroll from "@/components/ui/AnimateOnScroll";
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
      {/* Navigation (shared with Homepage for consistent logo/positioning) */}
      <Navigation />

      {/* Hero Section */}
      <section className="pt-20 pb-16 sm:pt-24 sm:pb-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <AnimateOnScroll>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-foreground mb-6">
              Everything You Need for
              <span className="bg-gradient-hero bg-clip-text text-transparent"> Meaningful Journaling</span>
            </h1>
          </AnimateOnScroll>
          <AnimateOnScroll delay={100}>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-8">
              Discover the comprehensive set of features designed to enhance your journaling experience 
              and support your personal growth journey.
            </p>
          </AnimateOnScroll>
          <AnimateOnScroll delay={200}>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/signup">
                <Button size="lg" className="bg-gradient-hero text-primary-foreground">
                  <Zap size={20} className="mr-2" />
                  Start Journaling Free
                </Button>
              </Link>
              <Link to="/demo">
                <Button size="lg" variant="outline">
                  <Users size={20} className="mr-2" />
                  View Demo
                </Button>
              </Link>
            </div>
          </AnimateOnScroll>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-16 bg-card">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <AnimateOnScroll>
              <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
                Powerful Features for Every Journaler
              </h2>
            </AnimateOnScroll>
            <AnimateOnScroll delay={100}>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                From beginners to seasoned writers, our features are designed to support 
                your unique journaling style and goals.
              </p>
            </AnimateOnScroll>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 items-stretch">
            {features.map((feature, index) => (
              <AnimateOnScroll key={index} delay={index * 80}>
                <Card className="group hover:shadow-elevated transition-all duration-300 border-0 bg-gradient-feature h-full min-h-[260px]">
                  <CardHeader className="pb-4">
                    <div className="w-12 h-12 bg-primary rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                      {React.isValidElement(feature.icon)
                        ? React.cloneElement(feature.icon as React.ReactElement, { className: "text-primary-foreground", size: 24 })
                        : feature.icon}
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
              </AnimateOnScroll>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-16 bg-background/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <AnimateOnScroll>
              <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
                Loved by Thousands of Users
              </h2>
            </AnimateOnScroll>
            <AnimateOnScroll delay={100}>
              <p className="text-lg text-muted-foreground">
                See what our community has to say about their journaling experience.
              </p>
            </AnimateOnScroll>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch">
            {testimonials.map((testimonial, index) => (
              <AnimateOnScroll key={index} delay={index * 120}>
                <Card className="border-0 shadow-soft bg-card rounded-2xl h-full min-h-[240px]">
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
              </AnimateOnScroll>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-12 sm:py-16 md:py-20 lg:py-24 xl:py-28">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 xl:px-12">
          <AnimateOnScroll>
            <Card className="bg-gradient-hero text-center p-6 sm:p-8 md:p-12 lg:p-16 xl:p-20 border-0 rounded-2xl sm:rounded-3xl">
              <CardContent className="p-0">
                <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold text-primary-foreground mb-4 sm:mb-6 leading-tight">
                  Ready to Start Your Journey?
                </h2>
                <p className="text-base sm:text-lg md:text-xl lg:text-2xl text-primary-foreground/90 mb-6 sm:mb-8 max-w-xl sm:max-w-2xl lg:max-w-3xl mx-auto px-4">
                  Join thousands of users who have transformed their lives through mindful journaling.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Link to="/signup">
                    <Button size="lg" className="bg-background text-foreground hover:bg-background/90 hover:shadow-glow transition-all w-full sm:w-auto text-sm sm:text-base">
                      Start Free Today
                      <ArrowRight size={20} className="ml-2" />
                    </Button>
                  </Link>
                  <Link to="/features">
                    <Button size="lg" variant="outline" className="border-primary text-primary hover:bg-primary hover:text-primary-foreground transition-all w-full sm:w-auto text-sm sm:text-base">
                      Explore Features
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          </AnimateOnScroll>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Features;
