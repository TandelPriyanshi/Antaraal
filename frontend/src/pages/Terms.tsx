import React from "react";
import Navigation from "@/components/ui/navigation";
import Footer from "@/components/Footer";
import { Card, CardContent } from "@/components/ui/card";

const sections: { title: string; content: string }[] = [
  {
    title: "1. Overview",
    content:
      "These Terms of Service (\"Terms\") govern your access to and use of Antaraal Life Scribe (the \"Service\"). By using the Service, you agree to these Terms.",
  },
  {
    title: "2. Eligibility",
    content:
      "You must be at least 13 years old (or the minimum legal age in your jurisdiction) to use the Service. If you use the Service on behalf of an organization, you represent that you have authority to bind that organization.",
  },
  {
    title: "3. Your Account",
    content:
      "You are responsible for maintaining the confidentiality of your account credentials and for all activities that occur under your account. Notify us immediately of unauthorized use.",
  },
  {
    title: "4. Your Content",
    content:
      "You retain ownership of the content you create (journal entries, tags, prompts). You grant us a limited license to store and process your content solely to provide and improve the Service. We do not sell your data.",
  },
  {
    title: "5. Acceptable Use",
    content:
      "Do not use the Service to violate laws, infringe rights, or distribute malicious content. Do not attempt to interfere with or disrupt the Service or its infrastructure.",
  },
  {
    title: "6. Subscriptions & Payments",
    content:
      "Certain features may require a paid plan. Prices, billing terms, and cancellation policies will be presented at checkout. Unless otherwise stated, subscriptions renew automatically until canceled.",
  },
  {
    title: "7. Privacy",
    content:
      "Your use of the Service is subject to our Privacy Policy, which explains how we collect, use, and protect your information.",
  },
  {
    title: "8. Intellectual Property",
    content:
      "The Service, including its design, features, and trademarks, are owned by Antaraal or its licensors. You may not copy, modify, or distribute our intellectual property without permission.",
  },
  {
    title: "9. Service Availability & Changes",
    content:
      "We may modify, suspend, or discontinue the Service or certain features at any time. We strive to provide a reliable experience but do not guarantee uninterrupted availability.",
  },
  {
    title: "10. Disclaimers & Limitation of Liability",
    content:
      "The Service is provided \"as is\" without warranties of any kind. To the fullest extent permitted by law, we are not liable for any indirect, incidental, or consequential damages arising from your use of the Service.",
  },
  {
    title: "11. Termination",
    content:
      "You may stop using the Service at any time. We may suspend or terminate your access if you violate these Terms or create risk to other users or the platform.",
  },
  {
    title: "12. Contact",
    content:
      "For questions about these Terms, contact support@antaraal.com.",
  },
];

const Terms = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      <section className="pt-20 pb-16 sm:pt-24 sm:pb-24">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl sm:text-4xl font-bold text-foreground mb-6">Terms of Service</h1>
          <p className="text-muted-foreground mb-8">
            Please read these terms carefully before using Antaraal Life Scribe.
          </p>

          <Card className="border-0 shadow-soft bg-card">
            <CardContent className="p-6 sm:p-8">
              <div className="space-y-8">
                {sections.map((s, i) => (
                  <div key={i}>
                    <h2 className="text-xl font-semibold text-foreground mb-2">{s.title}</h2>
                    <p className="text-muted-foreground leading-relaxed">{s.content}</p>
                  </div>
                ))}
              </div>
              <p className="text-xs text-muted-foreground mt-8">
                Last updated: {new Date().getFullYear()}
              </p>
            </CardContent>
          </Card>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Terms;
