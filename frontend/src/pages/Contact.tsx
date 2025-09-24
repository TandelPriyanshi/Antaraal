import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import Footer from "@/components/Footer";
import Navigation from "@/components/ui/navigation";
import AnimateOnScroll from "@/components/ui/AnimateOnScroll";
import { 
  Mail, 
  Phone, 
  MapPin, 
  Clock, 
  Send,
  MessageSquare,
  Heart,
  Users,
  BookOpen,
  Sparkles,
  CheckCircle,
  Globe
} from "lucide-react";

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });

  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Here you would typically send the form data to your backend
    console.log('Form submitted:', formData);
    setIsSubmitted(true);
    
    // Reset form after 3 seconds
    setTimeout(() => {
      setIsSubmitted(false);
      setFormData({ name: '', email: '', subject: '', message: '' });
    }, 3000);
  };

  const contactInfo = [
    {
      icon: <Mail size={24} className="text-primary" />,
      title: "Email Us",
      details: "support@antaraal.com",
      description: "Get in touch for support, feedback, or partnerships"
    },
    {
      icon: <Phone size={24} className="text-primary" />,
      title: "Call Us",
      details: "+1 (555) JOURNAL",
      description: "Speak directly with our support team"
    },
    {
      icon: <MapPin size={24} className="text-primary" />,
      title: "Visit Us",
      details: "San Francisco, CA",
      description: "Our headquarters in the heart of Silicon Valley"
    },
    {
      icon: <Clock size={24} className="text-primary" />,
      title: "Support Hours",
      details: "24/7 Available",
      description: "We're here whenever you need us"
    }
  ];

  const supportOptions = [
    {
      icon: <MessageSquare size={24} className="text-primary" />,
      title: "General Support",
      description: "Questions about features, account issues, or technical help"
    },
    {
      icon: <Heart size={24} className="text-primary" />,
      title: "Wellness Guidance",
      description: "Support for your journaling journey and mental wellness"
    },
    {
      icon: <Users size={24} className="text-primary" />,
      title: "Community",
      description: "Connect with other journalers and share experiences"
    },
    {
      icon: <Globe size={24} className="text-primary" />,
      title: "Partnerships",
      description: "Business inquiries and collaboration opportunities"
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      {/* Hero Section */}
      <section className="relative pt-16 pb-12 sm:pt-20 sm:pb-16 md:pt-24 md:pb-20 lg:pt-28 lg:pb-24 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-subtle opacity-50"></div>
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 xl:px-12 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <AnimateOnScroll>
              <Badge className="mb-4 bg-primary/10 text-primary border-primary/20">
                Get In Touch
              </Badge>
            </AnimateOnScroll>
            <AnimateOnScroll delay={100}>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-foreground mb-6">
                We're Here to
                <span className="bg-gradient-hero bg-clip-text text-transparent"> Help You</span>
              </h1>
            </AnimateOnScroll>
            <AnimateOnScroll delay={180}>
              <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-8 leading-relaxed">
                Have questions about your journaling journey? Need technical support? 
                Want to share feedback? We'd love to hear from you and help you make the most of your Antaraal experience.
              </p>
            </AnimateOnScroll>
          </div>
        </div>
      </section>

      {/* Contact Info Cards */}
      <section className="py-16 bg-background/50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 items-stretch">
            {contactInfo.map((info, index) => (
              <AnimateOnScroll key={index} delay={index * 100}>
                <Card className="border-0 shadow-soft text-center bg-gradient-feature h-full min-h-[220px]">
                  <CardContent className="p-6">
                    <div className="w-12 h-12 bg-primary rounded-xl flex items-center justify-center mx-auto mb-4">
                      {React.isValidElement(info.icon)
                        ? React.cloneElement(info.icon as React.ReactElement, { className: "text-primary-foreground", size: 24 })
                        : info.icon}
                    </div>
                    <h3 className="text-lg font-bold text-foreground mb-2">
                      {info.title}
                    </h3>
                    <p className="text-primary font-semibold mb-2">
                      {info.details}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {info.description}
                    </p>
                  </CardContent>
                </Card>
              </AnimateOnScroll>
            ))}
          </div>
        </div>
      </section>

      {/* Main Contact Section */}
      <section className="py-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 max-w-6xl mx-auto">
            
            {/* Contact Form */}
            <div>
              <AnimateOnScroll>
              <Card className="border-0 shadow-elevated">
                <CardHeader>
                  <CardTitle className="text-2xl flex items-center">
                    <Send size={24} className="mr-2 text-primary" />
                    Send Us a Message
                  </CardTitle>
                  <CardDescription>
                    Fill out the form below and we'll get back to you within 24 hours.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {isSubmitted ? (
                    <div className="text-center py-8">
                      <CheckCircle size={48} className="text-green-500 mx-auto mb-4" />
                      <h3 className="text-xl font-bold text-foreground mb-2">Message Sent!</h3>
                      <p className="text-muted-foreground">
                        Thank you for reaching out. We'll get back to you soon.
                      </p>
                    </div>
                  ) : (
                    <form onSubmit={handleSubmit} className="space-y-6">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="name">Name *</Label>
                          <Input
                            id="name"
                            name="name"
                            value={formData.name}
                            onChange={handleInputChange}
                            placeholder="Your full name"
                            required
                            className="mt-1"
                          />
                        </div>
                        <div>
                          <Label htmlFor="email">Email *</Label>
                          <Input
                            id="email"
                            name="email"
                            type="email"
                            value={formData.email}
                            onChange={handleInputChange}
                            placeholder="your.email@example.com"
                            required
                            className="mt-1"
                          />
                        </div>
                      </div>
                      
                      <div>
                        <Label htmlFor="subject">Subject *</Label>
                        <Input
                          id="subject"
                          name="subject"
                          value={formData.subject}
                          onChange={handleInputChange}
                          placeholder="What's this about?"
                          required
                          className="mt-1"
                        />
                      </div>
                      
                      <div>
                        <Label htmlFor="message">Message *</Label>
                        <Textarea
                          id="message"
                          name="message"
                          value={formData.message}
                          onChange={handleInputChange}
                          placeholder="Tell us more about how we can help you..."
                          required
                          rows={5}
                          className="mt-1"
                        />
                      </div>
                      
                      <Button 
                        type="submit" 
                        className="w-full bg-gradient-hero text-primary-foreground"
                        size="lg"
                      >
                        <Send size={20} className="mr-2" />
                        Send Message
                      </Button>
                    </form>
                  )}
                </CardContent>
              </Card>
              </AnimateOnScroll>
            </div>

            {/* Support Options */}
            <div className="space-y-6">
              <div>
                <h2 className="text-3xl font-bold text-foreground mb-4">
                  How Can We Help?
                </h2>
                <p className="text-muted-foreground mb-8">
                  Choose the type of support you need, and we'll connect you with the right team member.
                </p>
              </div>

              <div className="space-y-4">
                {supportOptions.map((option, index) => (
                  <AnimateOnScroll key={index} delay={index * 100}>
                    <Card className="border-0 shadow-soft">
                      <CardContent className="p-6">
                        <div className="flex items-start space-x-4">
                          <div className="p-2 bg-gradient-subtle rounded-lg">
                            {option.icon}
                          </div>
                          <div>
                            <h3 className="text-lg font-bold text-foreground mb-2">
                              {option.title}
                            </h3>
                            <p className="text-muted-foreground">
                              {option.description}
                            </p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </AnimateOnScroll>
                ))}
              </div>

              {/* Quick Links */}
              <AnimateOnScroll>
                <Card className="border-0 shadow-soft bg-gradient-hero text-primary-foreground">
                  <CardContent className="p-6 text-center">
                    <BookOpen size={32} className="mx-auto mb-4 opacity-80" />
                    <h3 className="text-xl font-bold mb-2">Need Immediate Help?</h3>
                    <p className="opacity-90 mb-4">
                      Check out our help center for instant answers to common questions.
                    </p>
                    <div className="flex justify-center">
                      <Link to="/help">
                        <Button variant="secondary" size="sm">
                          Help Center
                        </Button>
                      </Link>
                    </div>
                  </CardContent>
                </Card>
              </AnimateOnScroll>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16 bg-background/50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
                Frequently Asked Questions
              </h2>
              <p className="text-lg text-muted-foreground">
                Quick answers to common questions about Antaraal Life Scribe.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <AnimateOnScroll>
                <Card className="border-0 shadow-soft">
                  <CardContent className="p-6">
                  <h3 className="text-lg font-bold text-foreground mb-3">
                    How secure is my journal data?
                  </h3>
                  <p className="text-muted-foreground">
                    Your data is protected with end-to-end encryption and stored securely. 
                    We never read your entries or share your personal information.
                  </p>
                  </CardContent>
                </Card>
              </AnimateOnScroll>
              
              <AnimateOnScroll delay={100}>
                <Card className="border-0 shadow-soft">
                  <CardContent className="p-6">
                  <h3 className="text-lg font-bold text-foreground mb-3">
                    Can I export my journal entries?
                  </h3>
                  <p className="text-muted-foreground">
                    Yes! You can export your entries in multiple formats including PDF, 
                    Word, and plain text at any time.
                  </p>
                  </CardContent>
                </Card>
              </AnimateOnScroll>
              
              <AnimateOnScroll delay={180}>
                <Card className="border-0 shadow-soft">
                  <CardContent className="p-6">
                  <h3 className="text-lg font-bold text-foreground mb-3">
                    Is there a mobile app available?
                  </h3>
                  <p className="text-muted-foreground">
                    Our web app works great on mobile devices, and we're currently 
                    developing native iOS and Android apps.
                  </p>
                  </CardContent>
                </Card>
              </AnimateOnScroll>
              
              <AnimateOnScroll delay={260}>
                <Card className="border-0 shadow-soft">
                  <CardContent className="p-6">
                  <h3 className="text-lg font-bold text-foreground mb-3">
                    How does the AI writing assistant work?
                  </h3>
                  <p className="text-muted-foreground">
                    Our AI provides personalized prompts and suggestions based on your 
                    writing patterns while maintaining complete privacy.
                  </p>
                  </CardContent>
                </Card>
              </AnimateOnScroll>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Contact;
