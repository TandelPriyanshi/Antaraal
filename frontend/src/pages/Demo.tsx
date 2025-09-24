import React from "react";
import Navigation from "@/components/ui/navigation";
import Footer from "@/components/Footer";
import AnimateOnScroll from "@/components/ui/AnimateOnScroll";
import { Card, CardContent } from "@/components/ui/card";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
// import demoVideo from "@/assets/videos/antraal.mp4";

const Demo = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      <section className="pt-20 pb-10 sm:pt-24 sm:pb-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-3xl sm:text-4xl font-bold text-foreground">Product Demo</h1>
            <Link to="/features">
              <Button variant="outline">Back to Features</Button>
            </Link>
          </div>

          <AnimateOnScroll>
            <Card className="border-0 shadow-elevated bg-card">
              <CardContent className="p-0">
                <div className="relative w-full aspect-video bg-muted">
                  {/* <video
                    className="w-full h-full object-cover"
                    src={demoVideo}
                    poster="https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?q=80&w=1920&auto=format&fit=crop"
                    controls
                    autoPlay
                    muted
                    playsInline
                    loop
                  /> */}
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

export default Demo;
