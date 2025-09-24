import React from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Footer from "@/components/Footer";
import Navigation from "@/components/ui/navigation";
import AnimateOnScroll from "@/components/ui/AnimateOnScroll";
import heroImage from "@/assets/hero-journal.jpg"; // fallback
import { 
  Heart, 
  Users, 
  Target, 
  Lightbulb, 
  Shield, 
  Globe,
  BookOpen,
  Sparkles,
  ArrowRight,
  Quote,
  Award,
  Zap
} from "lucide-react";

const About = () => {
  const values = [
    {
      icon: <Shield size={24} className="text-primary" />,
      title: "Privacy First",
      description: "Your memories are yours alone. Antaraal is designed with security at the core so your personal stories stay private."
    },
    {
      icon: <Target size={24} className="text-primary" />,
      title: "Purpose Driven",
      description: "We help people capture life moments and find meaning through mindful reflection and thoughtful AI insights."
    },
    {
      icon: <Users size={24} className="text-primary" />,
      title: "Community Focused",
      description: "We’re building a kind, supportive community for journalers who value introspection, growth, and storytelling."
    },
    {
      icon: <Award size={24} className="text-primary" />,
      title: "Excellence",
      description: "We obsess over quality and keep improving Antaraal based on real user feedback and evolving needs."
    }
  ];

  const team = [
    {
      name: "Priyanshi Tandel",
      role: "Backend Developer & NLP Specialist",
      bio: "Expert in backend architecture and natural language processing, building intelligent systems for journaling insights.",
      image: "👩‍💻"
    },
    {
      name: "Smruti Pradhan",
      role: "Backend Developer & NLP Engineer",
      bio: "Specialized in backend development and natural language processing, creating AI-powered features for journaling.",
      image: "👩‍💻"
    },
    {
      name: "Khushi Sutariya",
      role: "Frontend Developer & UI Designer",
      bio: "Frontend specialist focused on creating beautiful, responsive interfaces and seamless user experiences.",
      image: "👩‍🎨"
    },
    {
      name: "Diya Tandel",
      role: "Frontend Developer & UI Designer",
      bio: "Frontend developer and UI designer passionate about crafting intuitive, user-friendly journaling interfaces.",
      image: "👩‍🎨"
    }
  ];

  const stats = [
    { number: "50K+", label: "Active Journalers" },
    { number: "2M+", label: "Journal Entries" },
    { number: "95%", label: "User Satisfaction" },
    { number: "150+", label: "Countries Served" }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      {/* Hero Section with background image */}
      <section className="relative pt-20 sm:pt-24 md:pt-28">
        {/* Prefer group-of-people image (remote), fallback to local hero */}
        <img
          src="https://images.unsplash.com/photo-1521737604893-d14cc237f11d?q=80&w=1920&auto=format&fit=crop"
          onError={(e) => { (e.currentTarget as HTMLImageElement).src = heroImage; }}
          alt="A diverse group of people collaborating and smiling around a table"
          className="absolute inset-0 w-full h-full object-cover opacity-60"
        />
        <div className="absolute inset-0 bg-primary/80" />
        <div className="relative z-10">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 xl:px-12">
            <div className="max-w-4xl mx-auto text-center py-16 sm:py-20 lg:py-24">
              <AnimateOnScroll>
                <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-foreground">
                  About <span className="bg-gradient-hero bg-clip-text text-transparent">Antaraal</span>
                </h1>
              </AnimateOnScroll>
              <AnimateOnScroll delay={120}>
                <p className="text-lg sm:text-xl text-primary-foreground/90 mt-4 max-w-3xl mx-auto">
                  We’re on a mission to help people capture, understand, and cherish their life stories through the power of AI and thoughtful design.
                </p>
              </AnimateOnScroll>
            </div>
          </div>
        </div>
      </section>

      {/* Title + Divider (Inspiring change) */}
      <section className="py-16 bg-background">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-5xl mx-auto text-center">
            <AnimateOnScroll>
              <h2 className="text-3xl sm:text-4xl font-bold text-foreground">Inspiring change</h2>
            </AnimateOnScroll>
            <div className="mt-3 flex items-center justify-center">
              <span className="w-12 h-1 bg-primary rounded-full"></span>
            </div>
          </div>
        </div>
      </section>

      {/* Alternating media blocks (like reference) */}
      <section className="py-8 sm:py-12">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 items-center">
            {/* Image left */}
            <AnimateOnScroll>
              <img
                src="https://images.unsplash.com/photo-1519681393784-d120267933ba?q=80&w=1200&auto=format&fit=crop"
                alt="Hand holding a pen over a journal on a desk"
                className="w-full rounded-2xl shadow-soft object-cover"
              />
            </AnimateOnScroll>
            {/* Text right */}
            <AnimateOnScroll delay={120}>
              <div>
                <h3 className="text-2xl sm:text-3xl font-semibold text-foreground mb-3">
                  You are what you write. So write brilliantly.
                </h3>
                <p className="text-muted-foreground leading-relaxed">
                  Antaraal began with a simple observation: we capture countless moments, yet few tools help us truly make sense of them. We wanted a companion that encourages reflection, reveals patterns, and turns everyday experiences into a meaningful personal narrative.
                </p>
                <p className="text-muted-foreground leading-relaxed mt-4">
                  Drawing from journaling traditions and modern AI, we built Antaraal to be gentle, private, and deeply helpful—never replacing your story, only illuminating it.
                </p>
              </div>
            </AnimateOnScroll>
          </div>
        </div>
      </section>

      <section className="py-4 sm:py-12">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 items-center">
            {/* Text left */}
            <AnimateOnScroll>
              <div>
                <h3 className="text-2xl sm:text-3xl font-semibold text-foreground mb-3">Write with a purpose</h3>
                <p className="text-muted-foreground leading-relaxed">
                  Today, Antaraal supports a growing community around the world. Our focus remains the same: empower you to understand your emotions, celebrate progress, and preserve memories that matter.
                </p>
                <div className="mt-6">
                  <Link to="/features">
                    <Button variant="outline" className="border-primary text-primary hover:bg-primary hover:text-primary-foreground">
                      Learn more
                    </Button>
                  </Link>
                </div>
              </div>
            </AnimateOnScroll>
            {/* Image right */}
            <AnimateOnScroll delay={120}>
              <img
                src="https://images.unsplash.com/photo-1526481280698-8fcc13fdc616?q=80&w=1200&auto=format&fit=crop"
                alt="Waterfall and nature symbolizing clarity"
                className="w-full rounded-2xl shadow-soft object-cover"
              />
            </AnimateOnScroll>
          </div>
        </div>
      </section>


      {/* Values Section */}
      <section className="py-16 bg-background/50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <AnimateOnScroll>
              <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">Our Values</h2>
            </AnimateOnScroll>
            <AnimateOnScroll delay={100}>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">The principles that guide everything we do at Antaraal.</p>
            </AnimateOnScroll>
          </div>
          
          <div className="grid grid-cols-4 gap-6 max-w-6xl mx-auto">
            {values.map((value, index) => (
              <AnimateOnScroll key={index} delay={index * 120}>
                <Card className={`h-full border-0 shadow-elevated bg-gradient-feature rounded-2xl overflow-hidden ${
                  index % 2 === 0 ? '' : ''
                }`}>
                  <CardContent className="p-0">
                    <div className={`flex flex-col items-start p-6`}>
                      {/* Icon Section */}
                      <div className="flex-shrink-0 w-14 h-14 bg-primary rounded-full flex items-center justify-center">
                        {React.isValidElement(value.icon)
                          ? React.cloneElement(value.icon as React.ReactElement, { className: "text-primary-foreground", size: 24 })
                          : value.icon}
                      </div>
                      
                      {/* Content Section */}
                      <div className="mt-4 w-full">
                        <h3 className="text-xl font-bold text-foreground mb-2">
                          {value.title}
                        </h3>
                        <p className="text-muted-foreground leading-relaxed">
                          {value.description}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </AnimateOnScroll>
            ))}
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <AnimateOnScroll>
            <div className="text-center mb-12">
              <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
                Meet Our Team
              </h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Passionate individuals dedicated to helping you discover the power of mindful journaling.
              </p>
            </div>
          </AnimateOnScroll>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {team.map((member, index) => (
              <AnimateOnScroll key={index} delay={index * 120}>
                <Card className="border-0 shadow-soft text-center">
                  <CardContent className="p-6">
                    <div className="text-6xl mb-4">
                      {member.image}
                    </div>
                    <h3 className="text-xl font-bold text-foreground mb-2">
                      {member.name}
                    </h3>
                    <Badge variant="secondary" className="mb-4">
                      {member.role}
                    </Badge>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {member.bio}
                    </p>
                  </CardContent>
                </Card>
              </AnimateOnScroll>
            ))}
          </div>
        </div>
      </section>


      {/* CTA Banner (match Homepage) */}
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
              <Link to="/signup">
                <Button 
                  size="lg"
                  className="bg-background text-foreground hover:bg-background/90 hover:shadow-glow transition-all w-full sm:w-auto text-sm sm:text-base"
                >
                  Start Your Free Journal
                  <ArrowRight className="ml-2" size={18} />
                </Button>
              </Link>
            </Card>
          </AnimateOnScroll>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default About;
