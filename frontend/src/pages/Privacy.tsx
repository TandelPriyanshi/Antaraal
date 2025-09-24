import React from "react";
import Navigation from "@/components/ui/navigation";
import Footer from "@/components/Footer";
import { Card, CardContent } from "@/components/ui/card";

const sections: { title: string; content: string }[] = [
  {
    title: "1. Introduction",
    content:
      "This Privacy Policy explains how Antaraal Life Scribe (“we”, “our”, “us”) collects, uses, and protects your personal information when you use our services.",
  },
  {
    title: "2. Information We Collect",
    content:
      "We may collect information you provide (journal entries, prompts, tags), account details (name, email), and limited technical data (device, browser, and usage analytics).",
  },
  {
    title: "3. How We Use Your Information",
    content:
      "We use your information to provide and improve the product, personalize your experience, offer insights and prompts, ensure security, and communicate important updates.",
  },
  {
    title: "4. Your Content & Privacy",
    content:
      "Your journal content is private by default. We do not sell your data. You retain ownership of your content and may export or delete it at any time.",
  },
  {
    title: "5. Data Security",
    content:
      "We implement administrative, technical, and organizational measures to protect your information from unauthorized access, alteration, or disclosure.",
  },
  {
    title: "6. Data Retention",
    content:
      "We retain personal information only for as long as necessary to provide our services and comply with legal obligations. You can request deletion at any time.",
  },
  {
    title: "7. Third-Party Services",
    content:
      "We may use trusted third-party providers (e.g., analytics, cloud hosting). These providers are vetted and bound by data protection obligations.",
  },
  {
    title: "8. International Transfers",
    content:
      "Your information may be processed in countries other than your own. We take steps to ensure appropriate safeguards in line with applicable laws.",
  },
  {
    title: "9. Your Rights",
    content:
      "Depending on your location, you may have rights to access, correct, delete, or restrict processing of your data, and to withdraw consent where applicable.",
  },
  {
    title: "10. Contact Us",
    content:
      "If you have questions about this policy or your data, contact us at support@antaraal.com.",
  },
];

const Privacy = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      <section className="pt-20 pb-16 sm:pt-24 sm:pb-24">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl sm:text-4xl font-bold text-foreground mb-6">Privacy Policy</h1>
          <p className="text-muted-foreground mb-8">
            Your privacy matters to us. Below is a clear summary of how we handle your data.
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

export default Privacy;
