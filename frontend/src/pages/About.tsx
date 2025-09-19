import React from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Footer from "@/components/Footer";
import Navigation from "@/components/ui/navigation";
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
      icon: <Heart size={24} className="text-primary" />,
      title: "Mindful Living",
      description: "We believe in the power of reflection and mindfulness to transform lives and foster personal growth."
    },
    {
      icon: <Shield size={24} className="text-primary" />,
      title: "Privacy First",
      description: "Your thoughts are sacred. We prioritize your privacy with end-to-end encryption and secure storage."
    },
    {
      icon: <Users size={24} className="text-primary" />,
      title: "Community Support",
      description: "Building a supportive community where individuals can share their journey and inspire others."
    },
    {
      icon: <Lightbulb size={24} className="text-primary" />,
      title: "Innovation",
      description: "Combining cutting-edge AI technology with timeless journaling practices for enhanced self-discovery."
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
      bio: "Specialized in backend development and natural language processing, creating AI-powered features for enhanced journaling.",
      image: "👩‍💻"
    },
    {
      name: "Khushi Sutaria",
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
      
      {/* Hero Section */}
      <section className="relative pt-16 pb-12 sm:pt-20 sm:pb-16 md:pt-24 md:pb-20 lg:pt-28 lg:pb-24 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-subtle opacity-50"></div>
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 xl:px-12 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <Badge className="mb-4 bg-primary/10 text-primary border-primary/20">
              Our Story
            </Badge>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-foreground mb-6">
              Empowering Lives Through
              <span className="bg-gradient-hero bg-clip-text text-transparent"> Mindful Journaling</span>
            </h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-8 leading-relaxed">
              At Antaraal Life Scribe, we believe that every person has a unique story worth telling. 
              Our mission is to provide the tools and inspiration needed to capture, reflect on, 
              and learn from life's precious moments.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/signup">
                <Button size="lg" className="bg-gradient-hero text-primary-foreground">
                  <BookOpen size={20} className="mr-2" />
                  Start Your Journey
                </Button>
              </Link>
              <Link to="/features">
                <Button size="lg" variant="outline">
                  <Sparkles size={20} className="mr-2" />
                  Explore Features
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Mission Statement */}
      <section className="py-16 bg-background/50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <Card className="border-0 shadow-elevated bg-gradient-hero text-primary-foreground">
              <CardContent className="p-8 sm:p-12 text-center">
                <Quote size={48} className="mx-auto mb-6 opacity-80" />
                <h2 className="text-3xl sm:text-4xl font-bold mb-6">Our Mission</h2>
                <p className="text-lg opacity-90 leading-relaxed mb-6">
                  To democratize the power of self-reflection and personal growth through intelligent, 
                  secure, and beautiful journaling experiences. We're building more than just an app – 
                  we're creating a movement toward more mindful, intentional living.
                </p>
                <div className="flex items-center justify-center space-x-2 text-sm opacity-80">
                  <Heart size={16} className="text-red-400" />
                  <span>Founded in 2023 with love and purpose</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>


      {/* Values Section */}
      <section className="py-16 bg-background/50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
              Our Core Values
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              These principles guide everything we do, from product development to community building.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {values.map((value, index) => (
              <Card key={index} className="border-0 shadow-soft hover:shadow-elevated transition-all duration-300 group">
                <CardHeader className="pb-4">
                  <div className="p-3 bg-gradient-subtle rounded-lg w-fit mb-4 group-hover:scale-110 transition-transform">
                    {value.icon}
                  </div>
                  <CardTitle className="text-xl group-hover:text-primary transition-colors">
                    {value.title}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground leading-relaxed">
                    {value.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
              Meet Our Team
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Passionate individuals dedicated to helping you discover the power of mindful journaling.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {team.map((member, index) => (
              <Card key={index} className="border-0 shadow-soft hover:shadow-elevated transition-all duration-300 text-center group">
                <CardContent className="p-6">
                  <div className="text-6xl mb-4 group-hover:scale-110 transition-transform">
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
            ))}
          </div>
        </div>
      </section>

      {/* Story Section */}
      <section className="py-16 bg-background/50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
                Our Journey
              </h2>
              <p className="text-lg text-muted-foreground">
                From a simple idea to a global community of mindful journalers.
              </p>
            </div>
            
            <div className="space-y-8">
              <Card className="border-0 shadow-soft">
                <CardContent className="p-8">
                  <div className="flex items-start space-x-4">
                    <div className="p-2 bg-primary/10 rounded-lg">
                      <Lightbulb size={24} className="text-primary" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-foreground mb-2">The Spark</h3>
                      <p className="text-muted-foreground leading-relaxed">
                        It all started when our founder, Sarah, realized that traditional journaling apps 
                        lacked the intelligence and personalization needed to truly support personal growth. 
                        She envisioned a platform that could understand context, provide meaningful prompts, 
                        and help users discover patterns in their thoughts and emotions.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card className="border-0 shadow-soft">
                <CardContent className="p-8">
                  <div className="flex items-start space-x-4">
                    <div className="p-2 bg-primary/10 rounded-lg">
                      <Users size={24} className="text-primary" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-foreground mb-2">Building Community</h3>
                      <p className="text-muted-foreground leading-relaxed">
                        What began as a personal project quickly grew into something much larger. 
                        We discovered that people everywhere were seeking deeper connection with themselves 
                        and meaningful ways to process their experiences. Our beta community of 100 users 
                        has now grown to over 50,000 active journalers worldwide.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card className="border-0 shadow-soft">
                <CardContent className="p-8">
                  <div className="flex items-start space-x-4">
                    <div className="p-2 bg-primary/10 rounded-lg">
                      <Globe size={24} className="text-primary" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-foreground mb-2">Global Impact</h3>
                      <p className="text-muted-foreground leading-relaxed">
                        Today, Antaraal Life Scribe serves users in over 150 countries, supporting 
                        multiple languages and cultural contexts. We're proud to be part of millions 
                        of personal growth journeys, helping people develop greater self-awareness, 
                        emotional intelligence, and life satisfaction.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center">
            <Card className="border-0 shadow-elevated bg-gradient-hero text-primary-foreground">
              <CardContent className="p-8 sm:p-12">
                <Award size={48} className="mx-auto mb-6 opacity-80" />
                <h2 className="text-3xl sm:text-4xl font-bold mb-4">
                  Join Our Story
                </h2>
                <p className="text-lg opacity-90 mb-8 max-w-2xl mx-auto">
                  Become part of a global community committed to mindful living and personal growth. 
                  Your journey of self-discovery starts with a single entry.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Link to="/signup">
                    <Button size="lg" variant="secondary">
                      <Zap size={20} className="mr-2" />
                      Start Journaling Today
                    </Button>
                  </Link>
                  <Link to="/features">
                    <Button size="lg" variant="outline" className="bg-white text-primary border-white/80">
                      <Sparkles size={20} className="mr-2" />
                      Explore Features
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default About;
