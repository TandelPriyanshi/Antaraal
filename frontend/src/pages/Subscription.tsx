import React, { useState, ReactNode } from "react";
import Navigation from "@/components/ui/navigation";
import Footer from "@/components/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Check, Zap, Star } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

type Plan = {
  id: "free" | "pro" | "premium";
  name: string;
  priceMonthly: number;
  priceYearly: number;
  highlight: string;
  features: string[];
  badge?: string;
  icon?: ReactNode;
};

const plans: Plan[] = [
  {
    id: "free",
    name: "Free",
    priceMonthly: 0,
    priceYearly: 0,
    highlight: "Get started with journaling",
    features: [
      "Unlimited private entries",
      "Basic prompts",
      "Mood tracking",
      "Cloud sync",
    ],
  },
  {
    id: "pro",
    name: "Pro",
    priceMonthly: 399,
    priceYearly: 3999,
    highlight: "AI-powered insights",
    features: [
      "Everything in Free",
      "AI writing assistant",
      "Smart search & tags",
      "Export & backup",
    ],
    badge: "Popular",
    icon: <Zap size={18} className="mr-1" />,
  },
  {
    id: "premium",
    name: "Premium",
    priceMonthly: 999,
    priceYearly: 9999,
    highlight: "For power journalers",
    features: [
      "Everything in Pro",
      "Advanced analytics",
      "Custom themes",
      "Priority support",
    ],
    icon: <Star size={18} className="mr-1" />,
  },
];

const Subscription = () => {
  const [billing, setBilling] = useState<"monthly" | "yearly">("monthly");
  const [selectedPlan, setSelectedPlan] = useState<Plan["id"]>("pro");
  const { toast } = useToast();

  const priceFor = (plan: typeof plans[number]) =>
    billing === "monthly" ? plan.priceMonthly : plan.priceYearly;

  const formatINR = (amount: number) =>
    new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(amount);

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      <section className="pt-20 pb-16 sm:pt-24 sm:pb-24">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <h1 className="text-3xl sm:text-4xl font-bold text-foreground mb-3">Choose Your Plan</h1>
            <p className="text-muted-foreground">Upgrade anytime. Cancel anytime.</p>

            <div className="inline-flex items-center mt-6 rounded-full border border-border p-1">
              <button
                className={`px-4 py-1.5 text-sm rounded-full ${
                  billing === "monthly" ? "bg-primary text-primary-foreground" : "text-foreground"
                }`}
                onClick={() => setBilling("monthly")}
              >
                Monthly
              </button>
              <button
                className={`px-4 py-1.5 text-sm rounded-full ${
                  billing === "yearly" ? "bg-primary text-primary-foreground" : "text-foreground"
                }`}
                onClick={() => setBilling("yearly")}
              >
                Yearly
              </button>
            </div>
          </div>

          {/* Plans */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-stretch mb-12">
            {plans.map((plan) => (
              <Card
                key={plan.id}
                className={`h-full border-0 ${
                  plan.id === selectedPlan ? "shadow-elevated" : "shadow-soft"
                } bg-card rounded-2xl hover:shadow-elevated transition-shadow`}
              >
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-xl flex items-center">
                      {plan.icon ?? null}
                      {plan.name}
                    </CardTitle>
                    {plan.badge ? (
                      <span className="text-xs px-2 py-1 rounded-full bg-primary/10 text-primary">
                        {plan.badge}
                      </span>
                    ) : null}
                  </div>
                  <div className="mt-3 text-foreground text-3xl font-bold">
                    {priceFor(plan) === 0 ? (
                      <>Free</>
                    ) : (
                      <>
                        {formatINR(priceFor(plan))}
                        <span className="text-sm font-normal text-muted-foreground">
                          /{billing === "monthly" ? "mo" : "yr"}
                        </span>
                      </>
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground">{plan.highlight}</p>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 mb-6">
                    {plan.features.map((f, i) => (
                      <li key={i} className="flex items-center text-sm text-muted-foreground">
                        <Check size={16} className="text-primary mr-2" /> {f}
                      </li>
                    ))}
                  </ul>
                  <Button
                    variant={plan.id === selectedPlan ? "default" : "outline"}
                    className={plan.id === selectedPlan ? "w-full bg-gradient-hero text-primary-foreground" : "w-full"}
                    onClick={() => setSelectedPlan(plan.id)}
                  >
                    {plan.id === selectedPlan ? "Selected" : "Choose Plan"}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Simulated Checkout */}
          <Card className="border-0 shadow-soft bg-card">
            <CardContent className="p-6">
              <h2 className="text-xl font-semibold text-foreground mb-4">Checkout (Demo)</h2>
              <p className="text-sm text-muted-foreground mb-6">
                This is a basic project demo. Payments are disabled. Fill the form and click "Proceed" to see how it would look.
              </p>
              <form className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-muted-foreground mb-1">Selected Plan</label>
                  <input
                    value={plans.find((p) => p.id === selectedPlan)?.name}
                    readOnly
                    className="w-full rounded-md border border-border bg-muted/30 px-3 py-2"
                  />
                </div>
                <div>
                  <label className="block text-sm text-muted-foreground mb-1">Billing Cycle</label>
                  <input value={billing} readOnly className="w-full rounded-md border border-border bg-muted/30 px-3 py-2" />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm text-muted-foreground mb-1">Email</label>
                  <input type="email" placeholder="you@example.com" className="w-full rounded-md border border-border px-3 py-2" />
                </div>
                <div>
                  <label className="block text-sm text-muted-foreground mb-1">Card Number (disabled)</label>
                  <input disabled placeholder="4242 4242 4242 4242" className="w-full rounded-md border border-border px-3 py-2 bg-muted/30" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm text-muted-foreground mb-1">Expiry (disabled)</label>
                    <input disabled placeholder="MM/YY" className="w-full rounded-md border border-border px-3 py-2 bg-muted/30" />
                  </div>
                  <div>
                    <label className="block text-sm text-muted-foreground mb-1">CVC (disabled)</label>
                    <input disabled placeholder="123" className="w-full rounded-md border border-border px-3 py-2 bg-muted/30" />
                  </div>
                </div>
                <div className="md:col-span-2 mt-2">
                  <Button
                    type="button"
                    className="w-full bg-gradient-hero text-primary-foreground"
                    onClick={() =>
                      toast({
                        title: "Checkout (Demo)",
                        description: "Payments are disabled in this demo.",
                      })
                    }
                  >
                    Proceed to Checkout
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Subscription;
