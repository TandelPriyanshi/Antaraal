import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowRight, CheckCircle, Sparkles, Brain, Heart, Shield, Users, Zap, Mail, Phone, MapPin, BookOpen, Calendar, Edit3, Share2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import Footer from "@/components/Footer";
import Navigation from "@/components/ui/navigation";
import heroImage from "@/assets/hero-journal.jpg";
import AnimateOnScroll from "@/components/ui/AnimateOnScroll";
import { Box } from "@/components/ui/box";

const Homepage = () => {
  const navigate = useNavigate();

  const features = [
    {
      icon: BookOpen,
      title: "Daily Journal Writing",
      description: "Capture your thoughts, experiences, and emotions with our intuitive writing interface.",
    },
    {
      icon: Calendar,
      title: "Timeline Memory Explorer",
      description: "Navigate through your memories across time with our beautiful timeline view.",
    },
    {
      icon: Sparkles,
      title: "Life Story Generator",
      description: "Transform your journal entries into compelling autobiographical narratives using AI.",
    },
    {
      icon: Shield,
      title: "Private & Secure",
      description: "Your memories are protected with end-to-end encryption and privacy-first design.",
    },
  ];

  const steps = [
    {
      number: "01",
      title: "Write",
      description: "Add your thoughts, events, and feelings in your daily entries.",
      icon: Edit3,
    },
    {
      number: "02", 
      title: "AI Enhances",
      description: "Our AI detects emotions, summarizes content, and tags topics automatically.",
      icon: Brain,
    },
    {
      number: "03",
      title: "Relive & Share",
      description: "Search your memories, generate stories, and share moments when you choose.",
      icon: Share2,
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      {/* Hero Section */}
      <section className="relative pt-16 pb-12 sm:pt-20 sm:pb-16 md:pt-24 md:pb-20 lg:pt-28 lg:pb-24 xl:pt-32 xl:pb-28 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-subtle opacity-50"></div>
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 xl:px-12 relative z-10">
          <div className="grid lg:grid-cols-2 gap-8 md:gap-12 xl:gap-16 items-center">
            <div className="text-center lg:text-left">
              <AnimateOnScroll>
                <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold text-foreground mb-4 sm:mb-6 leading-tight">
                  Antaraal – Your{" "}
                  <span className="bg-gradient-hero bg-clip-text text-transparent">
                    AI-Powered
                  </span>{" "}
                  Life Journal
                </h1>
              </AnimateOnScroll>
              <AnimateOnScroll delay={100}>
                <p className="text-base sm:text-lg md:text-xl lg:text-xl xl:text-2xl text-muted-foreground mb-6 sm:mb-8 leading-relaxed max-w-2xl mx-auto lg:mx-0">
                  Capture your moments, track your emotions, and create your life story with the power of AI.
                </p>
              </AnimateOnScroll>
              <AnimateOnScroll delay={200}>
                <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center lg:justify-start">
                  <Button 
                    size="lg"
                    onClick={() => navigate("/signup")}
                    className="bg-gradient-hero text-primary-foreground hover:shadow-elevated transition-all w-full sm:w-auto"
                  >
                    Start Journaling
                    <ArrowRight className="ml-2" size={18} />
                  </Button>
                  <Button 
                    size="lg"
                    variant="outline"
                    onClick={() => document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' })}
                    className="border-primary text-primary hover:bg-primary hover:text-primary-foreground transition-all w-full sm:w-auto"
                  >
                    Explore Features
                  </Button>
                </div>
              </AnimateOnScroll>
            </div>
            <div className="relative mt-8 lg:mt-0">
              <div className="absolute inset-0 bg-gradient-hero rounded-2xl sm:rounded-3xl blur-2xl sm:blur-3xl opacity-20 animate-float"></div>
              <AnimateOnScroll delay={150}>
                <img 
                  src={heroImage}
                  alt="Elegant journal and writing setup representing life journaling"
                  className="relative z-10 rounded-2xl sm:rounded-3xl shadow-elevated w-full h-auto max-w-md mx-auto lg:max-w-full"
                />
              </AnimateOnScroll>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-12 sm:py-16 md:py-20 lg:py-24 xl:py-28 bg-card">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 xl:px-12">
          <div className="text-center mb-12 sm:mb-16 lg:mb-20">
            <AnimateOnScroll>
              <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold text-foreground mb-4 sm:mb-6">
                Powerful Features for Your{" "}
                <span className="bg-gradient-hero bg-clip-text text-transparent">
                  Life Story
                </span>
              </h2>
            </AnimateOnScroll>
            <AnimateOnScroll delay={100}>
              <p className="text-lg sm:text-xl lg:text-2xl text-muted-foreground max-w-2xl lg:max-w-3xl xl:max-w-4xl mx-auto px-4">
                Discover the tools that make Antaraal the perfect companion for capturing and preserving your memories.
              </p>
            </AnimateOnScroll>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8 lg:gap-6 xl:gap-8 items-stretch">
            {features.map((feature, index) => (
              <AnimateOnScroll key={index} delay={index * 80}>
                <Box 
                  className="group hover:shadow-elevated transition-all duration-300 border-0 bg-gradient-feature h-full min-h-[260px]"
                >
                  <CardHeader className="text-center pb-4">
                    <div className="w-12 h-12 sm:w-16 sm:h-16 lg:w-14 lg:h-14 xl:w-16 xl:h-16 bg-primary rounded-xl sm:rounded-2xl flex items-center justify-center mx-auto mb-3 sm:mb-4 group-hover:scale-110 transition-transform">
                      <feature.icon className="text-primary-foreground" size={24} />
                    </div>
                    <CardTitle className="text-lg sm:text-xl lg:text-lg xl:text-xl text-foreground leading-tight">{feature.title}</CardTitle>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <CardDescription className="text-center text-muted-foreground leading-relaxed text-sm sm:text-base">
                      {feature.description}
                    </CardDescription>
                  </CardContent>
                </Box>
              </AnimateOnScroll>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-12 sm:py-16 md:py-20 lg:py-24 xl:py-28">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 xl:px-12">
          <div className="text-center mb-12 sm:mb-16 lg:mb-20">
            <AnimateOnScroll>
              <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold text-foreground mb-4 sm:mb-6">
                How It Works
              </h2>
            </AnimateOnScroll>
            <AnimateOnScroll delay={100}>
              <p className="text-lg sm:text-xl lg:text-2xl text-muted-foreground max-w-2xl lg:max-w-3xl xl:max-w-4xl mx-auto px-4">
                Three simple steps to transform your daily experiences into lasting memories.
              </p>
            </AnimateOnScroll>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8 lg:gap-6 xl:gap-8 items-stretch">
            {steps.map((step, index) => (
              <AnimateOnScroll key={index} delay={index * 100}>
                <div className="relative group">
                  <Card className="text-center h-full min-h-[260px] hover:shadow-soft transition-all duration-300 border-0 p-4 sm:p-6">
                    <CardHeader className="pb-4">
                      <div className="w-16 h-16 sm:w-20 sm:h-20 lg:w-18 lg:h-18 xl:w-20 xl:h-20 bg-gradient-hero rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4 relative animate-float">
                        <step.icon className="text-primary-foreground" size={28} />
                        <div className="absolute -top-1 -right-1 sm:-top-2 sm:-right-2 w-6 h-6 sm:w-8 sm:h-8 bg-secondary rounded-full flex items-center justify-center text-xs sm:text-sm font-bold text-secondary-foreground">
                          {step.number}
                        </div>
                      </div>
                      <CardTitle className="text-xl sm:text-2xl lg:text-xl xl:text-2xl text-foreground">{step.title}</CardTitle>
                    </CardHeader>
                    <CardContent className="pt-0">
                      <CardDescription className="text-muted-foreground leading-relaxed text-sm sm:text-base lg:text-lg">
                        {step.description}
                      </CardDescription>
                    </CardContent>
                  </Card>
                </div>
              </AnimateOnScroll>
            ))}
          </div>
        </div>
      </section>

      {/* Emotional Connection Section */}
      <section className="py-12 sm:py-16 md:py-20 lg:py-24 xl:py-28 bg-gradient-feature">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 xl:px-12">
          <div className="max-w-2xl sm:max-w-3xl lg:max-w-4xl xl:max-w-5xl mx-auto text-center">
            <AnimateOnScroll>
              <blockquote className="text-lg sm:text-xl md:text-2xl lg:text-4xl xl:text-5xl font-light text-foreground leading-relaxed mb-6 sm:mb-8 px-4">
                "Your memories are precious. Let Antaraal preserve them forever."
              </blockquote>
            </AnimateOnScroll>
            <AnimateOnScroll delay={100}>
              <div className="w-16 sm:w-20 md:w-24 lg:w-32 h-0.5 sm:h-1 bg-gradient-hero mx-auto rounded-full"></div>
            </AnimateOnScroll>
          </div>
        </div>
      </section>

      {/* CTA Banner */}
      <section className="py-12 sm:py-16 md:py-20 lg:py-24 xl:py-28">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 xl:px-12">
          <AnimateOnScroll>
            <Card className="bg-gradient-hero text-center p-6 sm:p-8 md:p-12 lg:p-16 xl:p-20 border-0 rounded-2xl sm:rounded-3xl">
              <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold text-primary-foreground mb-4 sm:mb-6 leading-tight">
                Ready to start your journey?
              </h2>
              <p className="text-base sm:text-lg md:text-xl lg:text-2xl text-primary-foreground/90 mb-6 sm:mb-8 max-w-xl sm:max-w-2xl lg:max-w-3xl mx-auto px-4">
                Join thousands of people who are already capturing their life stories with Antaraal.
              </p>
              <Button 
                size="lg"
                onClick={() => navigate("/signup")}
                className="bg-background text-foreground hover:bg-background/90 hover:shadow-glow transition-all w-full sm:w-auto text-sm sm:text-base"
              >
                Start Your Free Journal
                <ArrowRight className="ml-2" size={18} />
              </Button>
            </Card>
          </AnimateOnScroll>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Homepage;