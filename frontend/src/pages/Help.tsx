import React from "react";
import Navigation from "@/components/ui/navigation";
import Footer from "@/components/Footer";
import { Card, CardContent } from "@/components/ui/card";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { BookOpen, Video, Shield, CreditCard, User, HelpCircle, Settings, Zap } from "lucide-react";

const Help = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      <section className="pt-20 pb-16 sm:pt-24 sm:pb-24">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <h1 className="text-3xl sm:text-4xl font-bold text-foreground mb-3">Help Center</h1>
            <p className="text-muted-foreground">Guides and answers for Antaraal Life Scribe</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
            <Card className="border-0 shadow-soft bg-card">
              <CardContent className="p-6">
                <div className="flex items-start">
                  <BookOpen className="text-primary mr-3 mt-1" size={20} />
                  <div>
                    <h2 className="text-lg font-semibold text-foreground mb-1">Getting Started</h2>
                    <p className="text-sm text-muted-foreground">Create an account, explore Features, and start journaling.</p>
                    <div className="mt-3 flex flex-wrap gap-2">
                      <Link to="/signup"><Button size="sm" variant="outline">Create Account</Button></Link>
                      <Link to="/features"><Button size="sm" variant="outline">Explore Features</Button></Link>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-soft bg-card">
              <CardContent className="p-6">
                <div className="flex items-start">
                  <Video className="text-primary mr-3 mt-1" size={20} />
                  <div>
                    <h2 className="text-lg font-semibold text-foreground mb-1">Product Demo</h2>
                    <p className="text-sm text-muted-foreground">Watch a quick demo of how Antaraal works.</p>
                    <div className="mt-3">
                      <Link to="/demo"><Button size="sm" className="bg-gradient-hero text-primary-foreground">View Demo</Button></Link>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-soft bg-card">
              <CardContent className="p-6">
                <div className="flex items-start">
                  <User className="text-primary mr-3 mt-1" size={20} />
                  <div>
                    <h2 className="text-lg font-semibold text-foreground mb-1">Your Account</h2>
                    <p className="text-sm text-muted-foreground">Sign in, manage profile, and access your dashboard.</p>
                    <div className="mt-3 flex flex-wrap gap-2">
                      <Link to="/signin"><Button size="sm" variant="outline">Sign In</Button></Link>
                      <Link to="/dashboard/entries"><Button size="sm" variant="outline">Open Dashboard</Button></Link>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-soft bg-card">
              <CardContent className="p-6">
                <div className="flex items-start">
                  <CreditCard className="text-primary mr-3 mt-1" size={20} />
                  <div>
                    <h2 className="text-lg font-semibold text-foreground mb-1">Subscriptions & Billing</h2>
                    <p className="text-sm text-muted-foreground">Compare plans and see a demo checkout (payments disabled).</p>
                    <div className="mt-3">
                      <Link to="/subscription"><Button size="sm" variant="outline">View Plans</Button></Link>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-soft bg-card">
              <CardContent className="p-6">
                <div className="flex items-start">
                  <Shield className="text-primary mr-3 mt-1" size={20} />
                  <div>
                    <h2 className="text-lg font-semibold text-foreground mb-1">Privacy & Security</h2>
                    <p className="text-sm text-muted-foreground">Understand how we protect your data and your rights.</p>
                    <div className="mt-3 flex flex-wrap gap-2">
                      <Link to="/privacy"><Button size="sm" variant="outline">Privacy Policy</Button></Link>
                      <Link to="/terms"><Button size="sm" variant="outline">Terms of Service</Button></Link>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-soft bg-card md:col-span-2">
              <CardContent className="p-6">
                <div className="flex items-start">
                  <HelpCircle className="text-primary mr-3 mt-1" size={20} />
                  <div className="w-full">
                    <h2 className="text-lg font-semibold text-foreground mb-1">FAQs</h2>
                    <ul className="space-y-3 text-sm text-muted-foreground">
                      <li><strong className="text-foreground">Where are my entries?</strong> Use the dashboard under <em>Reflections</em> and <em>Entries</em> to view and manage content.</li>
                      <li><strong className="text-foreground">How do I use AI features?</strong> Check Features: AI Writing Assistant, Writing Prompts, and Smart Search explain capabilities.</li>
                      <li><strong className="text-foreground">Is payment required?</strong> No. Subscriptions are demo-only here. Checkout fields are disabled.</li>
                      <li><strong className="text-foreground">Can I export my data?</strong> Yes—available in Features and will be part of Pro plan capabilities.</li>
                      <li><strong className="text-foreground">How is privacy handled?</strong> See Privacy Policy for details; your content is private by default.</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-soft bg-card md:col-span-2">
              <CardContent className="p-6">
                <div className="flex items-start">
                  <Settings className="text-primary mr-3 mt-1" size={20} />
                  <div className="w-full">
                    <h2 className="text-lg font-semibold text-foreground mb-2">Troubleshooting</h2>
                    <ul className="list-disc list-inside space-y-2 text-sm text-muted-foreground">
                      <li>Refresh the page if a section doesn’t load correctly.</li>
                      <li>Try signing out and back in if the dashboard looks empty.</li>
                      <li>Clear your browser cache for asset loading issues (images/video).</li>
                      <li>Check your internet connection if video demo won’t play.</li>
                    </ul>
                    <div className="mt-4">
                      <Link to="/contact"><Button size="sm" className="bg-gradient-hero text-primary-foreground"><Zap size={16} className="mr-1"/>Contact Support</Button></Link>
                    </div>
                  </div>
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

export default Help;
